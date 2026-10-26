import { CircleAlert, DoorOpen, Plane, TrendingUp } from 'lucide-react'
import type { Vitals } from '@/lib/ops-stats'
import { useAdminLanguage } from '@/state/use-admin-language'

interface SummaryMetricsRowProps {
  vitals: Vitals
}

export function SummaryMetricsRow({ vitals }: SummaryMetricsRowProps) {
  const { t } = useAdminLanguage()
  const onTimeCount = vitals.tracked - vitals.delayed
  const onTimeEstimate = vitals.tracked > 0 ? `${((onTimeCount / vitals.tracked) * 100).toFixed(1)}%` : '—'
  const gateUtilization = vitals.gatesTotal > 0 ? `${((vitals.gatesUsed / vitals.gatesTotal) * 100).toFixed(1)}%` : '—'

  const metrics = [
    { label: t.summaryMetrics.activeFlights, value: String(vitals.active), detail: t.summaryMetrics.trackedFlights(vitals.tracked), icon: Plane, tone: 'text-[var(--ops-accent)]' },
    { label: t.summaryMetrics.delayedFlights, value: String(vitals.delayed), detail: t.summaryMetrics.delayedOfTracked(vitals.delayed, vitals.tracked), icon: CircleAlert, tone: vitals.delayed > 0 ? 'text-[var(--ops-warn)]' : 'text-[var(--ops-muted)]' },
    { label: t.summaryMetrics.onTimeEstimate, value: onTimeEstimate, detail: t.summaryMetrics.estimateBasis(onTimeCount, vitals.tracked), icon: TrendingUp, tone: 'text-[var(--ops-accent)]' },
    { label: t.summaryMetrics.gateUtilization, value: gateUtilization, detail: t.summaryMetrics.gateOccupancy(vitals.gatesUsed, vitals.gatesTotal), icon: DoorOpen, tone: 'text-[var(--ops-accent)]' },
  ]

  return (
    <section className="mb-4" aria-labelledby="summary-metrics-heading">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="summary-metrics-heading" className="ops-eyebrow">{t.summaryMetrics.heading}</h2>
        <p className="ops-sub">{t.summaryMetrics.scope}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon, tone }) => (
          <article key={label} className="ops-panel min-w-0 p-3 sm:p-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <p className="ops-vital-label min-w-0" style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{label}</p>
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} aria-hidden="true" />
            </div>
            <p className={`mt-2 text-2xl font-extrabold tabular-nums tracking-tight ${tone}`}>{value}</p>
            <p className="ops-vital-note mt-1 min-h-8">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
