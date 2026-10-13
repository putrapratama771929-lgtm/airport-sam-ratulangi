import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { initialFlights, addMinutes, fmtTime, isValidTime, type Flight, type Notif } from '@/data/airport'
import { isFinished, nextStatus, validateGate } from '@/lib/flight-flow'
import { searchFlights as searchIn } from '@/lib/flight-search'
import { FlightsContext, type FlightChanges } from './flights-context'
import { validateFlightChanges } from './flight-validation'

const TICK_MS = 14_000
const MAX_NOTIFS = 30

let notifId = 0
let manualFlightId = 0

const makeNotif = (msg: string, type: Notif['type']): Notif => ({ id: ++notifId, time: fmtTime(new Date()), msg, type })

interface Step {
  patch: FlightChanges
  notice?: { msg: string; type: Notif['type'] }
}

/**
 * Pure simulation of what happens to one flight on a tick. `roll` is a random number in [0, 1).
 * Returns null when nothing changes. No React state is touched here.
 */
function simulateStep(f: Flight, roll: number, random: () => number): Step | null {
  const route = f.kind === 'departure' ? `to ${f.city}` : `from ${f.city}`

  // 18%: delay (only before boarding)
  if (roll < 0.18 && (f.status === 'SCHEDULED' || f.status === 'CHECK-IN')) {
    return {
      patch: { status: 'DELAYED', est: addMinutes(f.est, 30) },
      notice: { msg: `Flight ${f.no} ${route} is delayed by approx. 30 minutes.`, type: 'delay' },
    }
  }

  // 10%: gate change for departures that are checking in or boarding
  if (roll < 0.28 && f.kind === 'departure' && (f.status === 'CHECK-IN' || f.status === 'BOARDING')) {
    const gateCount = f.wing === 'I' ? 4 : 8
    const gate = `${f.wing}${Math.floor(random() * gateCount) + 1}`
    if (gate === f.gate) return null
    return { patch: { gate }, notice: { msg: `Gate change: flight ${f.no} now departs from Gate ${gate}.`, type: 'gate' } }
  }

  // Otherwise advance to the next status
  const next = nextStatus(f)
  if (!next) return null
  let notice: Step['notice']
  if (next === 'BOARDING') notice = { msg: `Boarding: ${f.no} to ${f.city} at Gate ${f.gate}.`, type: 'boarding' }
  else if (next === 'LANDED') notice = { msg: `Flight ${f.no} from ${f.city} has landed.`, type: 'info' }
  return { patch: { status: next }, notice }
}

