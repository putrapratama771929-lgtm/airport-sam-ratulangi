import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, CloudSun, Search } from 'lucide-react'
import { useFlights } from '@/state/use-flights'
import { useLanguage } from '@/state/use-language'
import { StatusPill } from '@/components/StatusPill'
import { CountUp } from '@/components/CountUp'
import { WEATHER, fmtClock } from '@/data/airport'

function RotatingSeal() {
  return (
    <div className="relative hidden h-36 w-36 shrink-0 sm:block">
      <svg viewBox="0 0 120 120" className="spin-slow h-full w-full">
        <defs>
          <path id="seal-circle" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        </defs>
        <text className="fill-[#af915f]" style={{ fontSize: 9.5, letterSpacing: '0.28em', fontFamily: 'JetBrains Mono, monospace' }}>
          <textPath href="#seal-circle">SAM RATULANGI · MANADO · MDC · 01°32′N 124°55′E ·</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#fce1b6]" fill="currentColor">
          <path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10 8.46 3.98l-1.93.52 3.87 6.7-4.97 1.33-1.85-1.45-1.45.39 2.43 4.21s.88 1.06 2.12.68l5.42-1.44 4.75-1.27 4.16-1.11c.8-.21 1.28-1.04 1.06-1.84z" />
        </svg>
      </div>
    </div>
  )
}

