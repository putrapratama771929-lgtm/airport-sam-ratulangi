import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, PlaneLanding, PlaneTakeoff, Search } from 'lucide-react'
import { useFlights } from '@/state/use-flights'
import { useLanguage } from '@/state/use-language'
import { boardKey, nowMinutes, type FlightStatus } from '@/data/airport'
import { StatusPill } from '@/components/StatusPill'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/lib/utils'

type Tab = 'departure' | 'arrival'

export function FlightBoard() {
  const { flights } = useFlights()
  const { t } = useLanguage()
  const [tab, setTab] = useState<Tab>('departure')
  const [q, setQ] = useState('')
  const [sortAsc, setSortAsc] = useState(true)

  // ── Status change flash tracking ──
  const prevStatuses = useRef<Map<string, FlightStatus>>(new Map())
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const newFlashes: string[] = []
    for (const f of flights) {
      const prev = prevStatuses.current.get(f.id)
      if (prev !== undefined && prev !== f.status) {
        newFlashes.push(f.id)
      }
      prevStatuses.current.set(f.id, f.status)
    }
    if (newFlashes.length > 0) {
      const frame = requestAnimationFrame(() => setFlashIds(new Set(newFlashes)))
      const timer = window.setTimeout(() => setFlashIds(new Set()), 800)
      return () => {
        cancelAnimationFrame(frame)
        clearTimeout(timer)
      }
    }
  }, [flights])

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    const ref = nowMinutes()
    return flights
      .filter((f) => f.kind === tab)
      .filter(
        (f) =>
          !s ||
          f.no.toLowerCase().includes(s) ||
          f.airline.toLowerCase().includes(s) ||
          f.city.toLowerCase().includes(s),
      )
      .sort((a, b) => (sortAsc ? 1 : -1) * (boardKey(a.est, ref) - boardKey(b.est, ref)))
  }, [flights, tab, q, sortAsc])

  const TABS = [
    { id: 'departure' as const, label: t.flightBoard.departures, icon: PlaneTakeoff },
    { id: 'arrival' as const, label: t.flightBoard.arrivals, icon: PlaneLanding },
  ]

  return (
    <section id="flights" className="bg-[#0a121c] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.flightBoard.eyebrow}</p>
              <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">
                {t.flightBoard.title}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed font-light text-slate-400">
              {t.flightBoard.subtitle}
            </p>
          </div>
        </Reveal>

        {/* controls */}
        <Reveal delay={80}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
            <div className="flex gap-px bg-white/10 p-px">
              {TABS.map((tabItem) => (
                <button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  className={cn(
                    'font-mono2 flex items-center gap-2 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors',
                    tab === tabItem.id
                      ? 'bg-[#af915f] font-bold text-[#0a121c]'
                      : 'bg-[#0a121c] text-slate-400 hover:text-white',
                  )}
                >
                  <tabItem.icon className="h-3.5 w-3.5" />
                  {tabItem.label}
                </button>
              ))}
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="flex min-w-56 max-w-xs flex-1 items-center gap-2 border border-white/15 px-3">
                <Search className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <input
                  aria-label={t.flightBoard.filterPlaceholder}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.flightBoard.filterPlaceholder}
                  className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
              </div>
              <button
                onClick={() => setSortAsc((v) => !v)}
                className="font-mono2 flex h-9 items-center gap-1.5 border border-white/15 px-3 text-[11px] tracking-[0.15em] text-slate-300 uppercase transition-colors hover:border-[#af915f]/60 hover:text-[#fce1b6]"
              >
                {t.flightBoard.colTime} {sortAsc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </Reveal>

        {/* board */}
        <Reveal delay={140}>
          <div className="mt-2">
            {/* head */}
            <div className="font-mono2 hidden grid-cols-[90px_1fr_1.2fr_70px_110px_150px] gap-4 border-b border-[#af915f]/40 px-4 py-3 text-[10px] tracking-[0.3em] text-[#af915f] uppercase sm:grid">
              <span>{t.flightBoard.colTime}</span>
              <span>{t.flightBoard.colFlight}</span>
              <span>{tab === 'departure' ? t.flightBoard.colDestination : t.flightBoard.colOrigin}</span>
              <span>{t.flightBoard.colGate}</span>
              <span>{t.flightBoard.colEst}</span>
              <span className="text-right">{t.flightBoard.colStatus}</span>
            </div>

            <div className="board-rows">
              {rows.map((f) => (
                <div
                  key={f.id}
                  className={cn(
                    'grid grid-cols-[70px_1fr_auto] items-center gap-3 border-b border-white/8 px-4 py-4 hover:bg-white/[0.04] sm:grid-cols-[90px_1fr_1.2fr_70px_110px_150px] sm:gap-4',
                    flashIds.has(f.id) && 'row-flash',
                  )}
                >
                  <span className="font-mono2 tabular text-lg font-medium text-[#fce1b6] sm:text-xl">{f.sched}</span>
                  <span className="min-w-0">
                    <span className="font-mono2 block text-sm font-bold tracking-wider text-white">{f.no}</span>
                    <span className="block truncate text-xs text-slate-500">{f.airline}</span>
                  </span>
                  <span className="hidden truncate text-sm text-slate-200 sm:block">{f.city}</span>
                  <span className="font-mono2 hidden text-sm text-slate-300 sm:block">{f.gate}</span>
                  <span className="font-mono2 tabular hidden text-sm sm:block">
                    {f.est !== f.sched ? <span className="text-amber-300">{f.est}</span> : <span className="text-slate-500">—</span>}
                  </span>
                  <span className="text-right">
                    <StatusPill status={f.status} />
                    <span className="mt-1 block text-xs text-slate-400 sm:hidden">
                      {f.city} · {f.gate}{f.est !== f.sched ? ` · est. ${f.est}` : ''}
                    </span>
                  </span>
                </div>
              ))}
              {rows.length === 0 && (
                <p className="font-mono2 px-4 py-10 text-center text-xs tracking-[0.3em] text-slate-600 uppercase">
                  {t.flightBoard.noResults(tab)}
                </p>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="font-mono2 mt-6 text-[11px] leading-relaxed tracking-wider text-slate-600">
            {t.flightBoard.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
