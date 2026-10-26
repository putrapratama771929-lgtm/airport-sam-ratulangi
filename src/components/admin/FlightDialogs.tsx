import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Megaphone, X } from 'lucide-react'
import type { Flight } from '@/data/airport'
import type { AdminFlightChanges, NewAdminFlight } from '@/state/admin-flights-context'
import { useAdminLanguage } from '@/state/use-admin-language'

function useAnimatedClose(onClose: () => void) {
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) onClose()
  }, [onClose])
  return { closing, requestClose, finishClose: onClose }
}

function Modal({ title, onClose, onExited, closing, children }: { title: string; onClose: () => void; onExited: () => void; closing: boolean; children: ReactNode }) {
  const { t } = useAdminLanguage()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !closing && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closing, onClose])

  const overlayAnimation = closing ? 'motion-safe:animate-ops-overlay-exit' : 'motion-safe:animate-ops-overlay-enter'
  const panelAnimation = closing ? 'motion-safe:animate-ops-dialog-exit' : 'motion-safe:animate-ops-dialog-enter'

  return (
    <div
      className={`ops-overlay ${overlayAnimation}`}
      onMouseDown={(e) => e.target === e.currentTarget && !closing && onClose()}
      onAnimationEnd={(e) => e.target === e.currentTarget && closing && onExited()}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="ops-dialog-title" className={`ops-panel max-h-full w-full max-w-xl overflow-y-auto ${panelAnimation}`}>
        <div className="ops-panel-head border-b border-[var(--ops-line)]">
          <div>
            <p className="ops-eyebrow">{t.dialogs.eyebrow}</p>
            <h2 id="ops-dialog-title" className="ops-title">{title}</h2>
          </div>
          <button type="button" className="ops-btn ops-btn-icon" onClick={onClose} aria-label={t.dialogs.close}><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="ops-label mb-2">{label}</span>{children}</label>
}

const EMPTY: NewAdminFlight = { no: '', airline: '', city: '', serviceDate: '', wing: 'D', gate: 'D1', sched: '12:00', est: '12:00', status: 'SCHEDULED', kind: 'departure' }

export function AddFlightDialog({ onClose, onCreate, serviceDate }: { onClose: () => void; onCreate: (f: NewAdminFlight) => Promise<string | null>; serviceDate: string }) {
  const { t } = useAdminLanguage()
  const [draft, setDraft] = useState(() => ({ ...EMPTY, serviceDate }))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { closing, requestClose, finishClose } = useAnimatedClose(onClose)
  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const message = await onCreate(draft)
      if (message) return setError(message)
      requestClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={t.dialogs.addTitle} onClose={requestClose} onExited={finishClose} closing={closing}>
      <form onSubmit={submit} className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.dialogs.flightNumber}><input autoFocus required className="ops-input" value={draft.no} onChange={(e) => set('no', e.target.value.toUpperCase())} placeholder="GA 601" /></Field>
          <Field label={t.dialogs.airline}><input required className="ops-input" value={draft.airline} onChange={(e) => set('airline', e.target.value)} placeholder="Garuda Indonesia" /></Field>
          <Field label={draft.kind === 'departure' ? t.dialogs.destination : t.dialogs.origin}><input required className="ops-input" value={draft.city} onChange={(e) => set('city', e.target.value)} placeholder="Jakarta (CGK)" /></Field>
          <Field label={t.dialogs.operatingDate}><input required type="date" className="ops-input" value={draft.serviceDate} onChange={(e) => set('serviceDate', e.target.value)} /></Field>
          <Field label={t.dialogs.flightType}>
            <select className="ops-input" value={draft.kind} onChange={(e) => set('kind', e.target.value as Flight['kind'])}><option value="departure">{t.common.departure}</option><option value="arrival">{t.common.arrival}</option></select>
          </Field>
          <Field label={t.dialogs.wing}>
            <select className="ops-input" value={draft.wing} onChange={(e) => setDraft((d) => ({ ...d, wing: e.target.value as Flight['wing'], gate: `${e.target.value}1` }))}><option value="D">{t.common.domestic}</option><option value="I">{t.common.international}</option></select>
          </Field>
          <Field label={t.dialogs.gate}><input required className="ops-input" pattern="[DdIi][0-9]{1,2}" title={t.dialogs.gateExample} value={draft.gate} onChange={(e) => set('gate', e.target.value.toUpperCase())} /></Field>
          <Field label={t.dialogs.scheduledWita}><input required type="time" className="ops-input" value={draft.sched} onChange={(e) => set('sched', e.target.value)} /></Field>
          <Field label={t.dialogs.estimatedWita}><input required type="time" className="ops-input" value={draft.est} onChange={(e) => set('est', e.target.value)} /></Field>
        </div>
        {error && <p role="alert" className="text-[var(--ops-bad)]">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-[var(--ops-line)] pt-4">
          <button type="button" className="ops-btn" onClick={onClose} disabled={saving}>{t.common.cancel}</button>
          <button type="submit" className="ops-btn ops-btn-primary" disabled={saving}>{saving ? t.dialogs.saving : t.dialogs.createFlight}</button>
        </div>
      </form>
    </Modal>
  )
}

