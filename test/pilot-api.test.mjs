import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { createDatabase, createPilotOperator, insertFlight, listAudit, listFlights } from '../server/database.mjs'
import { createAdminHandler } from '../server/app.mjs'

const APP_ORIGIN = 'http://127.0.0.1:3000'
const operator = { email: 'ops@example.test', password: 'Pilot-password-482!' }

function harness() {
  const db = createDatabase(':memory:')
  createPilotOperator(db, operator.email, operator.password)
  const handler = createAdminHandler({ db, appOrigin: APP_ORIGIN, secureCookies: false })
  let cookie = ''
  const api = async (path, { method = 'GET', body, authenticated = true, origin = APP_ORIGIN } = {}) => {
    const headers = { origin }
    if (body !== undefined) headers['content-type'] = 'application/json'
    if (cookie && authenticated) headers.cookie = cookie
    const req = Readable.from(body === undefined ? [] : [JSON.stringify(body)])
    req.method = method
    req.url = path
    req.headers = headers
    req.socket = { remoteAddress: '127.0.0.1' }
    const res = {
      statusCode: 200,
      headers: {},
      writeHead(status, values = {}) { this.statusCode = status; Object.assign(this.headers, values) },
      setHeader(name, value) { this.headers[name.toLowerCase()] = value },
      end(value = '') { this.body = String(value) },
    }
    await handler(req, res)
    return {
      response: { status: res.statusCode, headers: { get: (name) => res.headers[name.toLowerCase()] ?? null } },
      data: res.body ? JSON.parse(res.body) : null,
    }
  }
  const signIn = async () => {
    const { response, data } = await api('/api/admin/session', { method: 'POST', body: operator, authenticated: false })
    assert.equal(response.status, 200)
    const setCookie = response.headers.get('set-cookie')
    cookie = setCookie.split(';')[0]
    return { data, setCookie }
  }
  return { db, api, signIn }
}

const newFlight = {
  no: 'GA 601',
  airline: 'Garuda Indonesia',
  city: 'Jakarta (CGK)',
  serviceDate: '2026-10-25',
  wing: 'D',
  gate: 'D1',
  sched: '10:00',
  est: '10:00',
  status: 'SCHEDULED',
  kind: 'departure',
}

test('admin data requires a server-issued session', async (t) => {
  const { db, api } = harness()
  t.after(() => db.close())
  const { response } = await api('/api/admin/flights', { authenticated: false })
  assert.equal(response.status, 401)
})

test('pilot operator can sign in and receive an HTTP-only session cookie', async (t) => {
  const { db, api, signIn } = harness()
  t.after(() => db.close())
  const { data: session, setCookie } = await signIn()
  assert.equal(session.user.email, operator.email)
  assert.equal(session.user.role, 'operator')
  assert.match(setCookie, /^mdc_admin_session=/)
  assert.match(setCookie, /HttpOnly/)
  const { data } = await api('/api/admin/session')
  assert.equal(data.user.email, operator.email)
})

test('sign-in failures share a generic response and are rate limited', async (t) => {
  const { db, api } = harness()
  t.after(() => db.close())
  let last
  for (let attempt = 0; attempt < 8; attempt++) {
    last = await api('/api/admin/session', { method: 'POST', body: { email: operator.email, password: 'wrong-password-000' }, authenticated: false })
    assert.equal(last.response.status, 401)
    assert.equal(last.data.message, 'Email or password is incorrect.')
  }
  const blocked = await api('/api/admin/session', { method: 'POST', body: { email: operator.email, password: 'wrong-password-000' }, authenticated: false })
  assert.equal(blocked.response.status, 429)
  assert.ok(Number(blocked.response.headers.get('retry-after')) > 0)
})

test('manual flight creation validates gate wing and reports validation errors safely', async (t) => {
  const { db, api, signIn } = harness()
  t.after(() => db.close())
  await signIn()
  const { response, data } = await api('/api/admin/flights', {
    method: 'POST',
    body: { ...newFlight, gate: 'I1' },
  })
  assert.equal(response.status, 400)
  assert.equal(data.code, 'VALIDATION_ERROR')
})

