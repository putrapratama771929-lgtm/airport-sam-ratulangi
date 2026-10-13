import { useEffect, useState } from 'react'
import { Bell, Menu, Plane, X } from 'lucide-react'
import { useFlights } from '@/state/use-flights'
import { useLanguage } from '@/state/use-language'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const NOTIF_COLOR: Record<string, string> = {
  delay: 'text-amber-300',
  gate: 'text-sky-300',
  boarding: 'text-[#fce1b6]',
  info: 'text-slate-300',
}

export function Header() {
  const { notifs, unread, markRead } = useFlights()
  const { lang, setLang, t } = useLanguage()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  const NAV = [
    { label: t.nav.flights, href: '#flights' },
    { label: t.nav.map, href: '#map' },
    { label: t.nav.parking, href: '#parking' },
    { label: t.nav.transport, href: '#transport' },
    { label: t.nav.terminals, href: '#terminals' },
    { label: t.nav.facilities, href: '#facilities' },
    { label: t.nav.guide, href: '#guide' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.faq, href: '#faq' },
  ]

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        solid ? 'border-b border-white/10 bg-[#0a121c]/90 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-[#af915f]/60 text-[#af915f]">
            <Plane className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-[15px] tracking-[0.18em] text-white uppercase">Sam Ratulangi</span>
            <span className="font-mono2 block text-[10px] tracking-[0.3em] text-[#af915f] uppercase">
              MDC · Manado
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-mono2 text-[11px] tracking-[0.22em] text-slate-300 uppercase transition-colors hover:text-[#fce1b6]"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="hidden items-center gap-px border border-white/15 sm:flex">
            {(['en', 'id'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  'font-mono2 px-2.5 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors',
                  lang === l
                    ? 'bg-[#af915f] font-bold text-[#0a121c]'
                    : 'text-slate-400 hover:text-[#fce1b6]',
                )}
                aria-pressed={lang === l}
              >
                {l}
              </button>
            ))}
          </div>

          <Popover onOpenChange={(o) => o && markRead()}>
            <PopoverTrigger asChild>
              <button
                className="relative flex h-9 w-9 items-center justify-center border border-white/15 text-slate-300 transition-colors hover:border-[#af915f]/60 hover:text-[#fce1b6]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="font-mono2 absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center bg-[#af915f] px-1 text-[9px] font-bold text-[#0a121c]">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 border-white/10 bg-[#0e1a26] p-0 text-white">
              <p className="font-mono2 border-b border-white/10 px-4 py-3 text-[11px] tracking-[0.25em] text-[#af915f] uppercase">
                {t.header.notificationsTitle}
              </p>
              <div className="max-h-72 overflow-y-auto">
                {notifs.slice(0, 12).map((n) => (
                  <div key={n.id} className="border-b border-white/5 px-4 py-2.5 last:border-0">
                    <p className={cn('text-[13px] leading-snug', NOTIF_COLOR[n.type])}>{n.msg}</p>
                    <p className="font-mono2 tabular mt-1 text-[10px] text-slate-500">{n.time} WITA</p>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <button
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-slate-300 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-[#0a121c]/95 px-4 py-4 backdrop-blur-md lg:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-mono2 block border-b border-white/5 py-3 text-xs tracking-[0.25em] text-slate-300 uppercase last:border-0"
            >
              {n.label}
            </a>
          ))}
          {/* Language toggle mobile */}
          <div className="mt-3 flex gap-px border border-white/15">
            {(['en', 'id'] as const).map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false) }}
                className={cn(
                  'font-mono2 flex-1 py-2.5 text-[11px] tracking-[0.25em] uppercase transition-colors',
                  lang === l
                    ? 'bg-[#af915f] font-bold text-[#0a121c]'
                    : 'bg-[#0a121c] text-slate-400',
                )}
                aria-pressed={lang === l}
              >
                {l === 'en' ? 'English' : 'Indonesia'}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
