import { useState } from 'react'
import type { Notif } from '@/data/airport'
import { noticeSeverity } from '@/lib/ops-stats'
import { Panel } from './Panel'
import { NoticeList } from './NoticeList'
import { useAdminLanguage } from '@/state/use-admin-language'

type Filter = 'all' | Notif['type']
export function EventLog({ notifs }: { notifs: Notif[] }) {
  const { t } = useAdminLanguage()
  const [filter, setFilter] = useState<Filter>('all')
  const items = filter === 'all' ? notifs : notifs.filter((n) => n.type === filter)
  const high = notifs.filter((n) => noticeSeverity(n.type) === 'high').length
  const filters: Array<{ id: Filter; label: string }> = [
    { id: 'all', label: t.eventLog.all },
    { id: 'delay', label: t.eventLog.delays },
    { id: 'gate', label: t.eventLog.gateChanges },
    { id: 'boarding', label: t.eventLog.boarding },
    { id: 'info', label: t.eventLog.info },
  ]

  return (
    <Panel eyebrow={t.eventLog.eyebrow} title={t.eventLog.title} right={<span className="ops-count">{t.eventLog.highRecent(notifs.length, high)}</span>}>
      <div className="ops-body">
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={t.eventLog.filterLabel}>
          {filters.map((f) => (
            <button key={f.id} type="button" className="ops-chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <NoticeList notifs={items} emptyText={t.eventLog.emptyType} />
      </div>
    </Panel>
  )
}
