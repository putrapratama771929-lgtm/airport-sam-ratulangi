import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/state/use-language'
import { PARKING } from '@/data/airport'
import { cn } from '@/lib/utils'

export function Parking() {
  const { t } = useLanguage()

  // ── Bar fill animation: start at 0, transition to actual width on viewport entry ──
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="parking" className="bg-[#0a121c] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.parking.eyebrow}</p>
              <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">
                {t.parking.title}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed font-light text-slate-400">
              {t.parking.subtitle}
            </p>
          </div>
        </Reveal>

        <div ref={sectionRef} className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {PARKING.map((p, i) => {
            const pct = Math.round((p.used / p.capacity) * 100)
            const free = p.capacity - p.used
            const tone = pct >= 85 ? 'bg-red-400' : pct >= 60 ? 'bg-amber-400' : 'bg-[#af915f]'
            return (
              <Reveal key={p.name} delay={i * 60} className="bg-[#0a121c]">
                <div className="flex h-full flex-col px-6 py-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg tracking-wide text-white">{p.name}</h3>
                    <span className="font-mono2 text-[10px] tracking-[0.2em] text-slate-500 uppercase">{p.type}</span>
                  </div>

                  <div className="mt-5">
                    <div className="font-mono2 flex justify-between text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                      <span>{t.parking.occupancy}</span>
                      <span className={cn(pct >= 85 ? 'text-red-300' : 'text-slate-300')}>{pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-white/8">
                      <div
                        className={cn('h-full', tone)}
                        style={{
                          width: visible ? `${pct}%` : '0%',
                          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                          transitionDelay: `${i * 120}ms`,
                        }}
                      />
                    </div>
                    <p className="font-mono2 tabular mt-2 text-xs text-slate-400">
                      {t.parking.baysFree(free, p.capacity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-baseline justify-between border-t border-white/10 pt-4">
                    <p className="font-mono2 text-sm text-[#fce1b6]">{p.rate}</p>
                    <p className="text-[11px] text-slate-500">{p.note}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
