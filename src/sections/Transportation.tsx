import { Bus, Car, CarTaxiFront, Smartphone, Zap } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/state/use-language'
import { TRANSPORT, type TransportInfo } from '@/data/airport'

const ICONS: Record<TransportInfo['icon'], typeof Bus> = {
  taxi: CarTaxiFront,
  bus: Bus,
  car: Car,
  shuttle: Zap,
  ride: Smartphone,
}

export function Transportation() {
  const { t } = useLanguage()

  return (
    <section id="transport" className="bg-[#0e1a26] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.transport.eyebrow}</p>
              <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">
                {t.transport.title}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed font-light text-slate-400">
              {t.transport.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          {TRANSPORT.map((item, i) => {
            const Icon = ICONS[item.icon]
            return (
              <Reveal key={item.name} delay={i * 50}>
                <div className="group grid items-center gap-4 border-b border-white/10 py-6 transition-colors first:border-t hover:bg-white/[0.03] sm:grid-cols-[56px_1.4fr_1fr_1fr_1fr] sm:gap-6 sm:px-4">
                  <span className="flex h-12 w-12 items-center justify-center border border-[#af915f]/40 text-[#af915f] transition-colors group-hover:bg-[#af915f] group-hover:text-[#0a121c]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg tracking-wide text-white">{item.name}</h3>
                    <p className="mt-1 text-sm font-light text-slate-400">{item.desc}</p>
                  </div>
                  <div>
                    <p className="font-mono2 text-[10px] tracking-[0.25em] text-slate-500 uppercase">{t.transport.fare}</p>
                    <p className="font-mono2 mt-1 text-sm text-[#fce1b6]">{item.fare}</p>
                  </div>
                  <div>
                    <p className="font-mono2 text-[10px] tracking-[0.25em] text-slate-500 uppercase">{t.transport.schedule}</p>
                    <p className="font-mono2 mt-1 text-sm text-slate-200">{item.sched}</p>
                  </div>
                  <div>
                    <p className="font-mono2 text-[10px] tracking-[0.25em] text-slate-500 uppercase">{t.transport.where}</p>
                    <p className="mt-1 text-sm text-slate-300">{item.where}</p>
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
