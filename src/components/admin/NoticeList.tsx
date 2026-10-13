import type { Notif } from '@/data/airport'
import { noticeSeverity, SEVERITY_COLOR, SEVERITY_LABEL } from '@/lib/ops-stats'
import { toneStyle } from './tone'

export function NoticeList({ notifs, limit, emptyText = 'No notices yet.' }: { notifs: Notif[]; limit?: number; emptyText?: string }) {
  const items = limit ? notifs.slice(0, limit) : notifs
  if (!items.length) return <p className="px-4 py-8 text-center text-[var(--ops-muted)]">{emptyText}</p>
  return (
    <ul className="space-y-1.5">
      {items.map((n) => {
        const sev = noticeSeverity(n.type)
        return (
          <li key={n.id} className="ops-notice" style={toneStyle(SEVERITY_COLOR[sev])}>
            <time>{n.time}</time>
            <span className="min-w-0 break-words leading-snug">{n.msg}</span>
            <span className="ops-tag">{SEVERITY_LABEL[sev]}</span>
          </li>
        )
      })}
    </ul>
  )
}
