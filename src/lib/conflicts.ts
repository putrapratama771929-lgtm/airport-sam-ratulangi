import { toMinutes, type Flight } from '@/data/airport'
import { isFinished, validateGate } from './flight-flow'
import { GATES_BY_WING } from './ops-stats'

/** Two active flights on the same gate closer together than this (minutes) are treated as a clash. */
export const GATE_WINDOW_MIN = 30

export interface GateConflict {
  id: string
  kind: 'clash' | 'invalid'
  gate: string
  /** clash: the two flights competing for the gate. invalid: the single flight with a bad gate. */
  flights: Flight[]
  /** Minutes between the two estimates (clash only). */
  gap: number
}

export interface GateMove {
  flight: Flight
  from: string
  to: string
}

/** Circular distance in minutes between two "HH:mm" times (handles midnight wrap). Infinity when invalid. */
function gapMinutes(a: string, b: string): number {
  const x = toMinutes(a)
  const y = toMinutes(b)
  if (x === null || y === null) return Number.POSITIVE_INFINITY
  const d = Math.abs(x - y)
  return Math.min(d, 1440 - d)
}

/** Signed circular delta (b - a) in minutes, in the range [-720, 720). */
function deltaMinutes(a: string, b: string): number {
  const x = toMinutes(a)
  const y = toMinutes(b)
  if (x === null || y === null) return 0
  return ((((y - x) % 1440) + 1440 + 720) % 1440) - 720
}

export function detectConflicts(flights: Flight[]): GateConflict[] {
  const active = flights.filter((f) => !isFinished(f))
  const out: GateConflict[] = []

  const byGate = new Map<string, Flight[]>()
  for (const f of active) {
    if (validateGate(f.gate, f.wing)) {
      out.push({ id: `invalid-${f.id}`, kind: 'invalid', gate: f.gate || '—', flights: [f], gap: 0 })
      continue
    }
    const list = byGate.get(f.gate.trim().toUpperCase()) ?? []
    list.push(f)
    byGate.set(f.gate.trim().toUpperCase(), list)
  }

  for (const [gate, list] of byGate) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const gap = gapMinutes(list[i].est, list[j].est)
        if (gap >= GATE_WINDOW_MIN) continue
        const [a, b] = deltaMinutes(list[i].est, list[j].est) >= 0 ? [list[i], list[j]] : [list[j], list[i]]
        out.push({ id: `clash-${[a.id, b.id].sort().join('-')}`, kind: 'clash', gate, flights: [a, b], gap })
      }
    }
  }

  // Tightest clashes first, invalid gates last.
  return out.sort((x, y) => (x.kind === y.kind ? x.gap - y.gap : x.kind === 'clash' ? -1 : 1))
}

/** How committed a flight is to its gate: passengers already at the gate should not be moved. */
const commitment = (f: Flight) => (f.status === 'BOARDING' || f.status === 'FINAL CALL' ? 3 : f.status === 'CHECK-IN' ? 2 : 1)

/** The flight that should give way in a clash: the less committed one, or the later one on a tie. */
export function flightToMove(conflict: GateConflict): Flight {
  const [a, b] = conflict.flights
  if (!b) return a
  const ca = commitment(a)
  const cb = commitment(b)
  if (ca !== cb) return ca < cb ? a : b
  return deltaMinutes(a.est, b.est) >= 0 ? b : a
}

/** Best free gate on the flight's own wing: no active flight within the window, least busy first. Null if none. */
export function suggestGate(flight: Flight, flights: Flight[]): string | null {
  const active = flights.filter((f) => f.id !== flight.id && !isFinished(f))
  const free = GATES_BY_WING[flight.wing].filter(
    (g) => g !== flight.gate.trim().toUpperCase() && !active.some((o) => o.gate.trim().toUpperCase() === g && gapMinutes(o.est, flight.est) < GATE_WINDOW_MIN),
  )
  if (!free.length) return null
  const load = (g: string) => active.filter((o) => o.gate.trim().toUpperCase() === g).length
  return free.sort((a, b) => load(a) - load(b) || Number(a.slice(1)) - Number(b.slice(1)))[0]
}

/**
 * Plans gate moves that clear every conflict it can. Works on a private copy, re-checking after each move,
 * so one move never creates a new clash. Conflicts with no free gate are returned as `unresolved`.
 */
export function planResolutions(flights: Flight[]): { moves: GateMove[]; unresolved: GateConflict[] } {
  let work = flights
  const moves: GateMove[] = []
  const skipped = new Set<string>()
  const unresolved: GateConflict[] = []

  for (let guard = 0; guard < 50; guard++) {
    const next = detectConflicts(work).find((c) => !skipped.has(c.id))
    if (!next) break
    const target = flightToMove(next)
    const to = suggestGate(target, work)
    if (!to) {
      skipped.add(next.id)
      unresolved.push(next)
      continue
    }
    moves.push({ flight: target, from: target.gate, to })
    work = work.map((f) => (f.id === target.id ? { ...f, gate: to } : f))
  }
  return { moves, unresolved }
}
