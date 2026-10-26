import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import type { Flight, Notif } from '@/data/airport'
import { useAuth } from './use-auth'
import { useAdminLanguage } from './use-admin-language'
import { AdminFlightsContext, type AdminFlightChanges, type GateMoveRequest, type NewAdminFlight } from './admin-flights-context'

interface ApiFlight extends Flight { version: number }
interface ApiList<T> { items: T[]; unread?: number }

class ApiError extends Error {
  readonly status: number
  readonly code?: string
  constructor(message: string, status: number, code?: string) { super(message); this.status = status; this.code = code }
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: { ...(init.body ? { 'content-type': 'application/json' } : {}), ...init.headers },
  })
  const result = await response.json().catch(() => ({})) as T & { message?: string; code?: string }
  if (!response.ok) throw new ApiError(result.message ?? 'The request could not be completed.', response.status, result.code)
  return result
}

const json = (value: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(value) })

export function AdminFlightsProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth()
  const { t } = useAdminLanguage()
  const navigate = useNavigate()
  const redirecting = useRef(false)
  const [serviceDate, setServiceDate] = useState(() => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date()))
  const [flights, setFlights] = useState<ApiFlight[]>([])
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleAuthError = useCallback((cause: unknown) => {
    if (cause instanceof ApiError && cause.status === 401 && !redirecting.current) {
      redirecting.current = true
      void logout().finally(() => navigate('/login', { replace: true }))
    }
  }, [logout, navigate])

  const errorMessage = useCallback((cause: unknown) => {
    if (!(cause instanceof ApiError)) return t.errors.generic
    switch (cause.code) {
      case 'AUTH_REQUIRED': return t.errors.authRequired
      case 'PERMISSION_DENIED': return t.errors.permissionDenied
      case 'VALIDATION_ERROR': return t.errors.validation
      case 'DUPLICATE_RECORD': return t.errors.duplicateRecord
      case 'DUPLICATE_ACTIVE_FLIGHT': return t.errors.duplicateActiveFlight
      case 'FLIGHT_NOT_FOUND': return t.errors.flightNotFound
      case 'VERSION_CONFLICT': return t.errors.versionConflict
      case 'FLIGHT_FINISHED': return t.errors.flightFinished
      case 'LOGIN_RATE_LIMITED': return t.errors.rateLimited
      case 'ORIGIN_REJECTED': return t.errors.originRejected
      default: return t.errors.generic
    }
  }, [t])

  const refresh = useCallback(async (quiet = false) => {
    try {
      const [flightResult, eventResult] = await Promise.all([
        api<ApiList<ApiFlight>>(`/api/admin/flights?limit=500&date=${encodeURIComponent(serviceDate)}`),
        api<ApiList<Notif>>('/api/admin/events?limit=100'),
      ])
      setFlights(flightResult.items)
      setNotifs(eventResult.items)
      setUnread(eventResult.unread ?? 0)
      setError(null)
    } catch (cause) {
      handleAuthError(cause)
      const message = errorMessage(cause)
      setError(message)
      if (!quiet) toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [serviceDate, handleAuthError, errorMessage])

  useEffect(() => {
    void refresh(false)
    const timer = window.setInterval(() => void refresh(true), 5000)
    return () => window.clearInterval(timer)
  }, [refresh])

  const updateFlight = useCallback(async (id: string, changes: AdminFlightChanges) => {
    const current = flights.find((flight) => flight.id === id)
    if (!current) return t.errors.flightNotFound
    try {
      const result = await api<{ flight: ApiFlight }>(`/api/admin/flights/${encodeURIComponent(id)}`, {
        method: 'PATCH', body: JSON.stringify({ version: current.version, changes }),
      })
      setFlights((items) => items.map((flight) => flight.id === id ? result.flight : flight))
      return null
    } catch (cause) {
      handleAuthError(cause)
      const message = errorMessage(cause)
      toast.error(message)
      await refresh(true)
      return message
    }
  }, [flights, refresh, handleAuthError, errorMessage, t])

  const createFlight = useCallback(async (flight: NewAdminFlight) => {
    try {
      const result = await api<{ flight: ApiFlight }>('/api/admin/flights', json(flight))
      setFlights((items) => [result.flight, ...items])
      await refresh(true)
      return null
    } catch (cause) {
      handleAuthError(cause)
      return errorMessage(cause)
    }
  }, [refresh, handleAuthError, errorMessage])

  const act = useCallback(async (id: string, action: string, values: Record<string, unknown> = {}) => {
    const current = flights.find((flight) => flight.id === id)
    if (!current) return t.errors.flightNotFound
    try {
      const result = await api<{ flight: ApiFlight }>(`/api/admin/flights/${encodeURIComponent(id)}/actions`, {
        ...json({ version: current.version, action, ...values }),
      })
      setFlights((items) => items.map((flight) => flight.id === id ? result.flight : flight))
      await refresh(true)
      return null
    } catch (cause) {
      handleAuthError(cause)
      const message = errorMessage(cause)
      toast.error(message)
      await refresh(true)
      return message
    }
  }, [flights, refresh, handleAuthError, errorMessage, t])

  const reassignGate = useCallback((id: string, gate: string) => act(id, 'reassign_gate', { gate }), [act])

  const reassignGates = useCallback(async (moves: GateMoveRequest[]) => {
    try {
      await api('/api/admin/flights/reassign-batch', json({ moves }))
      await refresh(true)
      return null
    } catch (cause) {
      handleAuthError(cause)
      const message = errorMessage(cause)
      toast.error(message)
      await refresh(true)
      return message
    }
  }, [refresh, handleAuthError, errorMessage])

  const delayFlight = useCallback((id: string, minutes: number) => act(id, 'delay', { minutes }), [act])
  const cancelFlight = useCallback((id: string) => act(id, 'cancel'), [act])
  const advanceFlight = useCallback((id: string) => act(id, 'advance'), [act])

  const publishNotice = useCallback(async (message: string) => {
    try {
      await api('/api/admin/notices', json({ message }))
      await refresh(true)
      return null
    } catch (cause) {
      handleAuthError(cause)
      const text = errorMessage(cause)
      toast.error(text)
      return text
    }
  }, [refresh, handleAuthError, errorMessage])

  const markRead = useCallback(async () => {
    try {
      await api('/api/admin/events/read', json({}))
      setUnread(0)
      setNotifs((items) => items.map((item) => ({ ...item, isRead: true })))
    } catch (cause) {
      handleAuthError(cause)
      toast.error(errorMessage(cause))
    }
  }, [handleAuthError, errorMessage])

  const value = useMemo(() => ({
    flights, notifs, unread, serviceDate, setServiceDate, loading, error, refresh: () => refresh(false), markRead,
    updateFlight, createFlight, publishNotice, reassignGate, reassignGates,
    delayFlight, cancelFlight, advanceFlight,
  }), [flights, notifs, unread, serviceDate, loading, error, refresh, markRead, updateFlight, createFlight, publishNotice, reassignGate, reassignGates, delayFlight, cancelFlight, advanceFlight])

  return <AdminFlightsContext.Provider value={value}>{children}</AdminFlightsContext.Provider>
}
