import { createContext } from 'react'
import type { Flight, Notif } from '@/data/airport'

export type FlightChanges = Partial<Pick<Flight, 'status' | 'gate' | 'est'>>

export interface FlightsState {
  flights: Flight[]
  notifs: Notif[]
  unread: number
  markRead: () => void
  searchFlights: (q: string) => Flight[]
  /** Applies only the provided fields, so concurrent edits to other fields are never overwritten. */
  /** Returns an error message when the requested edit is invalid, otherwise null. */
  updateFlight: (id: string, changes: FlightChanges) => string | null
  /** Returns an error message when the flight is invalid, otherwise null. */
  createFlight: (flight: Omit<Flight, 'id'>) => string | null
  publishNotice: (message: string) => void
  /** Moves a flight to another gate and notifies passengers. Returns an error message, otherwise null. */
  reassignGate: (id: string, gate: string) => string | null
  /** Delays an active flight by the given minutes and notifies passengers. */
  delayFlight: (id: string, minutes: number) => void
  /** Cancels an active flight (frees its gate) and notifies passengers. */
  cancelFlight: (id: string) => void
}

export const FlightsContext = createContext<FlightsState | null>(null)
