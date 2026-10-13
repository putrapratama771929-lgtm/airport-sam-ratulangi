import { useMemo } from 'react'
import type { Flight, FlightStatus } from '@/data/airport'
import { STATUS_COLOR } from '@/lib/ops-stats'
import { Panel } from './Panel'

const ORDER: FlightStatus[] = ['SCHEDULED', 'CHECK-IN', 'BOARDING', 'FINAL CALL', 'DELAYED', 'DEPARTED', 'LANDED', 'CANCELLED']
const R = 38
const C = 2 * Math.PI * R

/** Donut of how many flights are in each status right now. */
export function StatusMix({ flights }: { flights: Flight[] }) {
  const parts = useMemo(() => {
    const counts = ORDER.map((status) => ({ status, n: flights.filter((f) => f.status === status).length })).filter((p) => p.n > 0)
    const total = counts.reduce((sum, p) => sum + p.n, 0)
    return {
      total,
      rows: counts.map((p, i) => {
        const before = counts.slice(0, i).reduce((sum, c) => sum + c.n, 0)
        const len = (p.n / total) * C
        return {
          ...p,
          pct: Math.round((p.n / total) * 100),
          len: Math.max(len - (counts.length > 1 ? 1.5 : 0), 0.5),
          offset: (before / total) * C,
        }
      }),
    }
  }, [flights])

  return (
    <Panel eyebrow="Status mix / 05" title="Flights by status" right={<span className="ops-count">[{parts.total}]</span>}>
      <div className="ops-body flex items-center gap-5">
        <svg viewBox="0 0 100 100" className="h-32 w-32 flex-none -rotate-90" role="img" aria-label={`${parts.total} flights by status`}>
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--ops-seg-off)" strokeWidth="11" />
          {parts.rows.map((p) => (
            <circle key={p.status} cx="50" cy="50" r={R} fill="none" stroke={STATUS_COLOR[p.status]} strokeWidth="11" strokeDasharray={`${p.len} ${C - p.len}`} strokeDashoffset={-p.offset}>
              <title>{`${p.status}: ${p.n}`}</title>
            </circle>
          ))}
          <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="rotate-90" style={{ transformOrigin: '50px 50px', fontSize: 20, fontWeight: 700, fill: 'var(--ops-text)' }}>{parts.total}</text>
        </svg>
        <ul className="min-w-0 flex-1 space-y-1.5 text-[11px]">
          {parts.rows.map((p) => (
            <li key={p.status} className="flex items-center gap-2">
              <span className="h-2 w-2 flex-none" style={{ background: STATUS_COLOR[p.status] }} />
              <span className="truncate text-[var(--ops-muted)]">{p.status}</span>
              <span className="ml-auto font-bold tabular-nums">{p.n}</span>
              <span className="w-9 text-right text-[var(--ops-faint)] tabular-nums">{p.pct}%</span>
            </li>
          ))}
          {parts.rows.length === 0 && <li className="text-[var(--ops-muted)]">No flights in this view.</li>}
        </ul>
      </div>
    </Panel>
  )
}