export function EditFlightDialog({ flight, onClose, onUpdate }: {
  flight: Flight
  onClose: () => void
  onUpdate: (id: string, changes: AdminFlightChanges) => Promise<string | null>
}) {
  const { t } = useAdminLanguage()
  const [draft, setDraft] = useState<NewAdminFlight>(() => ({
    no: flight.no, airline: flight.airline, city: flight.city, serviceDate: flight.serviceDate ?? '',
    wing: flight.wing, gate: flight.gate, sched: flight.sched, est: flight.est, status: flight.status, kind: flight.kind,
  }))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { closing, requestClose, finishClose } = useAnimatedClose(onClose)
  const set = <K extends keyof NewAdminFlight>(key: K, value: NewAdminFlight[K]) => setDraft((current) => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const message = await onUpdate(flight.id, draft)
      if (message) return setError(message)
      requestClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={t.dialogs.editTitle(flight.no)} onClose={requestClose} onExited={finishClose} closing={closing}>
      <form onSubmit={submit} className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.dialogs.flightNumber}><input required className="ops-input" value={draft.no} onChange={(event) => set('no', event.target.value.toUpperCase())} /></Field>
          <Field label={t.dialogs.airline}><input required className="ops-input" value={draft.airline} onChange={(event) => set('airline', event.target.value)} /></Field>
          <Field label={draft.kind === 'departure' ? t.dialogs.destination : t.dialogs.origin}><input required className="ops-input" value={draft.city} onChange={(event) => set('city', event.target.value)} /></Field>
          <Field label={t.dialogs.flightType}><select className="ops-input" value={draft.kind} onChange={(event) => set('kind', event.target.value as Flight['kind'])}><option value="departure">{t.common.departure}</option><option value="arrival">{t.common.arrival}</option></select></Field>
          <Field label={t.dialogs.wing}><select className="ops-input" value={draft.wing} onChange={(event) => setDraft((current) => ({ ...current, wing: event.target.value as Flight['wing'], gate: current.wing === event.target.value ? current.gate : `${event.target.value}1` }))}><option value="D">{t.common.domestic}</option><option value="I">{t.common.international}</option></select></Field>
          <Field label={t.dialogs.gate}><input required pattern="[DdIi][0-9]{1,2}" title={t.dialogs.gateExample} className="ops-input" value={draft.gate} onChange={(event) => set('gate', event.target.value.toUpperCase())} /></Field>
          <Field label={t.dialogs.operatingDate}><input required type="date" className="ops-input" value={draft.serviceDate} onChange={(event) => set('serviceDate', event.target.value)} /></Field>
          <Field label={t.dialogs.scheduledWita}><input required type="time" className="ops-input" value={draft.sched} onChange={(event) => set('sched', event.target.value)} /></Field>
          <Field label={t.dialogs.estimatedWita}><input required type="time" className="ops-input" value={draft.est} onChange={(event) => set('est', event.target.value)} /></Field>
          <Field label={t.dialogs.status}><select className="ops-input" value={draft.status} onChange={(event) => set('status', event.target.value as Flight['status'])}>{['SCHEDULED', 'CHECK-IN', 'BOARDING', 'FINAL CALL', 'DELAYED', 'DEPARTED', 'LANDED', 'CANCELLED'].map((status) => <option key={status} value={status}>{t.status[status as Flight['status']]}</option>)}</select></Field>
        </div>
        {error && <p role="alert" className="text-[var(--ops-bad)]">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-[var(--ops-line)] pt-4">
          <button type="button" className="ops-btn" onClick={onClose} disabled={saving}>{t.common.cancel}</button>
          <button type="submit" className="ops-btn ops-btn-primary" disabled={saving}>{saving ? t.dialogs.saving : t.dialogs.saveFlight}</button>
        </div>
      </form>
    </Modal>
  )
}

export function NoticeDialog({ onClose, onPublish }: { onClose: () => void; onPublish: (message: string) => Promise<string | null> }) {
  const { t } = useAdminLanguage()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { closing, requestClose, finishClose } = useAnimatedClose(onClose)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const message = text.trim()
    if (!message) return
    setSaving(true)
    try {
      const result = await onPublish(message)
      if (result) return setError(result)
      requestClose()
    } finally {
      setSaving(false)
    }
  }
  return (
    <Modal title={t.dialogs.noticeTitle} onClose={requestClose} onExited={finishClose} closing={closing}>
      <form onSubmit={submit} className="p-4 sm:p-5">
        <Field label={t.dialogs.noticeLabel}>
          <textarea autoFocus required className="ops-input min-h-32 resize-y py-3 leading-relaxed" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.dialogs.noticePlaceholder} />
        </Field>
        <p className="ops-sub mt-3">{t.dialogs.noticeInfo}</p>
        {error && <p role="alert" className="mt-3 text-[var(--ops-bad)]">{error}</p>}
        <div className="mt-5 flex justify-end gap-3 border-t border-[var(--ops-line)] pt-4">
          <button type="button" className="ops-btn" onClick={onClose} disabled={saving}>{t.common.cancel}</button>
          <button type="submit" className="ops-btn ops-btn-primary" disabled={saving}><Megaphone className="h-3.5 w-3.5" /> {saving ? t.dialogs.saving : t.dialogs.publishNotice}</button>
        </div>
      </form>
    </Modal>
  )
}
