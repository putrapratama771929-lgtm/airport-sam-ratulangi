import { useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/state/use-language'
import { cn } from '@/lib/utils'

export function TravelGuide() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'depart' | 'arrive'>('depart')
  const steps = mode === 'depart' ? t.guide.departSteps : t.guide.arriveSteps

  return (
    <section id="guide" className="bg-[#0a121c] py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.guide.eyebrow}</p>
            <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">
              {t.guide.title}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mx-auto mt-10 flex w-max gap-px border border-white/15 bg-white/10 p-px">
            {(
              [
                { id: 'depart', label: t.guide.departing },
                { id: 'arrive', label: t.guide.arriving },
              ] as const
            ).map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => setMode(tabItem.id)}
                className={cn(
                  'font-mono2 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors',
                  mode === tabItem.id ? 'bg-[#af915f] font-bold text-[#0a121c]' : 'bg-[#0a121c] text-slate-400 hover:text-white',
                )}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute top-0 bottom-0 left-[15px] w-px bg-gradient-to-b from-[#af915f]/60 via-white/15 to-transparent sm:left-1/2" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className={cn('relative flex gap-6 pb-10 pl-12 sm:w-1/2 sm:pl-0', i % 2 === 0 ? 'sm:pr-12' : 'sm:ml-auto sm:pl-12')}>
                <span
                  className={cn(
                    'font-mono2 absolute top-0 left-0 flex h-8 w-8 items-center justify-center border border-[#af915f] bg-[#0a121c] text-[11px] font-bold text-[#fce1b6] sm:left-auto',
                    i % 2 === 0 ? 'sm:-right-4' : 'sm:-left-4',
                  )}
                >
                  {i + 1}
                </span>
                <div className="w-full border border-white/10 bg-[#0e1a26] px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg tracking-wide text-white">{s.title}</h3>
                    <span className="font-mono2 shrink-0 text-[10px] tracking-[0.2em] text-[#af915f] uppercase">{s.time}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed font-light text-slate-400">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
