import { useMemo, useState } from 'react'
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import type { Flight } from '@/data/airport'
import { flightToMove, planResolutions, suggestGate, type GateConflict } from '@/lib/conflicts'
import { Panel } from './Panel'
import { OpsStatus } from './OpsStatus'
import { toneStyle } from './tone'

interface Props {
  flights: Flight[]
  conflicts: GateConflict[]
  onReassign: (id: string, gate: string) => string | null
  onReview: (f: Flight) => void
}

const label = (f: Flight) => `${f.no} ${f.kind === 'departure' ? '→' : '←'} ${f.city}`

export function ConflictCenter({ flights, conflicts, onReassign, onReview }: Props) {
  const [message, setMessage] = useState<string | null>(null)

  // Suggestions are derived from the live board, so they update the moment anything changes.
  const rows = useMemo(
    () =>
      conflicts.map((c) => {
        const mover = flightToMove(c)
        return { conflict: c, mover, suggestion: suggestGate(mover, flights) }
      }),
    [conflicts, flights],
  )
  const plan = useMemo(() => planResolutions(flights), [flights])

  const move = (id: string, gate: string) => setMessage(onReassign(id, gate))

  const resolveAll = () => {
    const failed = plan.moves.map((m) => onReassign(m.flight.id, m.to)).find((e) => e !== null) ?? null
    setMessage(failed ?? (plan.unresolved.length ? `${plan.unresolved.length} conflict(s) have no free gate — adjust times or delay a flight.` : null))
  }

  const tone = conflicts.length ? 'var(--ops-bad)' : 'var(--ops-ok)'

  return (
    <Panel eyebrow="Conflict center / 00" title="Gate conflicts" right={<span className="ops-count" style={{ color: tone }}>[{conflicts.length}]</span>}>
      <div className="px-4 pb-3">
        {conflicts.length === 0 ? (
          <div className="ops-callout" style={toneStyle('var(--ops-ok)')}>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> No gate conflicts detected</span>
          </div>
        ) : (
          <div className="ops-callout" style={toneStyle('var(--ops-bad)')}>
            <span className="font-bold">{conflicts.length} · Needs action</span>
            {plan.moves.length > 0 && (
              <button type="button" onClick={resolveAll}><Zap className="h-3.5 w-3.5" /> Auto-resolve {plan.moves.length}</button>
            )}
          </div>
        )}
        {message && <p role="alert" className="mt-2 text-[var(--ops-warn)]">{message}</p>}
        <p className="ops-sub mt-2">Two active flights on one gate within 30 minutes, or a gate outside the wing's range.</p>
      </div>

      {rows.length > 0 && (
        <ul className="ops-scroll max-h-[320px] border-t border-[var(--ops-line)]">
          {rows.map(({ conflict: c, mover, suggestion }) => (
            <li key={c.id} className="ops-row" style={toneStyle('var(--ops-bad)')}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="ops-flightno">
                    {c.kind === 'clash' ? `Gate ${c.gate} double-booked` : `Invalid gate “${c.gate}”`}
                  </p>
                  {c.flights.map((f) => (
                    <p key={f.id} className="ops-sub mt-0.5 flex flex-wrap items-center gap-x-2">
                      <button type="button" className="text-left hover:text-[var(--ops-accent)]" onClick={() => onReview(f)}>{label(f)}</button>
                      <span className="tabular-nums">{f.est}</span>
                      <OpsStatus status={f.status} />
                    </p>
                  ))}
                </div>
                {c.kind === 'clash' && <span className="ops-tag tabular-nums">{c.gap} min</span>}
              </div>
              <div className="flex gap-2">
                {suggestion ? (
                  <button type="button" className="ops-btn ops-btn-sm ops-btn-primary flex-1" onClick={() => move(mover.id, suggestion)}>
                    Move {mover.no} <ArrowRight className="h-3 w-3" /> {suggestion}
                  </button>
                ) : (
                  <p className="ops-sub flex-1 self-center">No free {mover.wing === 'D' ? 'domestic' : 'international'} gate — delay a flight or change its time.</p>
                )}
                <button type="button" className="ops-btn ops-btn-sm" onClick={() => onReview(mover)}>Review</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
