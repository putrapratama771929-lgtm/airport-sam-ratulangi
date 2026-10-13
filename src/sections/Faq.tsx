import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Reveal } from '@/components/Reveal'
import { useLanguage } from '@/state/use-language'

export function Faq() {
  const { t } = useLanguage()

  return (
    <section id="faq" className="bg-[#0a121c] py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="font-mono2 text-[11px] tracking-[0.4em] text-[#af915f] uppercase">{t.faq.eyebrow}</p>
            <h2 className="font-display mt-3 text-4xl tracking-[0.05em] text-white uppercase sm:text-5xl">
              {t.faq.title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed font-light text-slate-400">
              {t.faq.subtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <Accordion type="single" collapsible className="mt-10">
            {t.faq.items.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-white/10">
                <AccordionTrigger className="font-display text-left text-lg tracking-wide text-white hover:text-[#fce1b6] hover:no-underline">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono2 text-[11px] text-[#af915f]">{String(i + 1).padStart(2, '0')}</span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-9 text-sm leading-relaxed font-light text-slate-400">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
