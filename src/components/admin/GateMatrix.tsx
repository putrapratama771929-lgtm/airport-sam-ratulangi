import { useMemo, useState } from 'react'
import type { Flight } from '@/data/airport'
import { GATES_BY_WING, gateStates, type GateState, type WingFilter } from '@/lib/ops-stats'
import { Panel } from './Panel'
import { OpsStatus } from './OpsStatus'

const LEGEND: Array<{ state: GateState; label: string }> = [
  { state: 'active', label: 'Occupied' },
  { state: 'watch', label: 'Boarding' },
  { state: 'alert', label: 'Delayed' },
  { state: 'free', label: 'Free' },
]
const WINGS: Array<{ wing: Flight['wing']; idx: string; name: string }> = [
  { wing: 'D', idx: '01', name: 'Domestic' },
  { wing: 'I', idx: '02', name: 'International' },
]

interface Props {
  flights: Flight[]
  wing: WingFilter
  onReview: (f: Flight) => void
}

export function GateMatrix({ flights, wing, onReview }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const states = useMemo(() => gateStates(flights), [flights])
  const visible = WINGS.filter((w) => wing === 'all' || w.wing === wing)
  const counts = useMemo(() => {
    const codes = visible.flatMap((w) => GATES_BY_WING[w.wing])
    return LEGEND.map((l) => ({ ...l, n: codes.filter((c) => states[c].state === l.state).length }))
  }, [states, visible])
  const info = selected ? states[selected] : null

  return (
    <Panel eyebrow="Gate matrix / 02" title="Gate status" right={<span className="ops-count">[{visible.reduce((n, w) => n + GATES_BY_WING[w.wing].length, 0)}]</span>}>
      <div className="ops-body">
        <p className="ops-sub">Select a gate to see its flights.</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          {counts.map((c) => (
            <li key={c.state} className="flex items-center gap-2">
              <span className="ops-gd" data-s={c.state} /> {c.label} <b className="font-bold">{c.n}</b>
            </li>
          ))}
        </ul>

        {visible.map((w) => (
          <div key={w.wing} className="mt-5">
            <div className="flex justify-between border-b border-[var(--ops-line)] pb-2 text-[11px]">
              <span><span className="mr-3 text-[var(--ops-faint)]">{w.idx}</span>{w.name}</span>
              <span className="text-[var(--ops-muted)]">{GATES_BY_WING[w.wing].length} gates</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {GATES_BY_WING[w.wing].map((code) => {
                const g = states[code]
                return (
                  <button
                    key={code}
                    type="button"
                    className="ops-tile"
                    aria-pressed={selected === code}
                    onClick={() => setSelected((s) => (s === code ? null : code))}
                    aria-label={`Gate ${code}, ${g.flights.length} active flight${g.flights.length === 1 ? '' : 's'}`}
                  >
                    <span className="ops-gd" data-s={g.state} />
                    {code}
                    <small>{g.flights.length ? `${g.flights.length} flt` : ''}</small>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {info && selected && (
          <div className="mt-5 border-t border-[var(--ops-line)] pt-3">
            <p className="ops-label">Gate {selected} · {info.flights.length} active</p>
            <ul className="mt-2 space-y-2">
              {info.flights.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2">
                  <button type="button" className="text-left hover:text-[var(--ops-accent)]" onClick={() => onReview(f)}>
                    <b>{f.no}</b> <span className="text-[var(--ops-muted)]">{f.kind === 'departure' ? '→' : '←'} {f.city}</span>
                  </button>
                  <OpsStatus status={f.status} />
                </li>
              ))}
              {info.flights.length === 0 && <li className="text-[var(--ops-muted)]">No active flights on this gate.</li>}
            </ul>
          </div>
        )}
      </div>
    </Panel>
  )
}
