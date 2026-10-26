import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { boardKey, isValidTime, nowMinutes, type Flight, type FlightStatus } from '@/data/airport'
import { nextStatus, validateGate } from '@/lib/flight-flow'
import { STATUS_COLOR } from '@/lib/ops-stats'
import type { AdminFlightChanges } from '@/state/admin-flights-context'
import { Panel } from './Panel'
import { EditFlightDialog } from './FlightDialogs'
import { useAdminLanguage } from '@/state/use-admin-language'

export type KindFilter = 'all' | Flight['kind']
const STATUSES: FlightStatus[] = ['SCHEDULED', 'CHECK-IN', 'BOARDING', 'FINAL CALL', 'DELAYED', 'DEPARTED', 'LANDED', 'CANCELLED']
const KINDS: KindFilter[] = ['all', 'departure', 'arrival']
const PAGE_SIZE = 20

interface Props {
  flights: Flight[]
  kind: KindFilter
  onKindChange: (k: KindFilter) => void
  query: string
  onQueryChange: (q: string) => void
  onUpdate: (id: string, changes: AdminFlightChanges) => Promise<string | null>
  onAdvance: (f: Flight) => void
  /** Ids of flights currently in a gate conflict. */
  clashIds: Set<string>
}

function FlightRow({ flight, conflicted, onUpdate, onAdvance, onEdit }: {
  flight: Flight
  conflicted: boolean
  onUpdate: Props['onUpdate']
  onAdvance: Props['onAdvance']
  onEdit: (flight: Flight) => void
}) {
  const { t } = useAdminLanguage()
  const [gate, setGate] = useState(flight.gate)
  const [est, setEst] = useState(flight.est)
  const [status, setStatus] = useState(flight.status)
  const [saving, setSaving] = useState(false)

  const save = async (changes: AdminFlightChanges) => {
    setSaving(true)
    const error = await onUpdate(flight.id, changes)
    setSaving(false)
    if (error) {
      setGate(flight.gate)
      setEst(flight.est)
      setStatus(flight.status)
    }
  }

  const gateError = (validateGate(gate, flight.wing) ? t.monitor.invalidGate : null) ?? (conflicted ? t.monitor.gateConflict : null)
  const next = nextStatus(flight)
  const actionByStatus: Partial<Record<FlightStatus, string>> = {
    'CHECK-IN': t.actions.openCheckIn, BOARDING: t.actions.startBoarding, 'FINAL CALL': t.actions.finalCall,
    DEPARTED: t.actions.markDeparted, LANDED: t.actions.markLanded,
  }

  return (
    <tr aria-busy={saving} className="transition-colors duration-150 ease-out motion-reduce:transition-none">
      <td><p className="ops-flightno">{flight.no}</p><p className="ops-sub mt-0.5">{flight.airline}</p></td>
      <td><p>{flight.city}</p><p className="ops-sub mt-0.5">{flight.kind === 'departure' ? t.common.departure : t.common.arrival} · {t.monitor.schedule(flight.sched)}</p></td>
      <td className="w-24">
        <input
          className="ops-input ops-input-ghost w-20"
          aria-label={t.monitor.gateFor(flight.no)}
          aria-invalid={gateError !== null}
          aria-describedby={gateError ? `gate-error-${flight.id}` : undefined}
          title={gateError ?? undefined}
          value={gate}
          onChange={(event) => setGate(event.target.value.toUpperCase())}
          onBlur={() => gate !== flight.gate && void save({ gate })}
          disabled={saving}
        />
        {gateError && <span id={`gate-error-${flight.id}`} className="sr-only">{gateError}</span>}
      </td>
      <td className="w-32">
        <input
          type="time"
          className="ops-input ops-input-ghost w-28"
          aria-label={t.monitor.estimateFor(flight.no)}
          aria-invalid={!isValidTime(est)}
          value={est}
          onChange={(event) => setEst(event.target.value)}
          onBlur={() => est && est !== flight.est && void save({ est })}
          disabled={saving}
        />
      </td>
      <td className="w-44">
        <select
          className="ops-input ops-input-ghost"
          aria-label={t.monitor.statusFor(flight.no)}
          style={{ color: STATUS_COLOR[status], fontWeight: 700 }}
          value={status}
          onChange={(event) => {
            const nextStatusValue = event.target.value as FlightStatus
            setStatus(nextStatusValue)
            void save({ status: nextStatusValue })
          }}
          disabled={saving}
        >
          {STATUSES.map((value) => <option key={value} value={value} style={{ color: 'initial' }}>{t.status[value]}</option>)}
        </select>
      </td>
      <td className="text-right">
        <div className="flex justify-end gap-2">
          <button type="button" className="ops-btn ops-btn-sm" onClick={() => onEdit(flight)} disabled={saving}>{t.common.edit}</button>
          {next ? <button type="button" className="ops-btn ops-btn-sm" onClick={() => onAdvance(flight)} disabled={saving}>{actionByStatus[next] ?? t.actions.advance}</button> : <span className="ops-sub">{t.common.completed}</span>}
        </div>
      </td>
    </tr>
  )
}

