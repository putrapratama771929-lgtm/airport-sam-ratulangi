import { createServer } from 'node:http'
import { randomBytes, randomUUID } from 'node:crypto'
import { extname, resolve, sep } from 'node:path'
import { readFile } from 'node:fs/promises'
import {
  createSession,
  getFlight,
  getSessionUser,
  insertEvent,
  insertFlight,
  listAudit,
  listEvents,
  listFlights,
  markEventsRead,
  recordAudit,
  removeSession,
  unreadEventsCount,
  updateFlight,
  verifyPilotOperator,
} from './database.mjs'

const SESSION_COOKIE = 'mdc_admin_session'
const SESSION_MS = 8 * 60 * 60 * 1000
const MAX_BODY = 1024 * 1024
const STATUSES = new Set(['SCHEDULED', 'CHECK-IN', 'BOARDING', 'FINAL CALL', 'DELAYED', 'DEPARTED', 'LANDED', 'CANCELLED'])
const EVENT_TYPES = new Set(['info', 'delay', 'gate', 'boarding'])
const MIME = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp',
}

class HttpError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

const flightFromRow = (row) => ({
  id: row.id, no: row.no, airline: row.airline, city: row.city, wing: row.wing,
  serviceDate: row.service_date,
  gate: row.gate, sched: row.sched, est: row.est, status: row.status,
  kind: row.kind, version: row.version, createdAt: row.created_at, updatedAt: row.updated_at,
})

const witaTime = (iso) => new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}).format(new Date(iso))

const witaDate = (date) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Makassar', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(date)

function legacySystemNotice(row) {
  if (!row.flight_id || row.message_code) return null
  const patterns = [
    [/^Operations added flight (.+?) (to|from) (.+)\.$/, 'flight.added', (m) => ({ flight: m[1], direction: m[2], city: m[3] })],
    [/^Flight (.+?) (to|from) (.+) is delayed by (\d+) minutes\.$/, 'flight.delayed', (m) => ({ flight: m[1], direction: m[2], city: m[3], minutes: Number(m[4]) })],
    [/^Flight (.+?) (to|from) (.+) has been cancelled\. Please contact your airline\.$/, 'flight.cancelled', (m) => ({ flight: m[1], direction: m[2], city: m[3] })],
    [/^Gate change: flight (.+?) now uses Gate (.+)\.$/, 'flight.gate_changed', (m) => ({ flight: m[1], gate: m[2] })],
    [/^Operations updated (.+?): (.+)\.$/, 'flight.status_updated', (m) => ({ flight: m[1], status: m[2].toUpperCase() })],
  ]
  for (const [pattern, messageCode, createParams] of patterns) {
    const match = row.message.match(pattern)
    if (match) return { messageCode, messageParams: createParams(match) }
  }
  return null
}

const eventFromRow = (row) => ({
  id: row.id, time: witaTime(row.created_at), msg: row.message,
  ...(legacySystemNotice(row) ?? {}),
  ...(row.message_code ? {
    messageCode: row.message_code,
    messageParams: row.message_params_json ? JSON.parse(row.message_params_json) : undefined,
  } : {}),
  type: row.type, flightId: row.flight_id, actorEmail: row.actor_email,
  isRead: Boolean(row.is_read), createdAt: row.created_at,
})

function sendJson(res, status, value, extraHeaders = {}) {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'same-origin',
    'x-frame-options': 'DENY',
    ...extraHeaders,
  })
  res.end(body)
}

async function readJson(req) {
  let text = ''
  for await (const chunk of req) {
    text += chunk
    if (text.length > MAX_BODY) throw new HttpError(413, 'BODY_TOO_LARGE', 'Request body is too large.')
  }
  if (!text) return {}
  try {
    const value = JSON.parse(text)
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Object required')
    return value
  } catch {
    throw new HttpError(400, 'INVALID_JSON', 'Request body must be a JSON object.')
  }
}

