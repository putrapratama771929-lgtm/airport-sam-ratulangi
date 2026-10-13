import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Megaphone, X } from 'lucide-react'
import type { Flight } from '@/data/airport'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="ops-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="ops-dialog-title" className="ops-panel max-h-full w-full max-w-xl overflow-y-auto">
        <div className="ops-panel-head border-b border-[var(--ops-line)]">
          <div>
            <p className="ops-eyebrow">Operations action</p>
            <h2 id="ops-dialog-title" className="ops-title">{title}</h2>
          </div>
          <button type="button" className="ops-btn ops-btn-icon" onClick={onClose} aria-label="Close dialog"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="ops-label mb-2">{label}</span>{children}</label>
}

const EMPTY: Omit<Flight, 'id'> = { no: '', airline: '', city: '', wing: 'D', gate: 'D1', sched: '12:00', est: '12:00', status: 'SCHEDULED', kind: 'departure' }

export function AddFlightDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (f: Omit<Flight, 'id'>) => string | null }) {
  const [draft, setDraft] = useState(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const message = onCreate(draft)
    if (message) return setError(message)
    onClose()
  }

  return (
    <Modal title="Add a flight" onClose={onClose}>
      <form onSubmit={submit} className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Flight number"><input autoFocus required className="ops-input" value={draft.no} onChange={(e) => set('no', e.target.value.toUpperCase())} placeholder="GA 601" /></Field>
          <Field label="Airline"><input required className="ops-input" value={draft.airline} onChange={(e) => set('airline', e.target.value)} placeholder="Garuda Indonesia" /></Field>
          <Field label={draft.kind === 'departure' ? 'Destination' : 'Origin'}><input required className="ops-input" value={draft.city} onChange={(e) => set('city', e.target.value)} placeholder="Jakarta (CGK)" /></Field>
          <Field label="Flight type">
            <select className="ops-input" value={draft.kind} onChange={(e) => set('kind', e.target.value as Flight['kind'])}><option value="departure">Departure</option><option value="arrival">Arrival</option></select>
          </Field>
          <Field label="Wing">
            <select className="ops-input" value={draft.wing} onChange={(e) => setDraft((d) => ({ ...d, wing: e.target.value as Flight['wing'], gate: `${e.target.value}1` }))}><option value="D">Domestic</option><option value="I">International</option></select>
          </Field>
          <Field label="Gate"><input required className="ops-input" pattern="[DdIi][0-9]{1,2}" title="e.g. D1 or I3" value={draft.gate} onChange={(e) => set('gate', e.target.value.toUpperCase())} /></Field>
          <Field label="Scheduled (WITA)"><input required type="time" className="ops-input" value={draft.sched} onChange={(e) => set('sched', e.target.value)} /></Field>
          <Field label="Estimated (WITA)"><input required type="time" className="ops-input" value={draft.est} onChange={(e) => set('est', e.target.value)} /></Field>
        </div>
        {error && <p role="alert" className="text-[var(--ops-bad)]">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-[var(--ops-line)] pt-4">
          <button type="button" className="ops-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="ops-btn ops-btn-primary">Create flight</button>
        </div>
      </form>
    </Modal>
  )
}

export function NoticeDialog({ onClose, onPublish }: { onClose: () => void; onPublish: (message: string) => void }) {
  const [text, setText] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const message = text.trim()
    if (!message) return
    onPublish(message)
    onClose()
  }
  return (
    <Modal title="Broadcast notice" onClose={onClose}>
      <form onSubmit={submit} className="p-4 sm:p-5">
        <Field label="Passenger-facing message">
          <textarea autoFocus required className="ops-input min-h-32 resize-y py-3 leading-relaxed" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter an operational notice for passengers…" />
        </Field>
        <p className="ops-sub mt-3">Appears in this dashboard and the public ticker for this browser session only (demo).</p>
        <div className="mt-5 flex justify-end gap-3 border-t border-[var(--ops-line)] pt-4">
          <button type="button" className="ops-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="ops-btn ops-btn-primary"><Megaphone className="h-3.5 w-3.5" /> Publish notice</button>
        </div>
      </form>
    </Modal>
  )
}
