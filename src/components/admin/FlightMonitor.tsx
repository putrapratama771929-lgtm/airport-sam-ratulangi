import { useMemo } from 'react'
import { Search } from 'lucide-react'
import { boardKey, isValidTime, nowMinutes, type Flight, type FlightStatus } from '@/data/airport'
import { actionLabel, nextStatus, validateGate } from '@/lib/flight-flow'
import { STATUS_COLOR } from '@/lib/ops-stats'
import type { FlightChanges } from '@/state/flights-context'
import { Panel } from './Panel'

export type KindFilter = 'all' | Flight['kind']
const STATUSES: FlightStatus[] = ['SCHEDULED', 'CHECK-IN', 'BOARDING', 'FINAL CALL', 'DELAYED', 'DEPARTED', 'LANDED', 'CANCELLED']
const KINDS: Array<{ id: KindFilter; label: string }> = [
  { id: 'all', label: 'All flights' },
  { id: 'departure', label: 'Departures' },
  { id: 'arrival', label: 'Arrivals' },
]

interface Props {
  flights: Flight[]
  kind: KindFilter
  onKindChange: (k: KindFilter) => void
  query: string
  onQueryChange: (q: string) => void
  onUpdate: (id: string, changes: FlightChanges) => void
  onAdvance: (f: Flight) => void
  /** Ids of flights currently in a gate conflict. */
  clashIds: Set<string>
}

export function FlightMonitor({ flights, kind, onKindChange, query, onQueryChange, onUpdate, onAdvance, clashIds }: Props) {
  const rows = useMemo(() => {
    const ref = nowMinutes()
    const term = query.trim().toLowerCase()
    return flights
      .filter((f) => kind === 'all' || f.kind === kind)
      .filter((f) => !term || [f.no, f.airline, f.city, f.gate].some((v) => v.toLowerCase().includes(term)))
      .sort((a, b) => boardKey(a.est, ref) - boardKey(b.est, ref))
  }, [flights, kind, query])

  return (
    <Panel eyebrow="Flight management / 02" title="Flight monitor" right={<span className="ops-count">[{rows.length}]</span>}>
      <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:justify-between">
        <div className="flex gap-1" role="group" aria-label="Flight type">
          {KINDS.map((k) => (
            <button key={k.id} type="button" className="ops-chip flex-1 sm:flex-none" aria-pressed={kind === k.id} onClick={() => onKindChange(k.id)}>{k.label}</button>
          ))}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search flights</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ops-faint)]" />
          <input className="ops-input pl-9" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search flight, route, gate" />
        </label>
      </div>

      <div className="ops-scroll border-t border-[var(--ops-line)]">
        <table className="ops-table">
          <thead>
            <tr><th>Flight</th><th>Route</th><th>Gate</th><th>Estimate</th><th>Status</th><th className="text-right">Next step</th></tr>
          </thead>
          <tbody>
            {rows.map((f) => {
              const gateError = validateGate(f.gate, f.wing) ?? (clashIds.has(f.id) ? 'Gate conflict: another active flight uses this gate within 30 minutes.' : null)
              const next = nextStatus(f)
              return (
                <tr key={f.id}>
                  <td><p className="ops-flightno">{f.no}</p><p className="ops-sub mt-0.5">{f.airline}</p></td>
                  <td><p>{f.city}</p><p className="ops-sub mt-0.5">{f.kind === 'departure' ? 'Departure' : 'Arrival'} · sched. {f.sched}</p></td>
                  <td className="w-24">
                    <input
                      className="ops-input ops-input-ghost w-20"
                      aria-label={`Gate for ${f.no}`}
                      aria-invalid={gateError !== null}
                      title={gateError ?? undefined}
                      value={f.gate}
                      onChange={(e) => onUpdate(f.id, { gate: e.target.value.toUpperCase() })}
                    />
                  </td>
                  <td className="w-32">
                    <input
                      type="time"
                      className="ops-input ops-input-ghost w-28"
                      aria-label={`Estimated time for ${f.no}`}
                      aria-invalid={!isValidTime(f.est)}
                      value={f.est}
                      onChange={(e) => e.target.value && onUpdate(f.id, { est: e.target.value })}
                    />
                  </td>
                  <td className="w-44">
                    <select
                      className="ops-input ops-input-ghost"
                      aria-label={`Status for ${f.no}`}
                      style={{ color: STATUS_COLOR[f.status], fontWeight: 700 }}
                      value={f.status}
                      onChange={(e) => onUpdate(f.id, { status: e.target.value as FlightStatus })}
                    >
                      {STATUSES.map((s) => <option key={s} value={s} style={{ color: 'initial' }}>{s}</option>)}
                    </select>
                  </td>
                  <td className="text-right">
                    {next ? <button type="button" className="ops-btn ops-btn-sm" onClick={() => onAdvance(f)}>{actionLabel(f)}</button> : <span className="ops-sub">Completed</span>}
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && <tr><td colSpan={6} className="py-14 text-center text-[var(--ops-muted)]">No flights match the active filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