function getCookie(req, name) {
  const header = req.headers.cookie ?? ''
  for (const part of header.split(';')) {
    const [key, ...value] = part.trim().split('=')
    if (key === name) return decodeURIComponent(value.join('='))
  }
  return null
}

function parseOriginList(value) {
  return new Set(String(value ?? '').split(',').map((v) => v.trim()).filter(Boolean))
}

function requireSameOrigin(req, allowedOrigins) {
  const origin = req.headers.origin
  if (!origin || !allowedOrigins.has(origin)) throw new HttpError(403, 'ORIGIN_REJECTED', 'Request origin is not allowed.')
}

function requireOperator(db, req) {
  const user = getSessionUser(db, getCookie(req, SESSION_COOKIE))
  if (!user) throw new HttpError(401, 'AUTH_REQUIRED', 'Sign in to use airport operations.')
  if (user.role !== 'operator') throw new HttpError(403, 'PERMISSION_DENIED', 'This account cannot perform airport operations.')
  return user
}

function transaction(db, action) {
  db.exec('BEGIN IMMEDIATE')
  try {
    const result = action()
    db.exec('COMMIT')
    return result
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

const trimText = (value) => typeof value === 'string' ? value.trim() : ''
const isTime = (value) => typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)

function validateGate(gate, wing) {
  const match = /^([DI])(\d{1,2})$/.exec(trimText(gate).toUpperCase())
  const maximum = wing === 'D' ? 8 : wing === 'I' ? 4 : 0
  if (!match || match[1] !== wing || Number(match[2]) < 1 || Number(match[2]) > maximum) {
    return `Gate ${trimText(gate).toUpperCase() || '—'} is not valid for the selected wing.`
  }
  return null
}

function validateFlight(value, previous = null) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'VALIDATION_ERROR', 'Flight details are required.')
  const candidate = {
    no: trimText(value.no ?? previous?.no).toUpperCase().replace(/\s+/g, ' '),
    airline: trimText(value.airline ?? previous?.airline),
    city: trimText(value.city ?? previous?.city),
    serviceDate: trimText(value.serviceDate ?? previous?.service_date),
    wing: value.wing ?? previous?.wing,
    gate: trimText(value.gate ?? previous?.gate).toUpperCase(),
    sched: trimText(value.sched ?? previous?.sched),
    est: trimText(value.est ?? previous?.est),
    status: value.status ?? previous?.status,
    kind: value.kind ?? previous?.kind,
  }
  if (!/^[A-Z0-9][A-Z0-9 -]{1,19}$/.test(candidate.no)) throw new HttpError(400, 'VALIDATION_ERROR', 'Enter a valid flight number.')
  if (!candidate.airline || candidate.airline.length > 100) throw new HttpError(400, 'VALIDATION_ERROR', 'Enter an airline name (up to 100 characters).')
  if (!candidate.city || candidate.city.length > 120) throw new HttpError(400, 'VALIDATION_ERROR', 'Enter a route or city (up to 120 characters).')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.serviceDate) || Number.isNaN(Date.parse(`${candidate.serviceDate}T00:00:00Z`)) || new Date(`${candidate.serviceDate}T00:00:00Z`).toISOString().slice(0, 10) !== candidate.serviceDate) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Choose a valid operating date in WITA.')
  }
  if (!['D', 'I'].includes(candidate.wing)) throw new HttpError(400, 'VALIDATION_ERROR', 'Wing must be Domestic or International.')
  const gateError = validateGate(candidate.gate, candidate.wing)
  if (gateError) throw new HttpError(400, 'VALIDATION_ERROR', gateError)
  if (!isTime(candidate.sched) || !isTime(candidate.est)) throw new HttpError(400, 'VALIDATION_ERROR', 'Enter valid scheduled and estimated WITA times.')
  if (!STATUSES.has(candidate.status)) throw new HttpError(400, 'VALIDATION_ERROR', 'Select a supported flight status.')
  if (!['arrival', 'departure'].includes(candidate.kind)) throw new HttpError(400, 'VALIDATION_ERROR', 'Select arrival or departure.')
  if (candidate.kind === 'departure' && candidate.status === 'LANDED') throw new HttpError(400, 'VALIDATION_ERROR', 'LANDED is not valid for a departure.')
  if (candidate.kind === 'arrival' && candidate.status === 'DEPARTED') throw new HttpError(400, 'VALIDATION_ERROR', 'DEPARTED is not valid for an arrival.')
  return candidate
}

