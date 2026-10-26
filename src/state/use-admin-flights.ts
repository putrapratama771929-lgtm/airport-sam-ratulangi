import { useContext } from 'react'
import { AdminFlightsContext } from './admin-flights-context'

export function useAdminFlights() {
  const context = useContext(AdminFlightsContext)
  if (!context) throw new Error('useAdminFlights must be used inside AdminFlightsProvider')
  return context
}
