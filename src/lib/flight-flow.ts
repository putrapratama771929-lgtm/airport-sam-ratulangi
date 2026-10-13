import type { Flight, FlightStatus } from '@/data/airport'

/** Natural progression of a flight's status. Single source of truth for the simulator and the admin dashboard. */
export const DEP_ORDER: FlightStatus[] = ['SCHEDULED', 'CHECK-IN', 'BOARDING', 'DEPARTED']
export const ARR_ORDER: FlightStatus[] = ['SCHEDULED', 'FINAL CALL', 'LANDED']

export const isFinished = (f: Pick<Flight, 'status'>) =>
  f.status === 'DEPARTED' || f.status === 'LANDED' || f.status === 'CANCELLED'

/** The status a flight moves to next, or null when it has reached a final state. */
export function nextStatus(f: Pick<Flight, 'kind' | 'status'>): FlightStatus | null {
  if (isFinished(f)) return null
  if (f.status === 'DELAYED') return f.kind === 'departure' ? 'BOARDING' : 'LANDED'
  const order = f.kind === 'departure' ? DEP_ORDER : ARR_ORDER
  const idx = order.indexOf(f.status)
  if (idx >= 0) return order[idx + 1] ?? null
  // Statuses outside the normal order (e.g. a departure set to FINAL CALL by an operator)
  return f.kind === 'departure' ? 'DEPARTED' : 'LANDED'
}

const LABELS: Partial<Record<FlightStatus, string>> = {
  'CHECK-IN': 'Open check-in',
  BOARDING: 'Start boarding',
  'FINAL CALL': 'Final call',
  DEPARTED: 'Mark departed',
  LANDED: 'Mark landed',
}

/** Button label for the action that `nextStatus` will apply. */
export function actionLabel(f: Pick<Flight, 'kind' | 'status'>): string {
  const next = nextStatus(f)
  return next ? (LABELS[next] ?? 'Advance') : 'Completed'
}

/** Gate must be prefixed with the wing letter and be within the wing's gate range. */
export const GATES_PER_WING = { D: 8, I: 4 } as const

export function validateGate(gate: string, wing: Flight['wing']): string | null {
  const m = /^([DI])(\d{1,2})$/.exec(gate.trim().toUpperCase())
  if (!m) return 'Gate must look like D1 or I3.'
  if (m[1] !== wing) return `Gate ${gate.toUpperCase()} does not belong to the ${wing === 'D' ? 'domestic' : 'international'} wing.`
  const n = Number(m[2])
  if (n < 1 || n > GATES_PER_WING[wing]) return `The ${wing === 'D' ? 'domestic' : 'international'} wing has gates ${wing}1–${wing}${GATES_PER_WING[wing]}.`
  return null
}
