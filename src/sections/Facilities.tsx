import { useMemo, useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/state/use-language'
import { FACILITIES } from '@/data/airport'
import { cn } from '@/lib/utils'

const CAT_KEYS = ['All', 'Dining', 'Shopping', 'ATM', 'Lounge', 'Rest', 'Charging'] as const
type CatKey = (typeof CAT_KEYS)[number]

export function Facilities() {
  const { t } = useLanguage()
  const [cat, setCat] = useState<CatKey>('All')
  const list = useMemo(() => (cat === 'All' ? FACILITIES : FACILITIES.filter((f) => f.cat === cat)), [cat])

  // Map cat key → translated label
  const catLabel = (c: CatKey): string => (c === 'All' ? t.facilities.catAll : c)

  return (
    <section id="facilities" className="bg-[#0e1a26] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.facilities.eyebrow}</p>
              <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">
                {t.facilities.title}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed font-light text-slate-400">
              {t.facilities.subtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 flex flex-wrap gap-2">
            {CAT_KEYS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  'font-mono2 border px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors',
                  cat === c
                    ? 'border-[#af915f] bg-[#af915f] font-bold text-[#0a121c]'
                    : 'border-white/15 text-slate-400 hover:border-[#af915f]/50 hover:text-[#fce1b6]',
                )}
              >
                {catLabel(c)}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f, i) => (
            <Reveal key={f.name} delay={(i % 6) * 50} className="bg-[#0e1a26]">
              <div className="flex h-full flex-col px-6 py-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg tracking-wide text-white">{f.name}</h3>
                  <span className="font-mono2 shrink-0 border border-[#af915f]/40 px-2 py-0.5 text-[10px] tracking-[0.15em] text-[#af915f] uppercase">
                    {f.cat}
                  </span>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-slate-400">
                  <p>
                    <span className="font-mono2 mr-2 text-[10px] tracking-[0.2em] text-slate-600 uppercase">{t.facilities.wing}</span>
                    {f.wing === 'D' ? t.facilities.domestic : t.facilities.international}
                  </p>
                  <p>
                    <span className="font-mono2 mr-2 text-[10px] tracking-[0.2em] text-slate-600 uppercase">{t.facilities.where}</span>
                    {f.where}
                  </p>
                  <p>
                    <span className="font-mono2 mr-2 text-[10px] tracking-[0.2em] text-slate-600 uppercase">{t.facilities.hours}</span>
                    <span className="text-[#fce1b6]">{f.hours}</span>
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
