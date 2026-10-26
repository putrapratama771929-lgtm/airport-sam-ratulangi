import type { Vitals } from '@/lib/ops-stats'
import { toneStyle } from './tone'
import { useAdminLanguage } from '@/state/use-admin-language'

const SEGMENTS = 24

function SegBar({ value, total }: { value: number; total: number }) {
  const on = total > 0 ? Math.round((value / total) * SEGMENTS) : 0
  return (
    <div className="ops-seg" aria-hidden="true">
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <i key={i} className={i < on ? 'on' : ''} />
      ))}
    </div>
  )
}

interface Cell {
  label: string
  value: string
  n: number
  of: number
  unit: string
  tone?: string
}

export function VitalsStrip({ vitals }: { vitals: Vitals }) {
  const { t } = useAdminLanguage()
  const pct = (n: number, d: number) => (d > 0 ? `${((n / d) * 100).toFixed(1)}%` : '—')
  const delayRate = vitals.tracked > 0 ? vitals.delayed / vitals.tracked : 0
  const cells: Cell[] = [
    { label: t.vitals.labels.completion, value: pct(vitals.finished, vitals.tracked), n: vitals.finished, of: vitals.tracked, unit: t.vitals.units.completedTracked },
    { label: t.vitals.labels.delayRate, value: pct(vitals.delayed, vitals.tracked), n: vitals.delayed, of: vitals.tracked, unit: t.vitals.units.delayedTracked, tone: delayRate > 0.15 ? 'var(--ops-warn)' : undefined },
    { label: t.vitals.labels.boarding, value: String(vitals.boarding).padStart(2, '0'), n: vitals.boarding, of: Math.max(vitals.active, 1), unit: t.vitals.units.boardingActive },
  ]

  return (
    <div className="ops-summary-grid grid grid-cols-1 border-b border-[var(--ops-line)] sm:grid-cols-2 lg:grid-cols-3">
      {cells.map((c) => (
        <div key={c.label} className="ops-vital border-t border-[var(--ops-line)] first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0 lg:border-t-0" style={c.tone ? toneStyle(c.tone) : undefined}>
          <div className="ops-vital-head">
            <span className="ops-vital-label">{c.label}</span>
            <span className="ops-leader" />
            <span className="ops-vital-value">{c.value}</span>
          </div>
          <SegBar value={c.n} total={c.of} />
          <p className="ops-vital-note">
            <b>
              {c.n} / {c.of}
            </b>
            {c.unit}
          </p>
        </div>
      ))}
    </div>
  )
}
