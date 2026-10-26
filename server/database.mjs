import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'

const PASSWORD_BYTES = 64

export function createDatabase(filename) {
  const db = new DatabaseSync(filename)
  db.exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;')
  if (filename !== ':memory:') db.exec('PRAGMA journal_mode = WAL;')
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role = 'operator'),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);

    CREATE TABLE IF NOT EXISTS flights (
      id TEXT PRIMARY KEY,
      no TEXT NOT NULL,
      airline TEXT NOT NULL,
      city TEXT NOT NULL,
      service_date TEXT NOT NULL,
      wing TEXT NOT NULL CHECK (wing IN ('D', 'I')),
      gate TEXT NOT NULL,
      sched TEXT NOT NULL,
      est TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('SCHEDULED', 'CHECK-IN', 'BOARDING', 'FINAL CALL', 'DELAYED', 'DEPARTED', 'LANDED', 'CANCELLED')),
      kind TEXT NOT NULL CHECK (kind IN ('departure', 'arrival')),
      version INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS flights_no_kind_idx ON flights(no, kind);
    CREATE INDEX IF NOT EXISTS flights_wing_status_idx ON flights(wing, status);

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('info', 'delay', 'gate', 'boarding')),
      message TEXT NOT NULL,
      message_code TEXT,
      message_params_json TEXT,
      flight_id TEXT REFERENCES flights(id) ON DELETE SET NULL,
      actor_email TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS events_created_idx ON events(created_at DESC);
    CREATE INDEX IF NOT EXISTS events_unread_idx ON events(is_read, created_at DESC);

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      actor_id TEXT NOT NULL REFERENCES users(id),
      actor_email TEXT NOT NULL,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      before_json TEXT,
      after_json TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS audit_created_idx ON audit_log(created_at DESC);
  `)
  const flightColumns = new Set(db.prepare('PRAGMA table_info(flights)').all().map((column) => column.name))
  if (!flightColumns.has('service_date')) {
    db.exec("ALTER TABLE flights ADD COLUMN service_date TEXT NOT NULL DEFAULT '1970-01-01'")
  }
  const eventColumns = new Set(db.prepare('PRAGMA table_info(events)').all().map((column) => column.name))
  if (!eventColumns.has('message_code')) db.exec('ALTER TABLE events ADD COLUMN message_code TEXT')
  if (!eventColumns.has('message_params_json')) db.exec('ALTER TABLE events ADD COLUMN message_params_json TEXT')
  db.exec('CREATE INDEX IF NOT EXISTS flights_service_date_idx ON flights(service_date, est)')
  return db
}

export function createPilotOperator(db, email, password) {
  const normalized = String(email ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Enter a valid operator email address.')
  if (typeof password !== 'string' || password.length < 12) throw new Error('Pilot operator passwords must be at least 12 characters.')
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, PASSWORD_BYTES).toString('hex')
  const id = randomUUID()
  const now = new Date().toISOString()
  db.prepare('INSERT INTO users (id, email, password_salt, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, normalized, salt, hash, 'operator', now)
  return { id, email: normalized, role: 'operator', createdAt: now }
}

export function verifyPilotOperator(db, email, password) {
  const user = db.prepare('SELECT id, email, password_salt, password_hash, role FROM users WHERE email = ? COLLATE NOCASE')
    .get(String(email ?? '').trim())
  // Perform a password derivation for unknown users too, reducing timing differences.
  const salt = user?.password_salt ?? '0'.repeat(32)
  const expected = user?.password_hash ?? '0'.repeat(PASSWORD_BYTES * 2)
  const actual = scryptSync(String(password ?? ''), salt, PASSWORD_BYTES).toString('hex')
  const matches = timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'))
  if (!user || !matches) return null
  return { id: user.id, email: user.email, role: user.role }
}

export const hashSessionToken = (token) => createHash('sha256').update(token).digest('hex')

export function createSession(db, userId, token, expiresAt) {
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(hashSessionToken(token), userId, expiresAt, new Date().toISOString())
}

export function getSessionUser(db, token, now = Date.now()) {
  if (!token) return null
  const result = db.prepare(`
    SELECT users.id, users.email, users.role
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `).get(hashSessionToken(token), now)
  return result ? { id: result.id, email: result.email, role: result.role } : null
}

export function removeSession(db, token) {
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashSessionToken(token))
}

export function insertFlight(db, flight, actor, now = new Date().toISOString()) {
  const id = randomUUID()
  db.prepare(`
    INSERT INTO flights (id, no, airline, city, service_date, wing, gate, sched, est, status, kind, version, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `).run(id, flight.no, flight.airline, flight.city, flight.serviceDate, flight.wing, flight.gate, flight.sched, flight.est, flight.status, flight.kind, now, now)
  const saved = db.prepare('SELECT * FROM flights WHERE id = ?').get(id)
  recordAudit(db, actor, 'flight.created', 'flight', id, null, saved, now)
  return saved
}

export function getFlight(db, id) {
  return db.prepare('SELECT * FROM flights WHERE id = ?').get(id) ?? null
}

export function listFlights(db, { wing, kind, status, query, serviceDate, sort = 'estimate', direction = 'asc', limit, offset }) {
  const clauses = []
  const params = []
  if (wing) { clauses.push('wing = ?'); params.push(wing) }
  if (kind) { clauses.push('kind = ?'); params.push(kind) }
  if (status) { clauses.push('status = ?'); params.push(status) }
  if (serviceDate) { clauses.push('service_date = ?'); params.push(serviceDate) }
  if (query) {
    clauses.push('(no LIKE ? OR airline LIKE ? OR city LIKE ? OR gate LIKE ?)')
    const pattern = `%${query}%`
    params.push(pattern, pattern, pattern, pattern)
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const orderColumns = { estimate: 'est', flight: 'no', airline: 'airline', route: 'city', gate: 'gate', status: 'status' }
  const orderColumn = orderColumns[sort] ?? orderColumns.estimate
  const orderDirection = direction === 'desc' ? 'DESC' : 'ASC'
  const total = db.prepare(`SELECT COUNT(*) AS count FROM flights ${where}`).get(...params).count
  const items = db.prepare(`SELECT * FROM flights ${where} ORDER BY ${orderColumn} ${orderDirection}, no ASC LIMIT ? OFFSET ?`).all(...params, limit, offset)
  return { items, total }
}

export function updateFlight(db, before, changes, actor, now = new Date().toISOString(), action = 'flight.updated') {
  const next = { ...before, ...changes, version: before.version + 1, updated_at: now }
  db.prepare(`
    UPDATE flights SET no = ?, airline = ?, city = ?, service_date = ?, wing = ?, gate = ?, sched = ?, est = ?, status = ?, kind = ?, version = ?, updated_at = ?
    WHERE id = ? AND version = ?
  `).run(next.no, next.airline, next.city, next.serviceDate ?? next.service_date, next.wing, next.gate, next.sched, next.est, next.status, next.kind, next.version, now, before.id, before.version)
  const saved = getFlight(db, before.id)
  recordAudit(db, actor, action, 'flight', before.id, before, saved, now)
  return saved
}

export function insertEvent(db, { type = 'info', message, messageCode = null, messageParams = null, flightId = null, actorEmail }, now = new Date().toISOString()) {
  const id = randomUUID()
  db.prepare('INSERT INTO events (id, type, message, message_code, message_params_json, flight_id, actor_email, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)')
    .run(id, type, message, messageCode, messageParams ? JSON.stringify(messageParams) : null, flightId, actorEmail, now)
  return db.prepare('SELECT * FROM events WHERE id = ?').get(id)
}

export function listEvents(db, { type, limit = 100, offset = 0 } = {}) {
  const where = type ? 'WHERE type = ?' : ''
  const params = type ? [type] : []
  return db.prepare(`SELECT * FROM events ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset)
}

export function unreadEventsCount(db) {
  return db.prepare('SELECT COUNT(*) AS count FROM events WHERE is_read = 0').get().count
}

export function markEventsRead(db) {
  db.prepare('UPDATE events SET is_read = 1 WHERE is_read = 0').run()
}

export function recordAudit(db, actor, action, entity, entityId, before, after, now = new Date().toISOString()) {
  db.prepare(`
    INSERT INTO audit_log (id, actor_id, actor_email, action, entity, entity_id, before_json, after_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(randomUUID(), actor.id, actor.email, action, entity, entityId, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null, now)
}

export function listAudit(db, limit = 100) {
  return db.prepare(`
    SELECT id, actor_email, action, entity, entity_id, before_json, after_json, created_at
    FROM audit_log ORDER BY created_at DESC LIMIT ?
  `).all(limit)
}
