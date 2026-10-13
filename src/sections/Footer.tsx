import { Plane } from 'lucide-react'
import { useLanguage } from '@/state/use-language'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-[#af915f]/30 bg-[#060c13]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border border-[#af915f]/60 text-[#af915f]">
                <Plane className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="font-display block text-[15px] tracking-[0.18em] text-white uppercase">Sam Ratulangi</span>
                <span className="font-mono2 block text-[10px] tracking-[0.3em] text-[#af915f] uppercase">International Airport</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed font-light text-slate-500">
              {t.footer.address}
            </p>
          </div>

          <div>
            <p className="font-mono2 text-[10px] tracking-[0.35em] text-[#af915f] uppercase">{t.footer.explore}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {t.footer.links.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-sm font-light text-slate-400 transition-colors hover:text-[#fce1b6]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono2 text-[10px] tracking-[0.35em] text-[#af915f] uppercase">{t.footer.contact}</p>
            <ul className="font-mono2 mt-4 space-y-2.5 text-sm text-slate-400">
              <li>{t.footer.infoLabel}: <span className="text-slate-200">(0431) 814-100</span></li>
              <li>{t.footer.emergencyLabel}: <span className="text-red-300">112</span></li>
              <li>{t.footer.lostFoundLabel}: <span className="text-slate-200">(0431) 814-130</span></li>
              <li className="pt-1 text-slate-500">{t.footer.openHours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <p className="font-mono2 text-[10px] tracking-[0.25em] text-slate-600 uppercase">
            {t.footer.copyright}
          </p>
          <p className="font-mono2 text-[10px] tracking-[0.25em] text-slate-600 uppercase">
            01°32′N · 124°55′E
          </p>
        </div>
      </div>
    </footer>
  )
}
