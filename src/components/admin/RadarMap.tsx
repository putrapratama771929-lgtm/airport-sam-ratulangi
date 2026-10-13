import { useMemo } from 'react'
import { nowMinutes, toMinutes, type Flight } from '@/data/airport'
import { useNow } from '@/hooks/useNow'
import { isFinished } from '@/lib/flight-flow'
import { blipPosition, etaRadius, RADAR_MAX_ETA, RADAR_R_MAX } from '@/lib/route-bearing'
import { STATUS_COLOR } from '@/lib/ops-stats'

const RINGS = [60, 120, 180, 240] // ETA minutes
const PULSING = ['DELAYED', 'BOARDING', 'FINAL CALL']

interface Props {
  flights: Flight[]
  onSelect: (f: Flight) => void
}

/** Airspace radar: angle = bearing of the route from MDC, distance from centre = time until the flight's estimate. */
export function RadarMap({ flights, onSelect }: Props) {
  const now = useNow(10_000)
  const blips = useMemo(() => {
    const ref = nowMinutes(now)
    return flights
      .filter((f) => !isFinished(f))
      .map((f) => {
        const m = toMinutes(f.est)
        // minutes until estimate, on a -6h..+18h window so midnight wraps correctly
        const eta = m === null ? 0 : ((((m - ref + 360) % 1440) + 1440) % 1440) - 360
        return { f, eta, ...blipPosition(f, eta) }
      })
  }, [flights, now])

  const delayed = blips.filter((b) => b.f.status === 'DELAYED').length
  const boarding = blips.filter((b) => b.f.status === 'BOARDING' || b.f.status === 'FINAL CALL').length

  return (
    <section className="ops-panel" aria-label="Airspace radar">
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <p className="text-[15px] font-bold">Airspace radar</p>
          <p className="ops-eyebrow mt-1">Flights by route bearing · realtime</p>
        </div>
        <p className="ops-sub text-right">Click a blip to review</p>
      </div>

      <svg viewBox="-225 -225 450 450" className="mx-auto block w-full max-w-[560px]" role="img" aria-label={`Radar with ${blips.length} active flights`}>
        <defs>
          <radialGradient id="ops-radar-bg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`scale(${RADAR_R_MAX})`}>
            <stop offset="0" stopColor="var(--ops-cyan)" stopOpacity="0.14" />
            <stop offset="1" stopColor="var(--ops-cyan)" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        <circle r={RADAR_R_MAX} fill="url(#ops-radar-bg)" />
        {RINGS.map((t) => (
          <g key={t}>
            <circle r={etaRadius(t)} fill="none" stroke="var(--ops-cyan)" strokeOpacity={0.28} strokeDasharray={t === RADAR_MAX_ETA ? undefined : '2 5'} />
            <text x={4} y={-etaRadius(t) + 11} fontSize="8" fill="var(--ops-muted)">+{t / 60}h</text>
          </g>
        ))}
        <line x1={-RADAR_R_MAX} x2={RADAR_R_MAX} stroke="var(--ops-cyan)" strokeOpacity={0.2} />
        <line y1={-RADAR_R_MAX} y2={RADAR_R_MAX} stroke="var(--ops-cyan)" strokeOpacity={0.2} />
        {([['N', 0, -RADAR_R_MAX - 8], ['E', RADAR_R_MAX + 10, 3], ['S', 0, RADAR_R_MAX + 14], ['W', -RADAR_R_MAX - 10, 3]] as const).map(([l, x, y]) => (
          <text key={l} x={x} y={y} fontSize="9" textAnchor="middle" fill="var(--ops-muted)">{l}</text>
        ))}

        <g className="ops-radar-sweep" aria-hidden="true">
          <path d={`M0,0 L0,${-RADAR_R_MAX} A${RADAR_R_MAX},${RADAR_R_MAX} 0 0 0 ${-RADAR_R_MAX * Math.sin(0.61)},${-RADAR_R_MAX * Math.cos(0.61)} Z`} fill="var(--ops-cyan)" fillOpacity={0.12} />
          <line y2={-RADAR_R_MAX} stroke="var(--ops-cyan)" strokeOpacity={0.8} />
        </g>

        <circle r={7} fill="var(--ops-accent)" />
        <text y={22} fontSize="9" fontWeight="700" textAnchor="middle" fill="var(--ops-text)">MDC</text>

        {blips.map(({ f, x, y }) => {
          const color = STATUS_COLOR[f.status]
          const label = `${f.no} ${f.kind === 'departure' ? 'to' : 'from'} ${f.city}, ${f.status}, estimated ${f.est}, gate ${f.gate}`
          return (
            <g
              key={f.id}
              className="ops-blip"
              data-hot={PULSING.includes(f.status)}
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
              role="button"
              tabIndex={0}
              aria-label={label}
              style={{ cursor: 'pointer', outline: 'none' }}
              onClick={() => onSelect(f)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(f))}
            >
              <title>{label}</title>
              {PULSING.includes(f.status) && <circle r={5} fill={color} className="ops-ping" />}
              {f.kind === 'departure' ? (
                <circle className="ops-blip-shape" r={4.5} fill={color} stroke="var(--ops-bg)" strokeWidth={1} />
              ) : (
                <rect className="ops-blip-shape" x={-4} y={-4} width={8} height={8} transform="rotate(45)" fill={color} stroke="var(--ops-bg)" strokeWidth={1} />
              )}
              <text className="ops-blip-label" x={8} y={3} fontSize="8" fill="var(--ops-text)" style={{ paintOrder: 'stroke', stroke: 'var(--ops-bg)', strokeWidth: 3 }}>{f.no}</text>
            </g>
          )
        })}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ops-line)] px-4 py-3 text-[11px]">
        <p>
          <span className="text-[var(--ops-muted)]">Active</span> <b>{blips.length}</b>
          <span className="mx-2 text-[var(--ops-faint)]">·</span>
          <span className="text-[var(--ops-muted)]">Delayed</span> <b style={{ color: delayed ? 'var(--ops-warn)' : undefined }}>{delayed}</b>
          <span className="mx-2 text-[var(--ops-faint)]">·</span>
          <span className="text-[var(--ops-muted)]">Boarding</span> <b>{boarding}</b>
        </p>
        <p className="flex items-center gap-4 text-[var(--ops-muted)]">
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-current" /> Departure</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rotate-45 bg-current" /> Arrival</span>
        </p>
      </div>
    </section>
  )
}
