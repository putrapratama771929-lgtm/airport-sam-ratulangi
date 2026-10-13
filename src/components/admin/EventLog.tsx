import { useState } from 'react'
import type { Notif } from '@/data/airport'
import { noticeSeverity } from '@/lib/ops-stats'
import { Panel } from './Panel'
import { NoticeList } from './NoticeList'

type Filter = 'all' | Notif['type']
const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'delay', label: 'Delays' },
  { id: 'gate', label: 'Gate changes' },
  { id: 'boarding', label: 'Boarding' },
  { id: 'info', label: 'Info' },
]

export function EventLog({ notifs }: { notifs: Notif[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const items = filter === 'all' ? notifs : notifs.filter((n) => n.type === filter)
  const high = notifs.filter((n) => noticeSeverity(n.type) === 'high').length

  return (
    <Panel eyebrow="Event log / 03" title="Latest notices" right={<span className="ops-count">[{notifs.length}] · {high} high · latest 30 kept</span>}>
      <div className="ops-body">
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter notices">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="ops-chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <NoticeList notifs={items} emptyText="No notices of this type." />
      </div>
    </Panel>
  )
}
