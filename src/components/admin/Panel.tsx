import type { ReactNode } from 'react'

interface PanelProps {
  eyebrow: string
  title: string
  right?: ReactNode
  className?: string
  children: ReactNode
}

/** Bordered HUD panel with an eyebrow label, bold title and an optional right-hand slot. */
export function Panel({ eyebrow, title, right, className = '', children }: PanelProps) {
  return (
    <section className={`ops-panel ${className}`}>
      <header className="ops-panel-head">
        <div className="min-w-0">
          <p className="ops-eyebrow">{eyebrow}</p>
          <h2 className="ops-title">{title}</h2>
        </div>
        {right}
      </header>
      {children}
    </section>
  )
}
