import { useMemo, useState } from 'react'
import { ArrowRight, Search, ShieldCheck, X } from 'lucide-react'
import { boardKey, nowMinutes, type Flight, type FlightStatus } from '@/data/airport'
import { isFinished, nextStatus } from '@/lib/flight-flow'
import { STATUS_COLOR } from '@/lib/ops-stats'
import { Panel } from './Panel'
import { toneStyle } from './tone'
import { OpsStatus } from './OpsStatus'
import { useAdminLanguage } from '@/state/use-admin-language'

const PRIORITY: Partial<Record<FlightStatus, number>> = { DELAYED: 0, 'FINAL CALL': 1, BOARDING: 2 }
type Scope = 'attention' | 'active'

interface Props {
  flights: Flight[]
  onReview: (f: Flight) => void
  onAdvance: (f: Flight) => void
  onDelay: (f: Flight, minutes: number) => void
  onCancel: (f: Flight) => void
  /** Ids of flights currently in a gate conflict. */
  clashIds: Set<string>
}

export function ActionQueue({ flights, onReview, onAdvance, onDelay, onCancel, clashIds }: Props) {
  const { t } = useAdminLanguage()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [scope, setScope] = useState<Scope>('attention')
  const [delayedOnly, setDelayedOnly] = useState(false)
  const [q, setQ] = useState('')

  const active = useMemo(() => flights.filter((f) => !isFinished(f)), [flights])
  const delayedCount = active.filter((f) => f.status === 'DELAYED').length
  const attention = active.filter((f) => PRIORITY[f.status] !== undefined)
  const actionLabel = (flight: Flight) => {
    const next = nextStatus(flight)
    if (!next) return t.actions.completed
    if (next === 'CHECK-IN') return t.actions.openCheckIn
    if (next === 'BOARDING') return t.actions.startBoarding
    if (next === 'FINAL CALL') return t.actions.finalCall
    if (next === 'DEPARTED') return t.actions.markDeparted
    if (next === 'LANDED') return t.actions.markLanded
    return t.actions.advance
  }

  const rows = useMemo(() => {
    const ref = nowMinutes()
    const term = q.trim().toLowerCase()
    return (scope === 'attention' ? attention : active)
      .filter((f) => !delayedOnly || f.status === 'DELAYED')
      .filter((f) => !term || [f.no, f.airline, f.city, f.gate].some((v) => v.toLowerCase().includes(term)))
      .sort((a, b) => (PRIORITY[a.status] ?? 3) - (PRIORITY[b.status] ?? 3) || boardKey(a.est, ref) - boardKey(b.est, ref))
  }, [active, attention, scope, delayedOnly, q])

  return (
    <Panel eyebrow={t.queue.eyebrow} title={t.queue.title} right={<span className="ops-count">[{attention.length}]</span>}>
      <p className="ops-sub px-4 pb-3">{t.queue.subtitle}</p>

      <div className="px-4 pb-3">
        {delayedCount > 0 ? (
          <div className="ops-callout" style={toneStyle('var(--ops-warn)')}>
            <span className="font-bold">{delayedCount} · {t.queue.delayed}</span>
            <button type="button" onClick={() => setDelayedOnly((v) => !v)}>
              {delayedOnly ? (<>{t.queue.showAll} <X className="h-3.5 w-3.5" /></>) : (<>{t.queue.delayedOnly} <ArrowRight className="h-3.5 w-3.5" /></>)}
            </button>
          </div>
        ) : (
          <div className="ops-callout" style={toneStyle('var(--ops-ok)')}>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {t.queue.noDelayed}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2 px-4 pb-3">
        <label className="relative block">
          <span className="sr-only">{t.common.searchFlights}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ops-faint)]" />
        <input className="ops-input pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.common.searchFlightRouteGate} />
        </label>
        <label>
          <span className="sr-only">{t.queue.title}</span>
          <select className="ops-input" value={scope} onChange={(e) => setScope(e.target.value as Scope)}>
            <option value="attention">{t.queue.attention(attention.length)}</option>
            <option value="active">{t.queue.allActive(active.length)}</option>
          </select>
        </label>
      </div>

      <div className="flex justify-between border-y border-[var(--ops-line)] px-4 py-2 text-[10px] tracking-[0.14em] text-[var(--ops-muted)] uppercase">
        <span>{t.queue.flightRoute}</span>
        <span>{t.queue.gateEstimateStatus}</span>
      </div>

      <ul className="ops-scroll max-h-[420px]">
        {rows.map((f) => {
          const next = nextStatus(f)
          return (
            <li key={f.id} className="ops-row" style={toneStyle(STATUS_COLOR[f.status])}>
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <p className="ops-flightno">{f.no}</p>
                  <p className="ops-sub mt-0.5 truncate">{f.kind === 'departure' ? t.queue.to : t.queue.from} {f.city} · {f.airline}</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="tabular-nums" style={clashIds.has(f.id) ? { color: 'var(--ops-bad)', fontWeight: 700 } : undefined} title={clashIds.has(f.id) ? t.queue.gateConflictTitle : undefined}>{f.gate}{clashIds.has(f.id) ? ' !' : ''}</span>
                  <span className="tabular-nums text-[var(--ops-muted)]">{f.est}</span>
                  <OpsStatus status={f.status} />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="ops-btn ops-btn-sm flex-1" onClick={() => onReview(f)}>{t.common.review}</button>
                {next && (
                  <button type="button" className="ops-btn ops-btn-sm ops-btn-primary flex-1" onClick={() => onAdvance(f)}>{actionLabel(f)}</button>
                )}
              </div>
              <div className="flex gap-2">
                {confirmId === f.id ? (
                  <>
                    <button type="button" className="ops-btn ops-btn-sm flex-1" style={{ color: 'var(--ops-bad)', borderColor: 'var(--ops-bad)' }} onClick={() => { onCancel(f); setConfirmId(null) }}>{t.queue.confirmCancel(f.no)}</button>
                    <button type="button" className="ops-btn ops-btn-sm" onClick={() => setConfirmId(null)}>{t.common.keep}</button>
                  </>
                ) : (
                  <>
                    {[15, 30, 60].map((m) => (
                      <button key={m} type="button" className="ops-btn ops-btn-sm flex-1" aria-label={t.queue.delayFlight(f.no, m)} onClick={() => onDelay(f, m)}>+{m}m</button>
                    ))}
                    <button type="button" className="ops-btn ops-btn-sm flex-1" onClick={() => setConfirmId(f.id)}>{t.common.cancel}</button>
                  </>
                )}
              </div>
            </li>
          )
        })}
        {rows.length === 0 && <li className="px-4 py-10 text-center text-[var(--ops-muted)]">{t.queue.noFlightsMatchView}</li>}
      </ul>
    </Panel>
  )
}