export function FlightsProvider({ children }: { children: ReactNode }) {
  const [flights, setFlights] = useState<Flight[]>(() => initialFlights())
  const [notifs, setNotifs] = useState<Notif[]>(() => [
    makeNotif('Welcome to Sam Ratulangi International Airport. All systems operating normally.', 'info'),
  ])
  const [unread, setUnread] = useState(0)
  const flightsRef = useRef(flights)

  useEffect(() => {
    flightsRef.current = flights
  }, [flights])

  // Adds a notice. The notification object is built here (not inside the state updater) so updaters stay pure.
  const notify = useCallback((msg: string, type: Notif['type']) => {
    const notif = makeNotif(msg, type)
    setNotifs((prev) => [notif, ...prev].slice(0, MAX_NOTIFS))
    setUnread((n) => n + 1)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const candidates = flightsRef.current.filter((f) => !isFinished(f))
      if (!candidates.length) return
      const target = candidates[Math.floor(Math.random() * candidates.length)]
      const step = simulateStep(target, Math.random(), Math.random)
      if (!step) return

      setFlights((prev) => prev.map((f) => (f.id === target.id ? { ...f, ...step.patch } : f)))
      if (step.notice) notify(step.notice.msg, step.notice.type)
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [notify])

  const searchFlights = useCallback((q: string) => searchIn(flightsRef.current, q), [])

  const updateFlight = useCallback((id: string, changes: FlightChanges) => {
    const flight = flightsRef.current.find((item) => item.id === id)
    if (!flight) return 'Flight not found.'
    const error = validateFlightChanges(flight, changes)
    if (error) return error
    setFlights((previous) => previous.map((flight) => (flight.id === id ? { ...flight, ...changes } : flight)))
    return null
  }, [])

  const createFlight = useCallback(
    (input: Omit<Flight, 'id'>) => {
      const flight: Omit<Flight, 'id'> = {
        ...input,
        no: input.no.trim().toUpperCase().replace(/\s+/g, ' '),
        airline: input.airline.trim(),
        city: input.city.trim(),
        gate: input.gate.trim().toUpperCase(),
      }
      if (!flight.no || !flight.airline || !flight.city) return 'Flight number, airline and route are required.'
      if (!isValidTime(flight.sched) || !isValidTime(flight.est)) return 'Enter valid scheduled and estimated times.'
      const gateError = validateGate(flight.gate, flight.wing)
      if (gateError) return gateError
      const duplicate = flightsRef.current.some((f) => f.no === flight.no && f.kind === flight.kind && !isFinished(f))
      if (duplicate) return `${flight.no} is already on the board as an active ${flight.kind}.`

      setFlights((previous) => [{ ...flight, id: `manual-${++manualFlightId}-${Date.now()}` }, ...previous])
      notify(`Operations added flight ${flight.no} ${flight.kind === 'departure' ? 'to' : 'from'} ${flight.city}.`, 'info')
      return null
    },
    [notify],
  )

  const publishNotice = useCallback((message: string) => notify(message, 'info'), [notify])

  const reassignGate = useCallback(
    (id: string, gate: string) => {
      const flight = flightsRef.current.find((f) => f.id === id)
      if (!flight) return 'Flight not found.'
      const target = gate.trim().toUpperCase()
      const gateError = validateGate(target, flight.wing)
      if (gateError) return gateError
      if (flight.gate === target) return null
      setFlights((previous) => previous.map((f) => (f.id === id ? { ...f, gate: target } : f)))
      const verb = flight.kind === 'departure' ? 'now departs from' : 'now arrives at'
      notify(`Gate change: flight ${flight.no} ${verb} Gate ${target}.`, 'gate')
      return null
    },
    [notify],
  )

  const delayFlight = useCallback(
    (id: string, minutes: number) => {
      const flight = flightsRef.current.find((f) => f.id === id)
      if (!flight || isFinished(flight) || minutes <= 0) return
      setFlights((previous) => previous.map((f) => (f.id === id ? { ...f, status: 'DELAYED', est: addMinutes(f.est, minutes) } : f)))
      const route = flight.kind === 'departure' ? `to ${flight.city}` : `from ${flight.city}`
      notify(`Flight ${flight.no} ${route} is delayed by approx. ${minutes} minutes.`, 'delay')
    },
    [notify],
  )

  const cancelFlight = useCallback(
    (id: string) => {
      const flight = flightsRef.current.find((f) => f.id === id)
      if (!flight || isFinished(flight)) return
      setFlights((previous) => previous.map((f) => (f.id === id ? { ...f, status: 'CANCELLED' } : f)))
      const route = flight.kind === 'departure' ? `to ${flight.city}` : `from ${flight.city}`
      notify(`Flight ${flight.no} ${route} has been cancelled. Please contact your airline.`, 'delay')
    },
    [notify],
  )

  const markRead = useCallback(() => setUnread(0), [])

  const value = useMemo(
    () => ({ flights, notifs, unread, markRead, searchFlights, updateFlight, createFlight, publishNotice, reassignGate, delayFlight, cancelFlight }),
    [flights, notifs, unread, markRead, searchFlights, updateFlight, createFlight, publishNotice, reassignGate, delayFlight, cancelFlight],
  )

  return <FlightsContext.Provider value={value}>{children}</FlightsContext.Provider>
}
