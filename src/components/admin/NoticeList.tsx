import type { FlightStatus, Notif } from '@/data/airport'
import type { AdminTranslations } from '@/i18n/types'
import { noticeSeverity, SEVERITY_COLOR } from '@/lib/ops-stats'
import { toneStyle } from './tone'
import { useAdminLanguage } from '@/state/use-admin-language'

function localizedMessage(notif: Notif, t: AdminTranslations) {
  const params = notif.messageParams
  if (!params) return notif.msg
  const flight = params.flight
  switch (notif.messageCode) {
    case 'flight.added':
      return typeof flight === 'string' && typeof params.direction === 'string' && typeof params.city === 'string'
        ? t.notices.system.flightAdded(flight, params.direction === 'to' ? t.queue.to : t.queue.from, params.city)
        : notif.msg
    case 'flight.delayed':
      return typeof flight === 'string' && typeof params.direction === 'string' && typeof params.city === 'string' && typeof params.minutes === 'number'
        ? t.notices.system.delayed(flight, params.direction === 'to' ? t.queue.to : t.queue.from, params.city, params.minutes)
        : notif.msg
    case 'flight.cancelled':
      return typeof flight === 'string' && typeof params.direction === 'string' && typeof params.city === 'string'
        ? t.notices.system.cancelled(flight, params.direction === 'to' ? t.queue.to : t.queue.from, params.city)
        : notif.msg
    case 'flight.gate_changed':
      return typeof flight === 'string' && typeof params.gate === 'string'
        ? t.notices.system.gateChanged(flight, params.gate)
        : notif.msg
    case 'flight.status_updated': {
      const status = params.status
      if (typeof flight !== 'string' || typeof status !== 'string' || !(status in t.status)) return notif.msg
      return t.notices.system.statusUpdated(flight, t.status[status as FlightStatus])
    }
    default:
      return notif.msg
  }
}

export function NoticeList({ notifs, limit, emptyText }: { notifs: Notif[]; limit?: number; emptyText?: string }) {
  const { t } = useAdminLanguage()
  const items = limit ? notifs.slice(0, limit) : notifs
  if (!items.length) return <p className="px-4 py-8 text-center text-[var(--ops-muted)]">{emptyText ?? t.notices.empty}</p>
  return (
    <ul className="space-y-1.5">
      {items.map((n) => {
        const sev = noticeSeverity(n.type)
        return (
          <li key={n.id} className="ops-notice" style={toneStyle(SEVERITY_COLOR[sev])}>
            <time>{n.time}</time>
            <span className="min-w-0 break-words leading-snug">{localizedMessage(n, t)}</span>
            <span className="ops-tag" aria-label={t.notices.severityLabel}>{t.severity[sev]}</span>
          </li>
        )
      })}
    </ul>
  )
}