function nextStatus(flight) {
  if (['DEPARTED', 'LANDED', 'CANCELLED'].includes(flight.status)) return null
  if (flight.status === 'DELAYED') return flight.kind === 'departure' ? 'BOARDING' : 'LANDED'
  const order = flight.kind === 'departure'
    ? ['SCHEDULED', 'CHECK-IN', 'BOARDING', 'DEPARTED']
    : ['SCHEDULED', 'FINAL CALL', 'LANDED']
  const index = order.indexOf(flight.status)
  return index >= 0 ? order[index + 1] ?? null : flight.kind === 'departure' ? 'DEPARTED' : 'LANDED'
}

const addMinutes = (time, amount) => {
  const [hour, minute] = time.split(':').map(Number)
  const total = (hour * 60 + minute + amount + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function flightNotice(flight, action, extra) {
  const direction = flight.kind === 'departure' ? 'to' : 'from'
  const route = `${direction} ${flight.city}`
  if (action === 'delay') return { type: 'delay', messageCode: 'flight.delayed', messageParams: { flight: flight.no, direction, city: flight.city, minutes: extra }, message: `Flight ${flight.no} ${route} is delayed by ${extra} minutes.` }
  if (action === 'cancel') return { type: 'delay', messageCode: 'flight.cancelled', messageParams: { flight: flight.no, direction, city: flight.city }, message: `Flight ${flight.no} ${route} has been cancelled. Please contact your airline.` }
  if (action === 'reassign_gate') return { type: 'gate', messageCode: 'flight.gate_changed', messageParams: { flight: flight.no, gate: extra }, message: `Gate change: flight ${flight.no} now uses Gate ${extra}.` }
  if (action === 'advance') return { type: ['BOARDING', 'FINAL CALL'].includes(extra) ? 'boarding' : 'info', messageCode: 'flight.status_updated', messageParams: { flight: flight.no, status: extra }, message: `Operations updated ${flight.no}: ${extra.toLowerCase()}.` }
  return null
}

function createRateLimiter() {
  const attempts = new Map()
  return (key, succeeded, now = Date.now()) => {
    const state = attempts.get(key) ?? { count: 0, resetAt: now + 15 * 60_000 }
    if (now >= state.resetAt) { state.count = 0; state.resetAt = now + 15 * 60_000 }
    if (succeeded === null) return state.count >= 8 ? Math.max(1, Math.ceil((state.resetAt - now) / 1000)) : 0
    if (succeeded) { attempts.delete(key); return 0 }
    state.count += 1
    attempts.set(key, state)
    return state.count > 8 ? Math.max(1, Math.ceil((state.resetAt - now) / 1000)) : 0
  }
}

function clearSessionCookie(res, secure) {
  res.setHeader('set-cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`)
}

async function serveStatic(req, res, staticDir, pathname) {
  if (!staticDir || req.method !== 'GET' || pathname.startsWith('/api/')) return false
  const decoded = decodeURIComponent(pathname)
  const candidate = resolve(staticDir, `.${decoded === '/' ? '/index.html' : decoded}`)
  if (candidate !== staticDir && !candidate.startsWith(`${staticDir}${sep}`)) return false
  let filePath = candidate
  try {
    const file = await readFile(filePath)
    res.writeHead(200, {
      'content-type': MIME[extname(filePath)] ?? 'application/octet-stream',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin',
      'x-frame-options': 'DENY',
    })
    res.end(file)
    return true
  } catch {
    if (extname(pathname)) return false
    filePath = resolve(staticDir, 'index.html')
    try {
      const file = await readFile(filePath)
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY' })
      res.end(file)
      return true
    } catch { return false }
  }
}

export function createAdminHandler({ db, appOrigins, appOrigin, secureCookies = false, staticDir = null, now = () => Date.now() }) {
  const allowedOrigins = appOrigins instanceof Set ? appOrigins : parseOriginList(appOrigins ?? appOrigin)
  const loginAttempt = createRateLimiter()

  return async (req, res) => {
    const requestId = randomUUID()
    try {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const path = url.pathname
      if (path.startsWith('/api/')) {
        res.setHeader('cache-control', 'no-store')
        if (req.method === 'GET' && path === '/api/admin/session') {
          const user = getSessionUser(db, getCookie(req, SESSION_COOKIE), now())
          return sendJson(res, 200, { user })
        }

        if (req.method === 'POST' && path === '/api/admin/session') {
          requireSameOrigin(req, allowedOrigins)
          const body = await readJson(req)
          const key = req.socket.remoteAddress ?? 'unknown'
          const blockedFor = loginAttempt(key, null, now())
          if (blockedFor) return sendJson(res, 429, { code: 'LOGIN_RATE_LIMITED', message: 'Too many sign-in attempts. Try again later.' }, { 'retry-after': String(blockedFor) })
          const safePassword = typeof body.password === 'string' && body.password.length <= 128 ? body.password : ''
          const user = verifyPilotOperator(db, body.email, safePassword)
          const retryAfter = loginAttempt(key, Boolean(user), now())
          if (retryAfter) return sendJson(res, 429, { code: 'LOGIN_RATE_LIMITED', message: 'Too many sign-in attempts. Try again later.' }, { 'retry-after': String(retryAfter) })
          if (!user) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.')
          const token = randomBytes(32).toString('base64url')
          createSession(db, user.id, token, now() + SESSION_MS)
          return sendJson(res, 200, { user: { id: user.id, email: user.email, role: user.role } }, { 'set-cookie': `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MS / 1000}${secureCookies ? '; Secure' : ''}` })
        }

        if (req.method === 'DELETE' && path === '/api/admin/session') {
          requireSameOrigin(req, allowedOrigins)
          const token = getCookie(req, SESSION_COOKIE)
          const user = getSessionUser(db, token, now())
          removeSession(db, token)
          if (user) recordAudit(db, user, 'session.ended', 'session', user.id, null, null, new Date(now()).toISOString())
          clearSessionCookie(res, secureCookies)
          return sendJson(res, 200, { user: null })
        }

        const user = requireOperator(db, req)
        if (['POST', 'PATCH', 'DELETE'].includes(req.method ?? '')) requireSameOrigin(req, allowedOrigins)

        if (req.method === 'GET' && path === '/api/admin/flights') {
          const wing = url.searchParams.get('wing') || undefined
          const kind = url.searchParams.get('kind') || undefined
          const status = url.searchParams.get('status') || undefined
          const sort = url.searchParams.get('sort') || 'estimate'
          const direction = url.searchParams.get('direction') || 'asc'
          const serviceDate = url.searchParams.get('date') || witaDate(new Date(now()))
          if (!/^\d{4}-\d{2}-\d{2}$/.test(serviceDate) || Number.isNaN(Date.parse(`${serviceDate}T00:00:00Z`)) || new Date(`${serviceDate}T00:00:00Z`).toISOString().slice(0, 10) !== serviceDate) {
            throw new HttpError(400, 'VALIDATION_ERROR', 'Date filter must use YYYY-MM-DD.')
          }
          if (wing && !['D', 'I'].includes(wing)) throw new HttpError(400, 'VALIDATION_ERROR', 'Wing filter is invalid.')
          if (kind && !['arrival', 'departure'].includes(kind)) throw new HttpError(400, 'VALIDATION_ERROR', 'Flight type filter is invalid.')
          if (status && !STATUSES.has(status)) throw new HttpError(400, 'VALIDATION_ERROR', 'Flight status filter is invalid.')
          if (!['estimate', 'flight', 'airline', 'route', 'gate', 'status'].includes(sort)) throw new HttpError(400, 'VALIDATION_ERROR', 'Flight sort field is invalid.')
          if (!['asc', 'desc'].includes(direction)) throw new HttpError(400, 'VALIDATION_ERROR', 'Sort direction must be asc or desc.')
          const limit = Math.min(500, Math.max(1, Number.parseInt(url.searchParams.get('limit') ?? '100', 10) || 100))
          const offset = Math.min(100_000, Math.max(0, Number.parseInt(url.searchParams.get('offset') ?? '0', 10) || 0))
          const result = listFlights(db, { wing, kind, status, serviceDate, sort, direction, query: trimText(url.searchParams.get('q')), limit, offset })
          return sendJson(res, 200, { items: result.items.map(flightFromRow), total: result.total, limit, offset })
        }

        if (req.method === 'POST' && path === '/api/admin/flights') {
          const flight = validateFlight(await readJson(req))
          const saved = transaction(db, () => {
            const duplicate = db.prepare("SELECT id FROM flights WHERE no = ? COLLATE NOCASE AND kind = ? AND service_date = ? AND status NOT IN ('DEPARTED', 'LANDED', 'CANCELLED')").get(flight.no, flight.kind, flight.serviceDate)
            if (duplicate) throw new HttpError(409, 'DUPLICATE_ACTIVE_FLIGHT', `${flight.no} is already on the board as an active ${flight.kind}.`)
            const created = insertFlight(db, flight, user, new Date(now()).toISOString())
            const direction = flight.kind === 'departure' ? 'to' : 'from'
            insertEvent(db, { type: 'info', message: `Operations added flight ${flight.no} ${direction} ${flight.city}.`, messageCode: 'flight.added', messageParams: { flight: flight.no, direction, city: flight.city }, flightId: created.id, actorEmail: user.email }, new Date(now()).toISOString())
            return created
          })
          return sendJson(res, 201, { flight: flightFromRow(saved) })
        }

        const flightMatch = path.match(/^\/api\/admin\/flights\/([^/]+)$/)
        if (req.method === 'PATCH' && flightMatch) {
          const id = decodeURIComponent(flightMatch[1])
          const body = await readJson(req)
          if (!Number.isInteger(body.version) || body.version < 1 || !body.changes || typeof body.changes !== 'object' || Array.isArray(body.changes)) {
            throw new HttpError(400, 'VALIDATION_ERROR', 'A current flight version and changes object are required.')
          }
          const allowed = new Set(['no', 'airline', 'city', 'serviceDate', 'wing', 'gate', 'sched', 'est', 'status', 'kind'])
          if (!Object.keys(body.changes).length || Object.keys(body.changes).some((key) => !allowed.has(key))) {
            throw new HttpError(400, 'VALIDATION_ERROR', 'The requested flight fields cannot be edited.')
          }
          const saved = transaction(db, () => {
            const before = getFlight(db, id)
            if (!before) throw new HttpError(404, 'FLIGHT_NOT_FOUND', 'Flight was not found.')
            if (before.version !== body.version) throw new HttpError(409, 'VERSION_CONFLICT', 'This flight changed. Refresh and review the latest values before saving.')
            const changes = {}
            for (const key of Object.keys(body.changes)) changes[key] = body.changes[key]
            const candidate = validateFlight(changes, before)
            const duplicate = db.prepare("SELECT id FROM flights WHERE no = ? COLLATE NOCASE AND kind = ? AND service_date = ? AND id <> ? AND status NOT IN ('DEPARTED', 'LANDED', 'CANCELLED')").get(candidate.no, candidate.kind, candidate.serviceDate, before.id)
            if (duplicate) throw new HttpError(409, 'DUPLICATE_ACTIVE_FLIGHT', `${candidate.no} is already on the board as an active ${candidate.kind} for this date.`)
            return updateFlight(db, before, candidate, user, new Date(now()).toISOString())
          })
          return sendJson(res, 200, { flight: flightFromRow(saved) })
        }

        if (req.method === 'POST' && path === '/api/admin/flights/reassign-batch') {
          const body = await readJson(req)
          if (!Array.isArray(body.moves) || body.moves.length < 1 || body.moves.length > 50) {
            throw new HttpError(400, 'VALIDATION_ERROR', 'Provide 1 to 50 gate moves.')
          }
          const ids = new Set()
          const updated = transaction(db, () => {
            const prepared = body.moves.map((move) => {
              if (!move || typeof move.id !== 'string' || ids.has(move.id) || !Number.isInteger(move.version)) {
                throw new HttpError(400, 'VALIDATION_ERROR', 'Each gate move needs a unique flight id and version.')
              }
              if (typeof move.gate !== 'string') throw new HttpError(400, 'VALIDATION_ERROR', 'Each gate move needs a destination gate.')
              ids.add(move.id)
              const before = getFlight(db, move.id)
              if (!before) throw new HttpError(404, 'FLIGHT_NOT_FOUND', 'A flight in the gate move was not found.')
              if (before.version !== move.version) throw new HttpError(409, 'VERSION_CONFLICT', 'A flight changed. Refresh conflicts before resolving them.')
              return { before, candidate: validateFlight({ gate: move.gate }, before) }
            })
            return prepared.map(({ before, candidate }) => {
              const saved = updateFlight(db, before, candidate, user, new Date(now()).toISOString(), 'flight.gate_reassigned')
              insertEvent(db, { type: 'gate', message: `Gate change: flight ${saved.no} now uses Gate ${saved.gate}.`, messageCode: 'flight.gate_changed', messageParams: { flight: saved.no, gate: saved.gate }, flightId: saved.id, actorEmail: user.email }, new Date(now()).toISOString())
              return flightFromRow(saved)
            })
          })
          return sendJson(res, 200, { flights: updated })
        }

        const actionMatch = path.match(/^\/api\/admin\/flights\/([^/]+)\/actions$/)
        if (req.method === 'POST' && actionMatch) {
          const id = decodeURIComponent(actionMatch[1])
          const body = await readJson(req)
          const result = transaction(db, () => {
            const before = getFlight(db, id)
            if (!before) throw new HttpError(404, 'FLIGHT_NOT_FOUND', 'Flight was not found.')
            if (body.version !== before.version) throw new HttpError(409, 'VERSION_CONFLICT', 'This flight changed. Refresh and try again.')
            let changes
            let action
            let extra
            if (body.action === 'advance') {
              const status = nextStatus(before)
              if (!status) throw new HttpError(409, 'FLIGHT_FINISHED', 'This flight is already complete.')
              changes = { status }
              action = 'advance'
              extra = status
            } else if (body.action === 'delay') {
              const minutes = Number(body.minutes)
              if (!Number.isInteger(minutes) || ![15, 30, 60].includes(minutes)) throw new HttpError(400, 'VALIDATION_ERROR', 'Delay must be 15, 30, or 60 minutes.')
              if (['DEPARTED', 'LANDED', 'CANCELLED'].includes(before.status)) throw new HttpError(409, 'FLIGHT_FINISHED', 'A completed flight cannot be delayed.')
              changes = { status: 'DELAYED', est: addMinutes(before.est, minutes) }
              action = 'delay'
              extra = minutes
            } else if (body.action === 'cancel') {
              if (['DEPARTED', 'LANDED', 'CANCELLED'].includes(before.status)) throw new HttpError(409, 'FLIGHT_FINISHED', 'A completed flight cannot be cancelled.')
              changes = { status: 'CANCELLED' }
              action = 'cancel'
            } else if (body.action === 'reassign_gate') {
              changes = { gate: body.gate }
              action = 'reassign_gate'
              extra = trimText(body.gate).toUpperCase()
            } else {
              throw new HttpError(400, 'VALIDATION_ERROR', 'Choose a supported flight action.')
            }
            const candidate = validateFlight(changes, before)
            const after = updateFlight(db, before, candidate, user, new Date(now()).toISOString(), `flight.${action}`)
            const notice = flightNotice(before, action, extra)
            if (notice) insertEvent(db, { ...notice, flightId: id, actorEmail: user.email }, new Date(now()).toISOString())
            return after
          })
          return sendJson(res, 200, { flight: flightFromRow(result) })
        }

        if (req.method === 'GET' && path === '/api/admin/events') {
          const type = url.searchParams.get('type') || undefined
          if (type && !EVENT_TYPES.has(type)) throw new HttpError(400, 'VALIDATION_ERROR', 'Event type filter is invalid.')
          const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get('limit') ?? '100', 10) || 100))
          const items = listEvents(db, { type, limit }).map(eventFromRow)
          return sendJson(res, 200, { items, unread: unreadEventsCount(db) })
        }

        if (req.method === 'POST' && path === '/api/admin/events/read') {
          transaction(db, () => {
            markEventsRead(db)
            recordAudit(db, user, 'events.marked_read', 'event_feed', 'shared', null, { unread: 0 }, new Date(now()).toISOString())
          })
          return sendJson(res, 200, { unread: 0 })
        }

        if (req.method === 'POST' && path === '/api/admin/notices') {
          const body = await readJson(req)
          const message = trimText(body.message)
          if (!message || message.length > 500) throw new HttpError(400, 'VALIDATION_ERROR', 'Notice must contain 1 to 500 characters.')
          const event = transaction(db, () => {
            const saved = insertEvent(db, { type: 'info', message, actorEmail: user.email }, new Date(now()).toISOString())
            recordAudit(db, user, 'notice.published', 'event', saved.id, null, { message }, new Date(now()).toISOString())
            return saved
          })
          return sendJson(res, 201, { event: eventFromRow(event) })
        }

        if (req.method === 'GET' && path === '/api/admin/audit-log') {
          const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get('limit') ?? '50', 10) || 50))
          return sendJson(res, 200, { items: listAudit(db, limit).map((row) => ({
            id: row.id, actorEmail: row.actor_email, action: row.action, entity: row.entity,
            entityId: row.entity_id, before: row.before_json ? JSON.parse(row.before_json) : null,
            after: row.after_json ? JSON.parse(row.after_json) : null, createdAt: row.created_at,
          })) })
        }

        throw new HttpError(404, 'NOT_FOUND', 'API route was not found.')
      }

      if (await serveStatic(req, res, staticDir, new URL(req.url ?? '/', 'http://localhost').pathname)) return
      sendJson(res, 404, { code: 'NOT_FOUND', message: 'Page was not found.' })
    } catch (error) {
      if (error instanceof HttpError) return sendJson(res, error.status, { code: error.code, message: error.message })
      if (String(error?.message ?? '').includes('UNIQUE constraint failed')) return sendJson(res, 409, { code: 'DUPLICATE_RECORD', message: 'A record with those details already exists.' })
      // Keep internals and stack traces out of API responses and logs.
      console.error(`Pilot API error ${requestId}`)
      sendJson(res, 500, { code: 'INTERNAL_ERROR', message: 'The request could not be completed.' })
    }
  }
}

export const createAdminServer = (options) => createServer(createAdminHandler(options))
