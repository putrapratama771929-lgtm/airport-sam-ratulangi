import { Bell, LogOut, Moon, Plane, Sun } from 'lucide-react'
import { Link } from 'react-router'
import { fmtClock, fmtDate } from '@/data/airport'
import { useNow } from '@/hooks/useNow'
import type { OpsTheme } from '@/hooks/use-ops-theme'

/** Own component so the once-per-second clock does not re-render the whole dashboard. */
function Clock() {
  const now = useNow(1_000)
  return (
    <div className="text-right leading-tight">
      <p className="text-[16px] font-bold tabular-nums sm:text-[20px]">{fmtClock(now)}</p>
      <p className="mt-1 hidden text-[10px] tracking-[0.12em] text-[var(--ops-muted)] uppercase sm:block">{fmtDate(now)} · WITA</p>
    </div>
  )
}

interface TopBarProps {
  email?: string
  unread: number
  theme: OpsTheme
  onToggleTheme: () => void
  onBell: () => void
  onSignOut: () => void
}

export function TopBar({ email, unread, theme, onToggleTheme, onBell, onSignOut }: TopBarProps) {
  return (
    <div className="ops-topbar">
      <div className="flex min-w-0 items-center gap-5">
        <Link to="/" className="flex items-baseline gap-3" aria-label="Back to public site">
          <span className="ops-logo">
            MDC <span className="ops-sq" /> OPS
          </span>
          <span className="hidden text-[11px] tracking-[0.28em] text-[var(--ops-muted)] uppercase md:inline">Airport operations</span>
        </Link>
        <span className="hidden h-6 w-px bg-[var(--ops-line)] lg:block" />
        <span className="hidden items-center gap-2 text-[11px] text-[var(--ops-muted)] lg:flex">
          <Plane className="h-3.5 w-3.5" /> Sam Ratulangi Intl
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden text-[11px] text-[var(--ops-muted)] xl:inline">
          STATUS: <span className="ops-sq mx-1" /> <span className="text-[var(--ops-text)]">Demo workspace</span>
        </span>
        <span className="ops-pill-live hidden sm:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" /> Feed connected
        </span>
        <Clock />
        <button type="button" className="ops-btn ops-btn-icon" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button type="button" className="ops-btn ops-btn-icon" onClick={onBell} aria-label={unread ? `Event log, ${unread} unread` : 'Event log'}>
          <Bell className="h-4 w-4" />
          {unread > 0 && <span className="ops-badge">{unread > 9 ? '9+' : unread}</span>}
        </button>
        <button type="button" className="ops-btn ops-btn-icon" onClick={onSignOut} aria-label={`Sign out${email ? ` ${email}` : ''}`} title={email}>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
