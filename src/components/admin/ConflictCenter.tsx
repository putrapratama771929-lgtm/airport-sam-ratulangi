import { useMemo, useState } from 'react'
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import type { Flight } from '@/data/airport'
import { flightToMove, planResolutions, suggestGate, type GateConflict } from '@/lib/conflicts'
import { Panel } from './Panel'
import { OpsStatus } from './OpsStatus'
import { toneStyle } from './tone'
import type { GateMoveRequest } from '@/state/admin-flights-context'
import { useAdminLanguage } from '@/state/use-admin-language'

interface Props {
  flights: Flight[]
  conflicts: GateConflict[]
  onReassign: (id: string, gate: string) => Promise<string | null>
  onReassignMany: (moves: GateMoveRequest[]) => Promise<string | null>
  onReview: (f: Flight) => void
}

export function ConflictCenter({ flights, conflicts, onReassign, onReassignMany, onReview }: Props) {
  const { t } = useAdminLanguage()
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

  const move = async (id: string, gate: string) => setMessage(await onReassign(id, gate))

  const resolveAll = async () => {
    const finalMoves = new Map(plan.moves.map((move) => [move.flight.id, move]))
    const failed = await onReassignMany([...finalMoves.values()].map((move) => ({
      id: move.flight.id,
      version: move.flight.version ?? 1,
      gate: move.to,
    })))
    setMessage(failed ?? (plan.unresolved.length ? t.conflicts.noFreeGatePlan(plan.unresolved.length) : null))
  }

  const tone = conflicts.length ? 'var(--ops-bad)' : 'var(--ops-ok)'

  return (
    <Panel eyebrow={t.conflicts.eyebrow} title={t.conflicts.title} right={<span className="ops-count" style={{ color: tone }}>[{conflicts.length}]</span>}>
      <div className="px-4 pb-3">
        {conflicts.length === 0 ? (
          <div className="ops-callout" style={toneStyle('var(--ops-ok)')}>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {t.conflicts.noConflicts}</span>
          </div>
        ) : (
          <div className="ops-callout" style={toneStyle('var(--ops-bad)')}>
            <span className="font-bold">{conflicts.length} · {t.conflicts.needsAction}</span>
            {plan.moves.length > 0 && (
              <button type="button" onClick={resolveAll}><Zap className="h-3.5 w-3.5" /> {t.conflicts.autoResolve(plan.moves.length)}</button>
            )}
          </div>
        )}
        {message && <p role="alert" className="mt-2 text-[var(--ops-warn)]">{message}</p>}
        <p className="ops-sub mt-2">{t.conflicts.draftRule}</p>
      </div>

      {rows.length > 0 && (
        <ul className="ops-scroll max-h-[320px] border-t border-[var(--ops-line)]">
          {rows.map(({ conflict: c, mover, suggestion }) => (
            <li key={c.id} className="ops-row" style={toneStyle('var(--ops-bad)')}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="ops-flightno">
                    {c.kind === 'clash' ? t.conflicts.doubleBooked(c.gate) : t.conflicts.invalidGate(c.gate)}
                  </p>
                  {c.flights.map((f) => (
                    <p key={f.id} className="ops-sub mt-0.5 flex flex-wrap items-center gap-x-2">
                      <button type="button" className="text-left hover:text-[var(--ops-accent)]" onClick={() => onReview(f)}>{f.no} {f.kind === 'departure' ? '→' : '←'} {f.city}</button>
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
                    {t.conflicts.moveFlight(mover.no, suggestion)} <ArrowRight className="h-3 w-3" />
                  </button>
                ) : (
                  <p className="ops-sub flex-1 self-center">{t.conflicts.noFreeGate(mover.wing === 'D' ? t.common.domestic.toLowerCase() : t.common.international.toLowerCase())}</p>
                )}
                <button type="button" className="ops-btn ops-btn-sm" onClick={() => onReview(mover)}>{t.conflicts.reviewFlight}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
