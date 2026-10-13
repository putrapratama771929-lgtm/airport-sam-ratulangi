import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/state/use-language'
import { TERMINALS } from '@/data/airport'

export function TerminalGuide() {
  const { t } = useLanguage()

  return (
    <section id="terminals" className="bg-[#0a121c] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.terminal.eyebrow}</p>
          <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">
            {t.terminal.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-2">
          {TERMINALS.map((term, i) => (
            <Reveal key={term.code} delay={i * 100} className="bg-[#0a121c]">
              <div className="flex h-full flex-col px-7 py-8">
                <div className="flex items-start justify-between">
                  <span className="font-display text-6xl text-[#af915f]/40">{term.code}</span>
                  <div className="text-right">
                    <p className="font-mono2 text-[10px] tracking-[0.25em] text-slate-500 uppercase">{t.terminal.floors(term.floors)}</p>
                    <p className="font-mono2 mt-1 text-[10px] tracking-[0.25em] text-[#fce1b6] uppercase">{term.gates}</p>
                  </div>
                </div>
                <h3 className="font-display mt-4 text-2xl tracking-wide text-white">{term.name}</h3>
                <p className="mt-2 text-sm font-light text-slate-400">{term.focus}</p>

                <div className="mt-6">
                  <p className="font-mono2 text-[10px] tracking-[0.3em] text-[#af915f] uppercase">{t.terminal.airlines}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {term.airlines.map((a) => (
                      <span key={a} className="border border-white/15 px-3 py-1 text-xs text-slate-300">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-mono2 text-[10px] tracking-[0.3em] text-[#af915f] uppercase">{t.terminal.keyFacilities}</p>
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {term.facilities.map((f) => (
                      <li key={f} className="flex items-baseline gap-2 text-sm text-slate-300">
                        <span className="text-[#af915f]">·</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
