import { useMemo, useState } from 'react'
import type { Flight } from '@/data/airport'
import { GATES_BY_WING, gateStates, type GateState, type WingFilter } from '@/lib/ops-stats'
import { Panel } from './Panel'
import { OpsStatus } from './OpsStatus'
import { useAdminLanguage } from '@/state/use-admin-language'

const WINGS: Array<{ wing: Flight['wing']; idx: string }> = [
  { wing: 'D', idx: '01' },
  { wing: 'I', idx: '02' },
]

interface Props {
  flights: Flight[]
  wing: WingFilter
  onReview: (f: Flight) => void
}

export function GateMatrix({ flights, wing, onReview }: Props) {
  const { t } = useAdminLanguage()
  const [selected, setSelected] = useState<string | null>(null)
  const [detailGate, setDetailGate] = useState<string | null>(null)
  const states = useMemo(() => gateStates(flights), [flights])
  const visible = WINGS.filter((w) => wing === 'all' || w.wing === wing)
  const legend: Array<{ state: GateState; label: string }> = [
    { state: 'active', label: t.gates.occupied },
    { state: 'watch', label: t.gates.boarding },
    { state: 'alert', label: t.gates.delayed },
    { state: 'free', label: t.gates.free },
  ]
  const codes = visible.flatMap((w) => GATES_BY_WING[w.wing])
  const counts = legend.map((l) => ({ ...l, n: codes.filter((c) => states[c].state === l.state).length }))
  const info = detailGate ? states[detailGate] : null

  const toggleGate = (code: string) => {
    if (selected === code) {
      setSelected(null)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setDetailGate(null)
      return
    }
    setSelected(code)
    setDetailGate(code)
  }

  return (
    <Panel eyebrow={t.gates.eyebrow} title={t.gates.title} right={<span className="ops-count">[{visible.reduce((n, w) => n + GATES_BY_WING[w.wing].length, 0)}]</span>}>
      <div className="ops-body">
        <p className="ops-sub">{t.gates.selectGate}</p>
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
              <span><span className="mr-3 text-[var(--ops-faint)]">{w.idx}</span>{w.wing === 'D' ? t.common.domestic : t.common.international}</span>
              <span className="text-[var(--ops-muted)]">{GATES_BY_WING[w.wing].length} {t.gates.gates}</span>
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
                    onClick={() => toggleGate(code)}
                    aria-label={t.gates.gateAccessible(code, g.flights.length)}
                  >
                    <span className="ops-gd" data-s={g.state} />
                    {code}
                    <small>{g.flights.length ? `${g.flights.length} ${t.gates.flightAbbr}` : ''}</small>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${selected ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          aria-hidden={selected === null}
          inert={selected === null}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === 'grid-template-rows' && selected === null) setDetailGate(null)
          }}
        >
          <div className="min-h-0 overflow-hidden">
            {info && detailGate && (
              <div key={detailGate} className="mt-5 border-t border-[var(--ops-line)] pt-3 motion-safe:animate-ops-panel-enter motion-reduce:animate-none">
                <p className="ops-label">{t.common.gate} {detailGate} · {t.gates.activeFlights(info.flights.length)}</p>
                <ul className="mt-2 space-y-2">
                  {info.flights.map((f) => (
                    <li key={f.id} className="flex items-center justify-between gap-2">
                      <button type="button" className="text-left hover:text-[var(--ops-accent)]" onClick={() => onReview(f)}>
                        <b>{f.no}</b> <span className="text-[var(--ops-muted)]">{f.kind === 'departure' ? '→' : '←'} {f.city}</span>
                      </button>
                      <OpsStatus status={f.status} />
                    </li>
                  ))}
                  {info.flights.length === 0 && <li className="text-[var(--ops-muted)]">{t.gates.noFlightsOnGate}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  )
}