test('flight writes are versioned and audited', async (t) => {
  const { db, api, signIn } = harness()
  t.after(() => db.close())
  await signIn()
  const created = await api('/api/admin/flights', { method: 'POST', body: newFlight })
  assert.equal(created.response.status, 201)
  assert.equal(created.data.flight.no, newFlight.no)
  assert.equal(created.data.flight.version, 1)

  const edited = await api(`/api/admin/flights/${created.data.flight.id}`, {
    method: 'PATCH',
    body: { version: 1, changes: { est: '10:30' } },
  })
  assert.equal(edited.response.status, 200)
  assert.equal(edited.data.flight.est, '10:30')
  assert.equal(edited.data.flight.version, 2)

  const stale = await api(`/api/admin/flights/${created.data.flight.id}`, {
    method: 'PATCH',
    body: { version: 1, changes: { gate: 'D2' } },
  })
  assert.equal(stale.response.status, 409)
  assert.equal(stale.data.code, 'VERSION_CONFLICT')

  const audit = await api('/api/admin/audit-log')
  assert.equal(audit.response.status, 200)
  assert.ok(audit.data.items.some((item) => item.action === 'flight.created'))
  assert.ok(audit.data.items.some((item) => item.action === 'flight.updated'))
})

test('flight list is scoped to the selected WITA operating date', async (t) => {
  const { db, api, signIn } = harness()
  t.after(() => db.close())
  await signIn()
  await api('/api/admin/flights', { method: 'POST', body: newFlight })
  const today = await api('/api/admin/flights?date=2026-10-25')
  const nextDay = await api('/api/admin/flights?date=2026-10-26')
  assert.equal(today.data.total, 1)
  assert.equal(today.data.items[0].serviceDate, '2026-10-25')
  assert.equal(nextDay.data.total, 0)
})

test('flight list supports bounded filters, sorting, and pagination', async (t) => {
  const { db, api, signIn } = harness()
  t.after(() => db.close())
  await signIn()
  await api('/api/admin/flights', { method: 'POST', body: newFlight })
  await api('/api/admin/flights', { method: 'POST', body: { ...newFlight, no: 'JT 791', gate: 'D2' } })
  const result = await api('/api/admin/flights?date=2026-10-25&sort=flight&direction=desc&limit=1&offset=0')
  assert.equal(result.response.status, 200)
  assert.equal(result.data.total, 2)
  assert.equal(result.data.items.length, 1)
  assert.equal(result.data.items[0].no, 'JT 791')
})

test('SQLite retains pilot flights and audit rows after reopening the database', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'mdc-pilot-test-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const path = join(directory, 'pilot.sqlite')
  const db = createDatabase(path)
  const user = createPilotOperator(db, operator.email, operator.password)
  insertFlight(db, newFlight, user)
  db.close()

  const reopened = createDatabase(path)
  assert.equal(listFlights(reopened, { serviceDate: newFlight.serviceDate, limit: 100, offset: 0 }).total, 1)
  assert.equal(listAudit(reopened).some((item) => item.action === 'flight.created'), true)
  reopened.close()
})

test('operator actions update flight state and emit a WITA-stamped event', async (t) => {
  const { db, api, signIn } = harness()
  t.after(() => db.close())
  await signIn()
  const created = await api('/api/admin/flights', { method: 'POST', body: newFlight })
  const delayed = await api(`/api/admin/flights/${created.data.flight.id}/actions`, {
    method: 'POST',
    body: { version: 1, action: 'delay', minutes: 15 },
  })
  assert.equal(delayed.response.status, 200)
  assert.equal(delayed.data.flight.status, 'DELAYED')
  assert.equal(delayed.data.flight.est, '10:15')
  const events = await api('/api/admin/events?type=delay')
  assert.equal(events.data.items[0].type, 'delay')
  assert.match(events.data.items[0].time, /^\d{2}:\d{2}$/)
})

test('flight endpoints reject cross-origin mutations', async (t) => {
  const { db, api, signIn } = harness()
  t.after(() => db.close())
  await signIn()
  const { response, data } = await api('/api/admin/notices', {
    method: 'POST',
    body: { message: 'Should not be accepted.' },
    origin: 'https://unexpected.example',
  })
  assert.equal(response.status, 403)
  assert.equal(data.code, 'ORIGIN_REJECTED')
})

test('new flight events use shared desk read state', async (t) => {
  const { db, api, signIn } = harness()
  t.after(() => db.close())
  await signIn()
  const notice = await api('/api/admin/notices', {
    method: 'POST',
    body: { message: 'Gate change for GA 601.' },
  })
  assert.equal(notice.response.status, 201)

  const beforeRead = await api('/api/admin/events')
  assert.equal(beforeRead.data.unread, 1)

  const marked = await api('/api/admin/events/read', { method: 'POST', body: {} })
  assert.equal(marked.response.status, 200)
  assert.equal(marked.data.unread, 0)

  const afterRead = await api('/api/admin/events')
  assert.equal(afterRead.data.unread, 0)
})
