import { Accessibility as A11yIcon, CloudSun, PackageSearch, PhoneCall, Wind, Droplets, Eye } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/state/use-language'
import { EMERGENCY, LOST_FOUND, WEATHER } from '@/data/airport'

export function Services() {
  const { t } = useLanguage()

  return (
    <section id="services" className="bg-[#0e1a26] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.services.eyebrow}</p>
              <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">
                {t.services.title}
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-2">
          {/* Weather */}
          <Reveal className="bg-[#0e1a26]">
            <div className="flex h-full flex-col px-7 py-8">
              <div className="flex items-center gap-3">
                <CloudSun className="h-5 w-5 text-[#af915f]" />
                <h3 className="font-display text-2xl tracking-wide text-white">{t.services.weatherTitle}</h3>
              </div>
              <div className="mt-6 flex items-end gap-6">
                <p className="font-display text-7xl leading-none text-[#fce1b6]">
                  {WEATHER.temp}°<span className="text-3xl text-[#af915f]">C</span>
                </p>
                <div>
                  <p className="text-lg text-white">{WEATHER.cond}</p>
                  <p className="text-sm text-slate-400">{t.services.feelsLike} {WEATHER.feels}°C</p>
                </div>
              </div>
              <div className="font-mono2 mt-6 grid grid-cols-3 gap-px border border-white/10 bg-white/10 text-center">
                {[
                  { icon: Wind, label: t.services.wind, val: WEATHER.wind },
                  { icon: Droplets, label: t.services.humidity, val: WEATHER.humidity },
                  { icon: Eye, label: t.services.visibility, val: WEATHER.vis },
                ].map((m) => (
                  <div key={m.label} className="bg-[#0a121c] px-3 py-4">
                    <m.icon className="mx-auto h-4 w-4 text-[#af915f]" />
                    <p className="mt-2 text-[10px] tracking-[0.25em] text-slate-500 uppercase">{m.label}</p>
                    <p className="tabular mt-1 text-sm text-white">{m.val}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono2 mt-4 text-[10px] tracking-[0.25em] text-slate-600 uppercase">{WEATHER.updated}</p>
            </div>
          </Reveal>

          {/* Lost & Found */}
          <Reveal delay={80} className="bg-[#0e1a26]">
            <div className="flex h-full flex-col px-7 py-8">
              <div className="flex items-center gap-3">
                <PackageSearch className="h-5 w-5 text-[#af915f]" />
                <h3 className="font-display text-2xl tracking-wide text-white">{t.services.lostFoundTitle}</h3>
              </div>
              <ol className="mt-6 space-y-3">
                {t.services.lostFoundSteps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed font-light text-slate-300">
                    <span className="font-mono2 shrink-0 text-[#af915f]">{String(i + 1).padStart(2, '0')}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="font-mono2 mt-auto space-y-1.5 border-t border-white/10 pt-5 text-xs text-slate-400">
                <p>{t.services.desk}: <span className="text-slate-200">{LOST_FOUND.desk}</span></p>
                <p>{t.services.hours}: <span className="text-slate-200">{LOST_FOUND.hours}</span> · {t.services.phone}: <span className="text-[#fce1b6]">{LOST_FOUND.phone}</span></p>
                <p>{t.services.email}: <span className="text-[#fce1b6]">{LOST_FOUND.email}</span></p>
              </div>
            </div>
          </Reveal>

          {/* Accessibility */}
          <Reveal delay={120} className="bg-[#0e1a26]">
            <div className="flex h-full flex-col px-7 py-8">
              <div className="flex items-center gap-3">
                <A11yIcon className="h-5 w-5 text-[#af915f]" />
                <h3 className="font-display text-2xl tracking-wide text-white">{t.services.accessibilityTitle}</h3>
              </div>
              <div className="mt-6 space-y-4">
                {t.services.accessibilityItems.map((a) => (
                  <div key={a.title} className="border-l-2 border-[#af915f]/50 pl-4">
                    <p className="text-sm font-semibold text-white">{a.title}</p>
                    <p className="mt-1 text-sm leading-relaxed font-light text-slate-400">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Emergency */}
          <Reveal delay={160} className="bg-[#0e1a26]">
            <div className="flex h-full flex-col px-7 py-8">
              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-red-400" />
                <h3 className="font-display text-2xl tracking-wide text-white">{t.services.emergencyTitle}</h3>
              </div>
              <div className="mt-6 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                {EMERGENCY.map((e) => (
                  <div key={e.name} className="bg-[#0a121c] px-4 py-4">
                    <p className="font-mono2 tabular text-xl font-bold text-red-300">{e.number}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{e.name}</p>
                    <p className="mt-0.5 text-xs font-light text-slate-500">{e.desc}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-5 space-y-2">
                {t.services.emergencyTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-[13px] leading-relaxed font-light text-slate-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-[#af915f]" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