export function Hero() {
  const { searchFlights, flights } = useFlights()
  const { t } = useLanguage()
  const [q, setQ] = useState('')
  const [now, setNow] = useState(() => new Date())
  const results = useMemo(() => searchFlights(q), [q, searchFlights])

  // ── Parallax refs (direct DOM for performance) ──
  const gridRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const dashRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // ── Parallax scroll handler ──
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        if (y > window.innerHeight * 1.3) return
        if (gridRef.current) gridRef.current.style.transform = `translateY(${y * 0.12}px)`
        if (glowRef.current) glowRef.current.style.transform = `translateY(${y * 0.06}px)`
        if (dashRef.current) dashRef.current.style.transform = `translateY(${y * 0.2}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const dep = flights.filter((f) => f.kind === 'departure')
  const stats = [
    { label: t.hero.stats.departuresToday, val: dep.length },
    { label: t.hero.stats.nowBoarding, val: dep.filter((f) => f.status === 'BOARDING').length },
    { label: t.hero.stats.delayed, val: flights.filter((f) => f.status === 'DELAYED').length },
    { label: t.hero.stats.airlinesServing, val: new Set(flights.map((f) => f.airline)).size },
  ]

  return (
    <section id="top" className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-[#162638]">
      {/* runway grid backdrop — parallax layer */}
      <div
        ref={gridRef}
        className="parallax-layer pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(252,225,182,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(252,225,182,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      {/* runway centerline dashes — parallax layer */}
      <div ref={dashRef} className="parallax-layer pointer-events-none absolute inset-x-0 bottom-16 hidden justify-center gap-6 opacity-25 md:flex">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="h-1.5 w-10 bg-[#fce1b6]" />
        ))}
      </div>
      {/* glow — parallax layer */}
      <div ref={glowRef} className="parallax-layer pointer-events-none absolute -top-32 right-[-8%] h-[440px] w-[440px] rounded-full bg-[#af915f]/15 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a121c]/80" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-28 pb-16 sm:px-6">
        <div className="flex items-start justify-between gap-8">
          <div>
            {/* ── Staggered entrance ── */}
            <div className="hero-enter" style={{ animationDelay: '0ms' }}>
              <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">
                {t.hero.eyebrow}
              </p>
            </div>
            <div className="hero-enter" style={{ animationDelay: '150ms' }}>
              <h1 className="font-display mt-5 max-w-3xl text-[13vw] leading-[1.02] tracking-[0.06em] text-white uppercase sm:text-7xl lg:text-[86px]">
                {t.hero.title1}
                <br />
                <span className="text-[#fce1b6]">{t.hero.title2}</span>
              </h1>
            </div>
            <div className="hero-enter" style={{ animationDelay: '350ms' }}>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed font-light text-slate-300">
                {t.hero.subtitle}
              </p>
            </div>
          </div>
          <div className="hero-enter" style={{ animationDelay: '200ms' }}>
            <RotatingSeal />
          </div>
        </div>

        {/* flight search — entrance */}
        <div className="hero-enter" style={{ animationDelay: '500ms' }}>
          <div className="relative mt-10 max-w-2xl">
            <div className="flex items-center gap-2 border border-white/15 bg-black/30 p-2 backdrop-blur transition-colors focus-within:border-[#af915f]/70">
              <Search className="ml-3 h-4 w-4 shrink-0 text-[#af915f]" />
              <input
                aria-label={t.hero.searchPlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <a
                href="#flights"
                className="font-mono2 hidden h-10 shrink-0 items-center gap-1.5 bg-[#af915f] px-4 text-[11px] font-bold tracking-[0.18em] text-[#0a121c] uppercase transition-colors hover:bg-[#c8ab74] sm:flex"
              >
                {t.hero.liveBoard} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            {q.trim() && (
              <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto border border-white/10 bg-[#0e1a26]/95 backdrop-blur-md">
                {results.length === 0 && (
                  <p className="font-mono2 px-4 py-4 text-xs tracking-widest text-slate-500 uppercase">
                    {t.hero.noResults(q)}
                  </p>
                )}
                {results.map((f) => (
                  <a
                    key={f.id}
                    href="#flights"
                    className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-0 hover:bg-white/5"
                  >
                    <div>
                      <p className="font-mono2 tabular text-sm font-bold text-[#fce1b6]">{f.no}</p>
                      <p className="text-xs text-slate-400">
                        {f.airline} · {f.kind === 'departure' ? t.flightBoard.to : t.flightBoard.from} {f.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono2 tabular text-sm text-white">{f.est}</p>
                      <StatusPill status={f.status} className="mt-1 border-0 px-0" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* live strip: clock, weather, stats — entrance + count-up */}
        <div className="hero-enter" style={{ animationDelay: '650ms' }}>
          <div className="mt-12 flex flex-wrap items-stretch gap-px border border-white/10 bg-white/10">
            <div className="flex min-w-40 flex-1 flex-col justify-center bg-[#0a121c]/80 px-5 py-4">
              <p className="font-mono2 text-[10px] tracking-[0.3em] text-slate-500 uppercase">{t.hero.localTime}</p>
              <p className="font-mono2 tabular mt-1 text-2xl font-medium text-white">
                {fmtClock(now)}
              </p>
            </div>
            <div className="flex min-w-44 flex-1 flex-col justify-center bg-[#0a121c]/80 px-5 py-4">
              <p className="font-mono2 flex items-center gap-1.5 text-[10px] tracking-[0.3em] text-slate-500 uppercase">
                <CloudSun className="h-3 w-3 text-[#af915f]" /> {t.hero.weather}
              </p>
              <p className="font-mono2 tabular mt-1 text-2xl font-medium text-[#fce1b6]">
                {WEATHER.temp}°C <span className="text-sm font-normal text-slate-400">{WEATHER.cond}</span>
              </p>
            </div>
            {stats.map((s) => (
              <div key={s.label} className="flex min-w-32 flex-1 flex-col justify-center bg-[#0a121c]/80 px-5 py-4">
                <p className="font-mono2 text-[10px] tracking-[0.3em] text-slate-500 uppercase">{s.label}</p>
                <p className="font-mono2 tabular mt-1 text-2xl font-medium text-white">
                  <CountUp target={s.val} />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-enter" style={{ animationDelay: '800ms' }}>
          <p className="font-mono2 mt-4 text-[10px] tracking-[0.2em] text-slate-500 uppercase">
            {t.hero.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}
