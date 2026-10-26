import { Bell, LogOut, Moon, Plane, Sun } from 'lucide-react'
import { Link } from 'react-router'
import { fmtClock } from '@/data/airport'
import { useNow } from '@/hooks/useNow'
import type { OpsTheme } from '@/hooks/use-ops-theme'
import { useAdminLanguage } from '@/state/use-admin-language'

/** Isolated one-second clock so the rest of the admin shell stays still. */
function Clock({ locale, timeZone }: { locale: string; timeZone: string }) {
  const now = useNow(1_000)
  return (
    <div className="ops-clock" aria-label={`${timeZone} ${new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Makassar', dateStyle: 'full' }).format(now)}`}>
      <p className="ops-clock-value">{fmtClock(now)}</p>
      <p className="ops-clock-date">{new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Makassar', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(now)} · {timeZone}</p>
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
  const { lang, setLang, t } = useAdminLanguage()
  const locale = lang === 'id' ? 'id-ID' : 'en-GB'
  return (
    <header className="ops-topbar">
      <Link to="/" className="ops-brand" aria-label={t.shell.brandTitle}>
        <span className="ops-brand-mark"><Plane className="h-5 w-5" aria-hidden="true" /></span>
        <span className="min-w-0">
          <span className="ops-brand-title">{t.shell.brandTitle}</span>
          <span className="ops-brand-subtitle">{t.shell.brandSubtitle}</span>
        </span>
      </Link>

      <div className="ops-header-state" title={t.shell.pilotTooltip}>
        <span className="ops-pilot-dot" />
        {t.shell.pilot}
      </div>

      <div className="ops-header-actions">
        <Clock locale={locale} timeZone={t.shell.timeZone} />
        {email && <span className="ops-user" title={email}>{email}</span>}
        <div className="ops-language-toggle flex items-center gap-1" role="group" aria-label={t.language.label}>
          <button type="button" className="ops-chip" aria-label={t.language.english} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          <button type="button" className="ops-chip" aria-label={t.language.indonesian} aria-pressed={lang === 'id'} onClick={() => setLang('id')}>ID</button>
        </div>
        <button type="button" className="ops-btn ops-btn-icon" onClick={onToggleTheme} aria-label={theme === 'dark' ? t.shell.themeToLight : t.shell.themeToDark} title={theme === 'dark' ? t.shell.themeToLight : t.shell.themeToDark}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button type="button" className="ops-btn ops-btn-icon" onClick={onBell} aria-label={t.shell.eventLog(unread)} title={t.shell.openEventLog}>
          <Bell className="h-4 w-4" />
          {unread > 0 && <span className="ops-badge">{unread > 9 ? '9+' : unread}</span>}
        </button>
        <button type="button" className="ops-btn ops-btn-icon" onClick={onSignOut} aria-label={t.shell.signOut(email)} title={t.shell.signOut()}>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
