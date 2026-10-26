import { randomBytes } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createDatabase, createPilotOperator } from '../server/database.mjs'

const DB_PATH = resolve(process.env.PILOT_DB_PATH ?? './var/airport-pilot.sqlite')
const DEMO_ACTOR_EMAIL = 'synthetic-data@invalid.test'
const SEED_KEY = 'airport-admin-pilot-demo-v1'
const now = new Date()

const witaParts = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}).formatToParts(now)
const currentMinutes = Number(witaParts.find((part) => part.type === 'hour')?.value ?? 0) * 60
  + Number(witaParts.find((part) => part.type === 'minute')?.value ?? 0)
const serviceDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Makassar', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(now)
const referenceMinutes = Math.min(1080, Math.max(180, currentMinutes))

function timeAt(offset) {
  const value = Math.max(0, Math.min(1439, Math.round(referenceMinutes + offset)))
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`
}

const baseRoutes = [
  ['D0', 'GA 601', 'Garuda Indonesia', 'Jakarta (CGK)', 'D', 'departure', -130, 'DEPARTED', 'D1'],
  ['D1', 'JT 791', 'Lion Air', 'Makassar (UPG)', 'D', 'departure', -15, 'CHECK-IN', 'D2'],
  ['D2', 'ID 6181', 'Batik Air', 'Jakarta (CGK)', 'D', 'departure', -7, 'BOARDING', 'D3'],
  ['D3', 'QG 311', 'Citilink', 'Surabaya (SUB)', 'D', 'departure', -2, 'FINAL CALL', 'D4'],
  ['D4', 'IU 774', 'Super Air Jet', 'Denpasar (DPS)', 'D', 'departure', 20, 'SCHEDULED', 'D5'],
  ['D5', 'JT 3743', 'Lion Air', 'Balikpapan (BPN)', 'D', 'departure', 35, 'DELAYED', 'D6', 30],
  ['D6', 'ID 6357', 'Batik Air', 'Sorong (SOQ)', 'D', 'departure', 55, 'CANCELLED', 'D7'],
  ['D7', 'IW 1361', 'Wings Air', 'Ternate (TTE)', 'D', 'departure', 80, 'CHECK-IN', 'D8'],
  ['D8', 'SJ 589', 'Sriwijaya Air', 'Gorontalo (GTO)', 'D', 'departure', 100, 'SCHEDULED', 'D1'],
  ['D9', 'TR 215', 'Scoot', 'Singapore (SIN)', 'I', 'departure', 125, 'DELAYED', 'I2', 35],
  ['D10', 'AK 1725', 'AirAsia', 'Kuala Lumpur (KUL)', 'I', 'departure', 150, 'SCHEDULED', 'I3'],
  ['D11', 'GA 845', 'Garuda Indonesia', 'Singapore (SIN)', 'I', 'departure', 175, 'BOARDING', 'I3'],
  ['D12', 'QG 555', 'Citilink', 'Jakarta (CGK)', 'D', 'departure', 205, 'SCHEDULED', 'D5'],
  ['D13', 'JT 787', 'Lion Air', 'Surabaya (SUB)', 'D', 'departure', 230, 'FINAL CALL', 'D7'],
  ['D14', 'IU 3770', 'Super Air Jet', 'Makassar (UPG)', 'D', 'departure', 260, 'SCHEDULED', 'D8'],
  ['D15', 'IW 1313', 'Wings Air', 'Tahuna (NAH)', 'D', 'departure', 290, 'SCHEDULED', 'D1'],
  ['A0', 'GA 600', 'Garuda Indonesia', 'Jakarta (CGK)', 'D', 'arrival', -100, 'LANDED', 'D1'],
  ['A1', 'JT 790', 'Lion Air', 'Makassar (UPG)', 'D', 'arrival', -55, 'LANDED', 'D2'],
  ['A2', 'ID 6180', 'Batik Air', 'Jakarta (CGK)', 'D', 'arrival', 15, 'SCHEDULED', 'D5'],
  ['A3', 'QG 310', 'Citilink', 'Surabaya (SUB)', 'D', 'arrival', 45, 'DELAYED', 'D6', 30],
  ['A4', 'IU 773', 'Super Air Jet', 'Denpasar (DPS)', 'D', 'arrival', 80, 'CANCELLED', 'D7'],
  ['A5', 'JT 3744', 'Lion Air', 'Balikpapan (BPN)', 'D', 'arrival', 120, 'SCHEDULED', 'D8'],
  ['A6', 'ID 6358', 'Batik Air', 'Sorong (SOQ)', 'D', 'arrival', 150, 'FINAL CALL', 'D3'],
  ['A7', 'IW 1362', 'Wings Air', 'Ternate (TTE)', 'D', 'arrival', 190, 'SCHEDULED', 'D4'],
  ['A8', 'TR 214', 'Scoot', 'Singapore (SIN)', 'I', 'arrival', 20, 'SCHEDULED', 'I1'],
  ['A9', 'AK 1724', 'AirAsia', 'Kuala Lumpur (KUL)', 'I', 'arrival', 60, 'DELAYED', 'I2', 40],
  ['A10', 'GA 844', 'Garuda Indonesia', 'Singapore (SIN)', 'I', 'arrival', -90, 'LANDED', 'I3'],
  ['A11', 'JT 786', 'Lion Air', 'Surabaya (SUB)', 'D', 'arrival', 240, 'SCHEDULED', 'D4'],
]

const extraRoutes = [
  ['EXD01', 'JT 938', 'Lion Air', 'Gorontalo (GTO)', 'D', 'departure', 180, 'SCHEDULED', 'D3'],
  ['EXD02', 'ID 6291', 'Batik Air', 'Jakarta (CGK)', 'D', 'arrival', 110, 'DELAYED', 'D6', 25],
  ['EXD03', 'IW 1377', 'Wings Air', 'Tahuna (NAH)', 'D', 'departure', 340, 'SCHEDULED', 'D1'],
  ['EXD04', 'QG 559', 'Citilink', 'Surabaya (SUB)', 'D', 'departure', -150, 'DEPARTED', 'D7'],
  ['EXI01', 'TR 217', 'Scoot', 'Singapore (SIN)', 'I', 'departure', 36, 'SCHEDULED', 'I1'],
  ['EXI02', 'AK 1726', 'AirAsia', 'Kuala Lumpur (KUL)', 'I', 'departure', 80, 'BOARDING', 'I2'],
  ['EXI03', 'GA 846', 'Garuda Indonesia', 'Singapore (SIN)', 'I', 'arrival', 130, 'SCHEDULED', 'I3'],
  ['EXI04', 'TR 219', 'Scoot', 'Singapore (SIN)', 'I', 'arrival', 270, 'SCHEDULED', 'I3'],
]

const flights = [...baseRoutes, ...extraRoutes].map((route) => {
  const [id, no, airline, city, wing, kind, offset, status, gate, delay = 0] = route
  const sched = timeAt(offset)
  return {
    id: `demo-${id}`, no, airline, city, serviceDate, wing, kind,
    sched, est: timeAt(offset + delay), status, gate,
    version: 1,
    createdAt: new Date(now.getTime() - 2 * 60 * 60_000).toISOString(),
    updatedAt: new Date(now.getTime() - 10 * 60_000).toISOString(),
  }
})
const byId = new Map(flights.map((flight) => [flight.id.replace('demo-', ''), flight]))
const timestamp = (minutesAgo) => new Date(now.getTime() - minutesAgo * 60_000).toISOString()
const snapshot = (flight, patch = {}) => ({ ...flight, ...patch })

const events = [
  { flightId: 'D5', minutesAgo: 3, type: 'delay', message: 'Flight JT 3743 to Balikpapan (BPN) is delayed by 30 minutes.', code: 'flight.delayed', params: { flight: 'JT 3743', direction: 'to', city: 'Balikpapan (BPN)', minutes: 30 } },
  { flightId: 'A9', minutesAgo: 6, type: 'gate', message: 'Gate change: flight AK 1724 now uses Gate I2.', code: 'flight.gate_changed', params: { flight: 'AK 1724', gate: 'I2' } },
  { flightId: 'D2', minutesAgo: 9, type: 'boarding', message: 'Flight ID 6181 advanced to boarding.', code: 'flight.status_updated', params: { flight: 'ID 6181', status: 'BOARDING' } },
  { flightId: 'A4', minutesAgo: 14, type: 'delay', message: 'Flight IU 773 from Denpasar (DPS) has been cancelled.', code: 'flight.cancelled', params: { flight: 'IU 773', direction: 'from', city: 'Denpasar (DPS)' } },
  { flightId: 'A3', minutesAgo: 18, type: 'delay', message: 'Flight QG 310 from Surabaya (SUB) is delayed by 30 minutes.', code: 'flight.delayed', params: { flight: 'QG 310', direction: 'from', city: 'Surabaya (SUB)', minutes: 30 } },
  { flightId: 'A0', minutesAgo: 24, type: 'info', message: 'Flight GA 600 from Jakarta (CGK) has landed.', code: 'flight.status_updated', params: { flight: 'GA 600', status: 'LANDED' } },
  { flightId: 'D3', minutesAgo: 31, type: 'info', message: 'Flight QG 311 advanced to final call.', code: 'flight.status_updated', params: { flight: 'QG 311', status: 'FINAL CALL' } },
  { flightId: 'EXI01', minutesAgo: 38, type: 'gate', message: 'Gate change: flight TR 217 now uses Gate I1.', code: 'flight.gate_changed', params: { flight: 'TR 217', gate: 'I1' } },
  { flightId: 'D11', minutesAgo: 44, type: 'boarding', message: 'Flight GA 845 advanced to boarding.', code: 'flight.status_updated', params: { flight: 'GA 845', status: 'BOARDING' } },
  { flightId: 'D9', minutesAgo: 53, type: 'delay', message: 'Flight TR 215 to Singapore (SIN) is delayed by 35 minutes.', code: 'flight.delayed', params: { flight: 'TR 215', direction: 'to', city: 'Singapore (SIN)', minutes: 35 } },
  { flightId: null, minutesAgo: 70, type: 'info', message: 'Synthetic admin pilot dataset loaded for local review.', code: null, params: null, isRead: 1 },
  { flightId: 'EXI02', minutesAgo: 82, type: 'boarding', message: 'Flight AK 1726 advanced to boarding.', code: 'flight.status_updated', params: { flight: 'AK 1726', status: 'BOARDING' } },
]

const audit = [
  ['flight.created', 'EXI01', null, null],
  ['flight.delayed', 'D5', { status: 'CHECK-IN' }, { status: 'DELAYED' }],
  ['flight.gate_reassigned', 'A9', { gate: 'I4' }, { gate: 'I2' }],
  ['flight.updated', 'D2', { status: 'CHECK-IN' }, { status: 'BOARDING' }],
  ['flight.cancelled', 'D6', { status: 'SCHEDULED' }, { status: 'CANCELLED' }],
  ['flight.created', 'EXD01', null, null],
  ['flight.delayed', 'A3', { status: 'SCHEDULED' }, { status: 'DELAYED' }],
  ['flight.gate_reassigned', 'D8', { gate: 'D5' }, { gate: 'D1' }],
  ['flight.updated', 'D13', { status: 'BOARDING' }, { status: 'FINAL CALL' }],
  ['flight.cancelled', 'A4', { status: 'SCHEDULED' }, { status: 'CANCELLED' }],
].map(([action, flightId, beforePatch, afterPatch], index) => {
  const flight = byId.get(flightId)
  const before = beforePatch ? snapshot(flight, beforePatch) : null
  const after = afterPatch ? snapshot(flight, afterPatch) : flight
  return { action, flightId, before, after, createdAt: timestamp([2, 5, 8, 12, 17, 22, 28, 34, 41, 49][index]) }
})

mkdirSync(dirname(DB_PATH), { recursive: true })
const db = createDatabase(DB_PATH)
try {
  db.exec(`CREATE TABLE IF NOT EXISTS pilot_demo_seed (
    seed_key TEXT PRIMARY KEY,
    seeded_at TEXT NOT NULL,
    service_date TEXT NOT NULL,
    flight_count INTEGER NOT NULL,
    event_count INTEGER NOT NULL,
    audit_count INTEGER NOT NULL
  )`)

  if (db.prepare('SELECT seed_key FROM pilot_demo_seed WHERE seed_key = ?').get(SEED_KEY)) {
    console.log(`Synthetic pilot data already exists for ${serviceDate}; no rows changed.`)
  } else if (db.prepare('SELECT 1 FROM flights LIMIT 1').get()) {
    throw new Error('The pilot database already contains flights. Refusing to mix synthetic rows into an existing flight set.')
  } else {
    db.exec('BEGIN IMMEDIATE')
    try {
      let actor = db.prepare('SELECT id, email FROM users WHERE email = ? COLLATE NOCASE').get(DEMO_ACTOR_EMAIL)
      if (!actor) {
        actor = createPilotOperator(db, DEMO_ACTOR_EMAIL, randomBytes(32).toString('hex'))
      }

      const addFlight = db.prepare(`INSERT INTO flights
        (id, no, airline, city, service_date, wing, gate, sched, est, status, kind, version, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      for (const flight of flights) {
        addFlight.run(flight.id, flight.no, flight.airline, flight.city, flight.serviceDate, flight.wing, flight.gate, flight.sched, flight.est, flight.status, flight.kind, flight.version, flight.createdAt, flight.updatedAt)
      }

      const addEvent = db.prepare(`INSERT INTO events
        (id, type, message, message_code, message_params_json, flight_id, actor_email, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      for (const event of events) {
        addEvent.run(randomBytes(16).toString('hex'), event.type, event.message, event.code, event.params ? JSON.stringify(event.params) : null,
          event.flightId ? `demo-${event.flightId}` : null, actor.email, event.isRead ?? 0, timestamp(event.minutesAgo))
      }

      const addAudit = db.prepare(`INSERT INTO audit_log
        (id, actor_id, actor_email, action, entity, entity_id, before_json, after_json, created_at)
        VALUES (?, ?, ?, ?, 'flight', ?, ?, ?, ?)`)
      for (const entry of audit) {
        addAudit.run(randomBytes(16).toString('hex'), actor.id, actor.email, entry.action, `demo-${entry.flightId}`,
          entry.before ? JSON.stringify(entry.before) : null, entry.after ? JSON.stringify(entry.after) : null, entry.createdAt)
      }

      db.prepare(`INSERT INTO pilot_demo_seed (seed_key, seeded_at, service_date, flight_count, event_count, audit_count)
        VALUES (?, ?, ?, ?, ?, ?)`).run(SEED_KEY, now.toISOString(), serviceDate, flights.length, events.length, audit.length)
      db.exec('COMMIT')
      console.log(`Seeded ${flights.length} synthetic flights, ${events.length} events, and ${audit.length} audit entries for ${serviceDate} (WITA).`)
    } catch (error) {
      db.exec('ROLLBACK')
      throw error
    }
  }
} finally {
  db.close()
}
