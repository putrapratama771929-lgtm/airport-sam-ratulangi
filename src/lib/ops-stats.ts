import { boardKey, toMinutes, type Flight, type FlightStatus, type Notif } from '@/data/airport'
import { GATES_PER_WING, isFinished } from './flight-flow'

export type WingFilter = 'all' | Flight['wing']

export const filterWing = (flights: Flight[], wing: WingFilter) =>
  wing === 'all' ? flights : flights.filter((f) => f.wing === wing)

/** CSS colour (theme variable) used for each flight status across the ops dashboard. */
export const STATUS_COLOR: Record<FlightStatus, string> = {
  SCHEDULED: 'var(--ops-muted)',
  'CHECK-IN': 'var(--ops-cyan)',
  BOARDING: 'var(--ops-ok)',
  'FINAL CALL': 'var(--ops-cyan)',
  DELAYED: 'var(--ops-warn)',
  DEPARTED: 'var(--ops-ok)',
  LANDED: 'var(--ops-ok)',
  CANCELLED: 'var(--ops-bad)',
}

const gateCodes = (wing: Flight['wing']) => Array.from({ length: GATES_PER_WING[wing] }, (_, i) => `${wing}${i + 1}`)
export const GATES_BY_WING: Record<Flight['wing'], string[]> = { D: gateCodes('D'), I: gateCodes('I') }

// ---------- vitals ----------
export interface Vitals {
  tracked: number // all flights except cancelled
  finished: number
  active: number
  delayed: number
  boarding: number
  gatesUsed: number
  gatesTotal: number
}

export function computeVitals(flights: Flight[], wing: WingFilter): Vitals {
  const cancelled = flights.filter((f) => f.status === 'CANCELLED').length
  const activeFlights = flights.filter((f) => !isFinished(f))
  const occupied = new Set(activeFlights.map((f) => f.gate))
  const gates = wing === 'all' ? [...GATES_BY_WING.D, ...GATES_BY_WING.I] : GATES_BY_WING[wing]
  return {
    tracked: flights.length - cancelled,
    finished: flights.filter((f) => f.status === 'DEPARTED' || f.status === 'LANDED').length,
    active: activeFlights.length,
    delayed: flights.filter((f) => f.status === 'DELAYED').length,
    boarding: flights.filter((f) => f.status === 'BOARDING' || f.status === 'FINAL CALL').length,
    gatesUsed: gates.filter((g) => occupied.has(g)).length,
    gatesTotal: gates.length,
  }
}

// ---------- gates ----------
export type GateState = 'free' | 'active' | 'watch' | 'alert'
export interface GateInfo {
  state: GateState
  flights: Flight[]
}
const GATE_RANK: Record<GateState, number> = { free: 0, active: 1, watch: 2, alert: 3 }
const flightGateState = (f: Flight): GateState =>
  f.status === 'DELAYED' ? 'alert' : f.status === 'BOARDING' || f.status === 'FINAL CALL' ? 'watch' : 'active'

export function gateStates(flights: Flight[]): Record<string, GateInfo> {
  const out: Record<string, GateInfo> = {}
  for (const code of [...GATES_BY_WING.D, ...GATES_BY_WING.I]) out[code] = { state: 'free', flights: [] }
  for (const f of flights) {
    const info = out[f.gate]
    if (!info || isFinished(f)) continue
    info.flights.push(f)
    const s = flightGateState(f)
    if (GATE_RANK[s] > GATE_RANK[info.state]) info.state = s
  }
  return out
}

// ---------- airlines ----------
export interface AirlineRow {
  airline: string
  count: number
  delayed: number
}
export function airlineRanking(flights: Flight[], limit = 7): AirlineRow[] {
  const map = new Map<string, AirlineRow>()
  for (const f of flights) {
    const row = map.get(f.airline) ?? { airline: f.airline, count: 0, delayed: 0 }
    row.count++
    if (f.status === 'DELAYED') row.delayed++
    map.set(f.airline, row)
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.airline.localeCompare(b.airline)).slice(0, limit)
}

// ---------- hourly traffic ----------
export interface HourBucket {
  hour: number
  dep: number
  arr: number
  current: boolean
}
export function hourlyTraffic(flights: Flight[], refMinutes: number): HourBucket[] {
  const buckets = new Map<number, { dep: number; arr: number }>()
  const currentHour = Math.floor(refMinutes / 60)
  buckets.set(currentHour, { dep: 0, arr: 0 })
  for (const f of flights) {
    const m = toMinutes(f.est)
    if (m === null) continue
    const hour = Math.floor(m / 60)
    const b = buckets.get(hour) ?? { dep: 0, arr: 0 }
    if (f.kind === 'departure') b.dep++
    else b.arr++
    buckets.set(hour, b)
  }
  return [...buckets]
    .map(([hour, v]) => ({ hour, ...v, current: hour === currentHour }))
    .sort((a, b) => boardKey(`${a.hour}:00`, refMinutes) - boardKey(`${b.hour}:00`, refMinutes))
}

// ---------- notices ----------
export type Severity = 'high' | 'med' | 'info'
export const noticeSeverity = (type: Notif['type']): Severity =>
  type === 'delay' ? 'high' : type === 'gate' || type === 'boarding' ? 'med' : 'info'
export const SEVERITY_COLOR: Record<Severity, string> = {
  high: 'var(--ops-bad)',
  med: 'var(--ops-warn)',
  info: 'var(--ops-cyan)',
}
export const SEVERITY_LABEL: Record<Severity, string> = { high: 'HIGH', med: 'MED', info: 'INFO' }
