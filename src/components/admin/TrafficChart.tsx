import { useMemo } from 'react'
import { nowMinutes, type Flight } from '@/data/airport'
import { hourlyTraffic } from '@/lib/ops-stats'
import { Panel } from './Panel'

const W = 480
const H = 190
const PAD = { l: 28, r: 8, t: 14, b: 26 }

export function TrafficChart({ flights }: { flights: Flight[] }) {
  const data = useMemo(() => hourlyTraffic(flights, nowMinutes()), [flights])
  const max = Math.max(4, ...data.map((d) => Math.max(d.dep, d.arr)))
  const ticks = Array.from({ length: Math.min(max, 4) + 1 }, (_, i) => Math.round((max / Math.min(max, 4)) * i))
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b
  const slot = plotW / Math.max(data.length, 1)
  const bar = Math.min(16, slot / 2.6)
  const y = (v: number) => PAD.t + plotH - (v / max) * plotH

  return (
    <Panel
      eyebrow="Traffic / 04"
      title="Movements by hour"
      right={
        <p className="flex items-center gap-3 text-[11px] text-[var(--ops-muted)]">
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2" style={{ background: 'var(--ops-cyan)' }} />Departures</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2" style={{ background: 'var(--ops-accent)' }} />Arrivals</span>
        </p>
      }
    >
      <div className="ops-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Departures and arrivals per estimated hour">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--ops-line)" />
              <text x={PAD.l - 6} y={y(t) + 3} fontSize="9" textAnchor="end" fill="var(--ops-muted)">{t}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = PAD.l + slot * i + slot / 2
            return (
              <g key={d.hour}>
                {d.current && <rect x={cx - slot / 2 + 2} y={PAD.t} width={slot - 4} height={plotH} fill="var(--ops-accent)" opacity={0.08} />}
                <rect x={cx - bar - 1} y={y(d.dep)} width={bar} height={PAD.t + plotH - y(d.dep)} fill="var(--ops-cyan)"><title>{`${String(d.hour).padStart(2, '0')}:00 — ${d.dep} departures`}</title></rect>
                <rect x={cx + 1} y={y(d.arr)} width={bar} height={PAD.t + plotH - y(d.arr)} fill="var(--ops-accent)"><title>{`${String(d.hour).padStart(2, '0')}:00 — ${d.arr} arrivals`}</title></rect>
                <text x={cx} y={H - 9} fontSize="9" textAnchor="middle" fill={d.current ? 'var(--ops-accent)' : 'var(--ops-muted)'} fontWeight={d.current ? 700 : 400}>{String(d.hour).padStart(2, '0')}</text>
              </g>
            )
          })}
        </svg>
        <p className="ops-sub mt-1">Grouped by estimated time (WITA). Highlighted column is the current hour.</p>
      </div>
    </Panel>
  )
}
