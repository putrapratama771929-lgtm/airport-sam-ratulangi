import { useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/state/use-language'
import { cn } from '@/lib/utils'

const ZONE_FILL = 'fill-[#1d3247] hover:fill-[#2a455f] stroke-[#af915f]/50'
const ZONE_FILL_ACTIVE = 'fill-[#af915f]/25 stroke-[#af915f]'

type ZoneId = 'checkin' | 'domestic' | 'international' | 'arrivals' | 'landside'

export function AirportMap() {
  const { t } = useLanguage()
  const [activeId, setActiveId] = useState<ZoneId>('domestic')
  const active = t.map.zones[activeId]

  return (
    <section id="map" className="bg-[#0e1a26] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.map.eyebrow}</p>
              <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">{t.map.title}</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed font-light text-slate-400">
              {t.map.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* SVG plan */}
          <Reveal delay={100}>
            <div className="border border-white/10 bg-[#0a121c] p-4 sm:p-6">
              <svg viewBox="0 0 800 420" className="w-full">
                {/* apron */}
                <rect x="20" y="20" width="760" height="120" fill="#0a121c" stroke="#22364a" strokeDasharray="6 6" />
                <text x="400" y="84" textAnchor="middle" fill="#3a5068" style={{ fontFamily: 'JetBrains Mono', fontSize: 13, letterSpacing: '0.5em' }}>
                  APRON · RWY 18/36
                </text>

                {/* gates domestic */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <g key={`d${i}`}>
                    <rect x={70 + i * 62} y={120} width={44} height={28} fill="#162638" stroke="#af915f" strokeOpacity={0.5} />
                    <text x={92 + i * 62} y={138} textAnchor="middle" fill="#fce1b6" style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                      D{i + 1}
                    </text>
                  </g>
                ))}
                {/* gates international */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <g key={`i${i}`}>
                    <rect x={600 + i * 46} y={160} width={36} height={26} fill="#162638" stroke="#c8ab74" strokeOpacity={0.7} />
                    <text x={618 + i * 46} y={177} textAnchor="middle" fill="#fce1b6" style={{ fontFamily: 'JetBrains Mono', fontSize: 10 }}>
                      I{i + 1}
                    </text>
                  </g>
                ))}

                {/* domestic wing */}
                <rect
                  x={60} y={150} width={510} height={110}
                  className={cn('cursor-pointer stroke-[1.5] transition-all duration-300', ZONE_FILL, activeId === 'domestic' && ZONE_FILL_ACTIVE)}
                  onClick={() => setActiveId('domestic')}
                />
                <text x={315} y={210} textAnchor="middle" fill={activeId === 'domestic' ? '#fce1b6' : '#8ba3bb'} style={{ fontFamily: 'JetBrains Mono', fontSize: 13, letterSpacing: '0.3em' }} className="pointer-events-none transition-all duration-300">
                  DOMESTIC WING
                </text>

                {/* international wing */}
                <rect
                  x={590} y={195} width={170} height={65}
                  className={cn('cursor-pointer stroke-[1.5] transition-all duration-300', ZONE_FILL, activeId === 'international' && ZONE_FILL_ACTIVE)}
                  onClick={() => setActiveId('international')}
                />
                <text x={675} y={232} textAnchor="middle" fill={activeId === 'international' ? '#fce1b6' : '#8ba3bb'} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.2em' }} className="pointer-events-none transition-all duration-300">
                  INTL WING
                </text>

                {/* check-in hall */}
                <rect
                  x={60} y={280} width={400} height={70}
                  className={cn('cursor-pointer stroke-[1.5] transition-all duration-300', ZONE_FILL, activeId === 'checkin' && ZONE_FILL_ACTIVE)}
                  onClick={() => setActiveId('checkin')}
                />
                <text x={260} y={320} textAnchor="middle" fill={activeId === 'checkin' ? '#fce1b6' : '#8ba3bb'} style={{ fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: '0.3em' }} className="pointer-events-none transition-all duration-300">
                  CHECK-IN HALL
                </text>

                {/* arrivals */}
                <rect
                  x={480} y={280} width={280} height={70}
                  className={cn('cursor-pointer stroke-[1.5] transition-all duration-300', ZONE_FILL, activeId === 'arrivals' && ZONE_FILL_ACTIVE)}
                  onClick={() => setActiveId('arrivals')}
                />
                <text x={620} y={320} textAnchor="middle" fill={activeId === 'arrivals' ? '#fce1b6' : '#8ba3bb'} style={{ fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: '0.25em' }} className="pointer-events-none transition-all duration-300">
                  ARRIVALS · BAGGAGE
                </text>

                {/* landside */}
                <rect
                  x={60} y={368} width={700} height={36}
                  className={cn('cursor-pointer stroke-[1.5] transition-all duration-300', ZONE_FILL, activeId === 'landside' && ZONE_FILL_ACTIVE)}
                  onClick={() => setActiveId('landside')}
                />
                <text x={410} y={391} textAnchor="middle" fill={activeId === 'landside' ? '#fce1b6' : '#8ba3bb'} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.3em' }} className="pointer-events-none transition-all duration-300">
                  LANDSIDE SERVICES · INFO · LOST &amp; FOUND · ATM
                </text>
              </svg>

              <div className="font-mono2 mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                <span className="flex items-center gap-2"><span className="h-2 w-2 border border-[#af915f]/60 bg-[#1d3247]" /> {t.map.legendPassenger}</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 bg-[#af915f]/40" /> {t.map.legendSelected}</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 border border-dashed border-[#22364a]" /> {t.map.legendAirside}</span>
              </div>
            </div>
          </Reveal>

          {/* zone detail — animated on zone change via key remount */}
          <Reveal delay={180}>
            <div key={activeId} className="zone-enter flex h-full flex-col border border-white/10 bg-[#0a121c]">
              <div className="border-b border-[#af915f]/30 px-6 py-5">
                <p className="font-mono2 text-[10px] tracking-[0.35em] text-[#af915f] uppercase">{t.map.selectedZone}</p>
                <h3 className="font-display mt-2 text-2xl tracking-wide text-white">{active.label}</h3>
                <p className="mt-2 text-sm font-light text-slate-400">{active.desc}</p>
              </div>
              <ul className="flex-1 px-6 py-4">
                {active.items.map((it, i) => (
                  <li
                    key={i}
                    className="zone-enter flex items-baseline gap-3 border-b border-white/5 py-3 last:border-0"
                    style={{ animationDelay: `${80 + i * 60}ms` }}
                  >
                    <span className="font-mono2 text-[10px] text-[#af915f]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm text-slate-200">{it}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 px-6 py-4">
                <p className="font-mono2 text-[10px] tracking-[0.25em] text-slate-500 uppercase">
                  {t.map.toiletsNote}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