export function FlightMonitor({ flights, kind, onKindChange, query, onQueryChange, onUpdate, onAdvance, clashIds }: Props) {
  const { t } = useAdminLanguage()
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<Flight | null>(null)
  const [sortBy, setSortBy] = useState<'estimate' | 'flight' | 'airline' | 'route' | 'gate' | 'status'>('estimate')
  const [descending, setDescending] = useState(false)
  const rows = useMemo(() => {
    const ref = nowMinutes()
    const term = query.trim().toLowerCase()
    const compare = (a: Flight, b: Flight) => {
      if (sortBy === 'estimate') return boardKey(a.est, ref) - boardKey(b.est, ref)
      const left = sortBy === 'flight' ? a.no : sortBy === 'airline' ? a.airline : sortBy === 'route' ? a.city : sortBy === 'gate' ? a.gate : a.status
      const right = sortBy === 'flight' ? b.no : sortBy === 'airline' ? b.airline : sortBy === 'route' ? b.city : sortBy === 'gate' ? b.gate : b.status
      return left.localeCompare(right)
    }
    return flights
      .filter((f) => kind === 'all' || f.kind === kind)
      .filter((f) => !term || [f.no, f.airline, f.city, f.gate].some((v) => v.toLowerCase().includes(term)))
      .sort((a, b) => (descending ? -1 : 1) * compare(a, b))
  }, [flights, kind, query, sortBy, descending])
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const visibleRows = rows.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  return (
    <>
    <Panel eyebrow={t.monitor.eyebrow} title={t.monitor.title} right={<span className="ops-count">[{rows.length}]</span>}>
      <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:justify-between">
        <div className="flex gap-1" role="group" aria-label={t.monitor.flightType}>
          {KINDS.map((id) => {
            const label = id === 'all' ? t.monitor.allFlights : id === 'departure' ? t.monitor.departures : t.monitor.arrivals
            return <button key={id} type="button" className="ops-chip flex-1 sm:flex-none" aria-pressed={kind === id} onClick={() => { setPage(0); onKindChange(id) }}>{label}</button>
          })}
        </div>
        <div className="flex items-center gap-2">
          <label className="ops-filter">
            <span className="sr-only">{t.monitor.sortBy}</span>
            <select className="ops-input" value={sortBy} onChange={(event) => { setPage(0); setSortBy(event.target.value as typeof sortBy) }}>
              <option value="estimate">{t.monitor.sortEstimate}</option>
              <option value="flight">{t.monitor.sortFlight}</option>
              <option value="airline">{t.monitor.sortAirline}</option>
              <option value="route">{t.monitor.sortRoute}</option>
              <option value="gate">{t.monitor.sortGate}</option>
              <option value="status">{t.monitor.sortStatus}</option>
            </select>
          </label>
          <button type="button" className="ops-btn ops-btn-icon" onClick={() => setDescending((value) => !value)} aria-label={descending ? t.monitor.sortAscending : t.monitor.sortDescending} title={descending ? t.monitor.sortAscending : t.monitor.sortDescending}>
            {descending ? '↓' : '↑'}
          </button>
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">{t.common.searchFlights}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ops-faint)]" />
          <input className="ops-input pl-9" value={query} onChange={(e) => { setPage(0); onQueryChange(e.target.value) }} placeholder={t.monitor.searchPlaceholder} />
        </label>
      </div>

      <div className="ops-scroll border-t border-[var(--ops-line)]">
        <table className="ops-table">
          <thead>
            <tr><th>{t.monitor.tableFlight}</th><th>{t.monitor.tableRoute}</th><th>{t.monitor.tableGate}</th><th>{t.monitor.tableEstimate}</th><th>{t.monitor.tableStatus}</th><th className="text-right">{t.monitor.nextStep}</th></tr>
          </thead>
          <tbody>
            {visibleRows.map((f) => {
              return (
                <FlightRow key={`${f.id}:${f.version ?? 1}`} flight={f} conflicted={clashIds.has(f.id)} onUpdate={onUpdate} onAdvance={onAdvance} onEdit={setEditing} />
              )
            })}
            {rows.length === 0 && <tr><td colSpan={6} className="py-14 text-center text-[var(--ops-muted)]">{t.monitor.noMatches}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[var(--ops-line)] px-4 py-3">
        <p className="ops-sub" aria-live="polite">
          {rows.length === 0 ? t.monitor.noMatches : t.monitor.showing(currentPage * PAGE_SIZE + 1, Math.min((currentPage + 1) * PAGE_SIZE, rows.length), rows.length)}
        </p>
        <div className="flex gap-2">
          <button type="button" className="ops-btn ops-btn-sm" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={currentPage === 0}>{t.monitor.previous}</button>
          <button type="button" className="ops-btn ops-btn-sm" onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))} disabled={currentPage >= pageCount - 1}>{t.monitor.next}</button>
        </div>
      </div>
    </Panel>
    {editing && <EditFlightDialog key={`${editing.id}:${editing.version ?? 1}`} flight={editing} onClose={() => setEditing(null)} onUpdate={onUpdate} />}
    </>
  )
}
