import { useMemo } from 'react'
import type { Flight } from '@/data/airport'
import { airlineRanking } from '@/lib/ops-stats'
import { Panel } from './Panel'

export function AirlineRanking({ flights }: { flights: Flight[] }) {
  const rows = useMemo(() => airlineRanking(flights), [flights])
  const max = Math.max(1, ...rows.map((r) => r.count))

  return (
    <Panel eyebrow="Airlines / 03" title="Traffic by airline" right={<span className="ops-sub">Flights · delay share</span>}>
      <ol className="ops-body space-y-3">
        {rows.map((r, i) => {
          const share = r.count ? Math.round((r.delayed / r.count) * 100) : 0
          return (
            <li key={r.airline} className="grid grid-cols-[22px_minmax(0,1.1fr)_minmax(0,1fr)_28px_40px] items-center gap-3">
              <span
                className="flex h-5 w-5 items-center justify-center text-[10px] font-bold"
                style={i < 3 ? { background: 'var(--ops-accent)', color: 'var(--ops-accent-ink)' } : { background: 'var(--ops-seg-off)', color: 'var(--ops-muted)' }}
              >
                {i + 1}
              </span>
              <span className="truncate">{r.airline}</span>
              <span className="h-1.5 bg-[var(--ops-seg-off)]" role="presentation">
                <span className="block h-full" style={{ width: `${(r.count / max) * 100}%`, background: 'var(--ops-cyan)' }} />
              </span>
              <span className="text-right font-bold tabular-nums">{r.count}</span>
              <span className="text-right text-[11px] tabular-nums" style={{ color: share > 0 ? 'var(--ops-warn)' : 'var(--ops-ok)' }}>{share}%</span>
            </li>
          )
        })}
        {rows.length === 0 && <li className="py-6 text-center text-[var(--ops-muted)]">No flights in this view.</li>}
      </ol>
    </Panel>
  )
}
