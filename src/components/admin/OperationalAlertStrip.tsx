import { ArrowUpRight, BellRing, CircleAlert, CircleCheck, Clock3 } from 'lucide-react'
import { useAdminLanguage } from '@/state/use-admin-language'

interface OperationalAlertStripProps {
  conflictCount: number
  delayNoticeCount: number
  gateNoticeCount: number
  onViewMonitor: () => void
  onViewLog: () => void
}

export function OperationalAlertStrip({
  conflictCount,
  delayNoticeCount,
  gateNoticeCount,
  onViewMonitor,
  onViewLog,
}: OperationalAlertStripProps) {
  const { t } = useAdminLanguage()
  const needsAttention = conflictCount > 0 || delayNoticeCount > 0
  const hasScheduleUpdates = gateNoticeCount > 0
  const hasAlerts = needsAttention || hasScheduleUpdates

  const tone = needsAttention
    ? 'border-[color-mix(in_srgb,var(--ops-bad)_42%,var(--ops-line))] bg-[color-mix(in_srgb,var(--ops-bad)_7%,var(--ops-panel))]'
    : hasScheduleUpdates
      ? 'border-[color-mix(in_srgb,var(--ops-warn)_42%,var(--ops-line))] bg-[color-mix(in_srgb,var(--ops-warn)_7%,var(--ops-panel))]'
      : 'border-[var(--ops-line)] bg-[var(--ops-panel)]'

  return (
    <section className="mb-5" aria-label={t.operationalAlerts.label}>
      <div className={`flex min-w-0 flex-col gap-3 border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${tone}`} role="status" aria-live="polite" aria-atomic="true">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`mt-0.5 shrink-0 ${needsAttention ? 'text-[var(--ops-bad)]' : hasScheduleUpdates ? 'text-[var(--ops-warn)]' : 'text-[var(--ops-ok)]'}`} aria-hidden="true">
            {needsAttention ? <CircleAlert className="h-5 w-5" /> : hasScheduleUpdates ? <BellRing className="h-5 w-5" /> : <CircleCheck className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <p className="ops-eyebrow">{t.operationalAlerts.label}</p>
              <p className={`text-sm font-bold ${needsAttention ? 'text-[var(--ops-bad)]' : hasScheduleUpdates ? 'text-[var(--ops-warn)]' : 'text-[var(--ops-ok)]'}`}>
                {needsAttention ? t.operationalAlerts.attention : hasScheduleUpdates ? t.operationalAlerts.scheduleUpdates : t.operationalAlerts.noAlerts}
              </p>
            </div>
            <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--ops-muted)]">
              <span className={`inline-flex items-center gap-1.5 ${conflictCount > 0 ? 'font-semibold text-[var(--ops-bad)]' : ''}`}>
                <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {t.operationalAlerts.conflictCount(conflictCount)}
              </span>
              <span className={`inline-flex items-center gap-1.5 ${delayNoticeCount > 0 ? 'font-semibold text-[var(--ops-bad)]' : ''}`}>
                <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {t.operationalAlerts.delayCount(delayNoticeCount)}
              </span>
              <span className={`inline-flex items-center gap-1.5 ${gateNoticeCount > 0 ? 'font-semibold text-[var(--ops-warn)]' : ''}`}>
                <BellRing className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {t.operationalAlerts.gateChangeCount(gateNoticeCount)}
              </span>
              <span className="text-[var(--ops-faint)]">{t.operationalAlerts.syntheticScope}</span>
            </div>
          </div>
        </div>

        {hasAlerts && (
          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            {conflictCount > 0 && (
              <button type="button" className="ops-btn min-h-9 text-xs" onClick={onViewMonitor}>
                {t.operationalAlerts.viewMonitor}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            {(delayNoticeCount > 0 || gateNoticeCount > 0) && (
              <button type="button" className="ops-btn min-h-9 text-xs" onClick={onViewLog}>
                {t.operationalAlerts.viewEventLog}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
