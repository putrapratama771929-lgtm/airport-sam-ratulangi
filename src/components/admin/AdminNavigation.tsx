import { ClipboardList, LayoutDashboard, Plane } from 'lucide-react'
import { useAdminLanguage } from '@/state/use-admin-language'

export type AdminView = 'overview' | 'monitor' | 'log'

interface AdminNavigationProps {
  view: AdminView
  onChange: (view: AdminView) => void
  conflicts: number
  unread: number
}

export function AdminNavigation({ view, onChange, conflicts, unread }: AdminNavigationProps) {
  const { t } = useAdminLanguage()
  const views: Array<{ id: AdminView; label: string; Icon: typeof LayoutDashboard }> = [
    { id: 'overview', label: t.navigation.overview, Icon: LayoutDashboard },
    { id: 'monitor', label: t.navigation.monitor, Icon: Plane },
    { id: 'log', label: t.navigation.eventLog, Icon: ClipboardList },
  ]
  return (
    <nav className="ops-navigation" aria-label={t.navigation.label}>
      {views.map(({ id, label, Icon }) => {
        const count = id === 'overview' ? conflicts : id === 'log' ? unread : 0
        const countLabel = id === 'overview' ? t.navigation.conflictCount(count) : t.navigation.unreadCount(count)
        return (
          <button
            key={id}
            id={`admin-nav-${id}`}
            type="button"
            className="ops-nav-item"
            aria-current={view === id ? 'page' : undefined}
            aria-label={count > 0 ? `${label}, ${countLabel}` : label}
            onClick={() => onChange(id)}
          >
            <Icon className="ops-nav-icon" aria-hidden="true" />
            <span>{label}</span>
            {count > 0 && <span className="ops-nav-badge" aria-hidden="true">{count > 99 ? '99+' : count}</span>}
          </button>
        )
      })}
    </nav>
  )
}
