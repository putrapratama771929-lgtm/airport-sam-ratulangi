import { createContext } from 'react'
import type { Flight, Notif } from '@/data/airport'

export type AdminFlightChanges = Partial<Pick<Flight, 'no' | 'airline' | 'city' | 'serviceDate' | 'wing' | 'gate' | 'sched' | 'est' | 'status' | 'kind'>>
export type NewAdminFlight = Omit<Flight, 'id' | 'version' | 'createdAt' | 'updatedAt'> & { serviceDate: string }

export interface GateMoveRequest { id: string; version: number; gate: string }

export interface AdminFlightsState {
  flights: Flight[]
  notifs: Notif[]
  unread: number
  serviceDate: string
  setServiceDate: (date: string) => void
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  markRead: () => Promise<void>
  updateFlight: (id: string, changes: AdminFlightChanges) => Promise<string | null>
  createFlight: (flight: NewAdminFlight) => Promise<string | null>
  publishNotice: (message: string) => Promise<string | null>
  reassignGate: (id: string, gate: string) => Promise<string | null>
  reassignGates: (moves: GateMoveRequest[]) => Promise<string | null>
  delayFlight: (id: string, minutes: number) => Promise<string | null>
  cancelFlight: (id: string) => Promise<string | null>
  advanceFlight: (id: string) => Promise<string | null>
}

export const AdminFlightsContext = createContext<AdminFlightsState | null>(null)
