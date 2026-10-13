import { useContext } from 'react'
import { FlightsContext } from './flights-context'

export function useFlights() {
  const context = useContext(FlightsContext)
  if (!context) throw new Error('useFlights must be used inside FlightsProvider')
  return context
}
