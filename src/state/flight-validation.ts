import { isValidTime, type Flight, type FlightStatus } from '@/data/airport'
import { validateGate } from '@/lib/flight-flow'
import type { FlightChanges } from './flights-context'

const DEPARTURE_ONLY: FlightStatus[] = ['DEPARTED']
const ARRIVAL_ONLY: FlightStatus[] = ['LANDED']

/** Returns an error when an edit would make a flight internally inconsistent. */
export function validateFlightChanges(flight: Flight, changes: FlightChanges): string | null {
  if (changes.gate !== undefined) {
    const gateError = validateGate(changes.gate, flight.wing)
    if (gateError) return gateError
  }
  if (changes.est !== undefined && !isValidTime(changes.est)) return 'Enter a valid estimated time.'
  if (changes.status !== undefined) {
    if (flight.kind === 'departure' && ARRIVAL_ONLY.includes(changes.status)) return `${changes.status} is not valid for a departure.`
    if (flight.kind === 'arrival' && DEPARTURE_ONLY.includes(changes.status)) return `${changes.status} is not valid for an arrival.`
  }
  return null
}
