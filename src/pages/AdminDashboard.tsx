import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Megaphone, Plus } from 'lucide-react'
import { useAuth } from '@/state/use-auth'
import { useFlights } from '@/state/use-flights'
import { useOpsTheme } from '@/hooks/use-ops-theme'
import { nextStatus } from '@/lib/flight-flow'
import { computeVitals, filterWing, type WingFilter } from '@/lib/ops-stats'
import type { Flight } from '@/data/airport'
import '@/components/admin/ops-theme.css'
import { TopBar } from '@/components/admin/TopBar'
import { VitalsStrip } from '@/components/admin/VitalsStrip'
import { ActionQueue } from '@/components/admin/ActionQueue'
import { RadarMap } from '@/components/admin/RadarMap'
import { TrafficChart } from '@/components/admin/TrafficChart'
import { AirlineRanking } from '@/components/admin/AirlineRanking'
import { GateMatrix } from '@/components/admin/GateMatrix'
import { StatusMix } from '@/components/admin/StatusMix'
import { Panel } from '@/components/admin/Panel'
import { NoticeList } from '@/components/admin/NoticeList'
import { EventLog } from '@/components/admin/EventLog'
import { FlightMonitor, type KindFilter } from '@/components/admin/FlightMonitor'
import { AddFlightDialog, NoticeDialog } from '@/components/admin/FlightDialogs'
import { noticeSeverity } from '@/lib/ops-stats'
import { detectConflicts } from '@/lib/conflicts'
import { ConflictCenter } from '@/components/admin/ConflictCenter'

type Tab = 'overview' | 'monitor' | 'log'
const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'monitor', label: 'Flight monitor' },
  { id: 'log', label: 'Event log' },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const { flights, notifs, unread, markRead, updateFlight, createFlight, publishNotice, reassignGate, delayFlight, cancelFlight } = useFlights()
  const { theme, toggle } = useOpsTheme()
  const navigate = useNavigate()
  const tabsRef = useRef<HTMLDivElement>(null)

  const [tab, setTab] = useState<Tab>('overview')
  const [wing, setWing] = useState<WingFilter>('all')
  const [kind, setKind] = useState<KindFilter>('all')
  const [query, setQuery] = useState('')
  const [dialog, setDialog] = useState<'flight' | 'notice' | null>(null)

  const scoped = useMemo(() => filterWing(flights, wing), [flights, wing])
  const vitals = useMemo(() => computeVitals(scoped, wing), [scoped, wing])
  const conflicts = useMemo(() => detectConflicts(scoped), [scoped])
  const clashIds = useMemo(() => new Set(conflicts.flatMap((c) => c.flights.map((f) => f.id))), [conflicts])
  const highAlerts = notifs.filter((n) => noticeSeverity(n.type) === 'high').length

  const signOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const review = (flight: Flight) => {
    setKind(flight.kind)
    setQuery(flight.no)
    setTab('monitor')
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const advance = (flight: Flight) => {
    const next = nextStatus(flight)
    if (!next) return
    updateFlight(flight.id, { status: next })
    publishNotice(`Operations updated ${flight.no}: ${next.toLowerCase()}.`)
  }

  const openLog = () => {
    markRead()
    setTab('log')
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="ops-root" data-theme={theme}>
      <TopBar email={user?.email} unread={unread} theme={theme} onToggleTheme={toggle} onBell={openLog} onSignOut={signOut} />

      <div className="mx-auto max-w-[1680px] px-4 pb-10 sm:px-6 lg:px-8">
        {/* title */}
        <div className="flex flex-wrap items-end justify-between gap-4 pt-7">
          <div>
            <p className="ops-eyebrow">Operations / Terminal</p>
            <h1 className="mt-3 flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="ops-sq" /> Airport operations
            </h1>
            <p className="ops-sub mt-3">LOC: MDC · Sam Ratulangi Intl · Duty officer{user?.email ? ` · ${user.email}` : ''}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="ops-btn" onClick={() => setDialog('notice')}><Megaphone className="h-4 w-4" /> Broadcast notice</button>
            <button type="button" className="ops-btn ops-btn-primary" onClick={() => setDialog('flight')}><Plus className="h-4 w-4" /> Add flight</button>
          </div>
        </div>
        <div className="ops-dots mt-6" aria-hidden="true" />

        {/* tabs + wing filter */}
        <div ref={tabsRef} className="mt-4 flex scroll-mt-4 flex-wrap items-stretch justify-between gap-3">
          <div role="tablist" aria-label="Dashboard views" className="ops-tabs min-w-0 w-full sm:w-auto">
            {TABS.map((t, i) => (
              <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} type="button" className="ops-tab" onClick={() => setTab(t.id)}>
                <span>[0{i + 1}]</span>{t.label}
                {t.id === 'overview' && conflicts.length > 0 && <b className="ml-2 text-[var(--ops-bad)]">{conflicts.length}</b>}
                {t.id === 'log' && highAlerts > 0 && <b className="ml-2 text-[var(--ops-warn)]">{highAlerts}</b>}
              </button>
            ))}
          </div>
          <label className="block w-full sm:w-auto">
            <span className="sr-only">Wing</span>
            <select className="ops-input h-full min-h-11 w-full sm:w-52" value={wing} onChange={(e) => setWing(e.target.value as WingFilter)}>
              <option value="all">All wings</option>
              <option value="D">Domestic wing</option>
              <option value="I">International wing</option>
            </select>
          </label>
        </div>

        {/* core vitals */}
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <p><span className="ops-eyebrow">Core vitals</span> <span className="mx-2 text-[var(--ops-faint)]">·</span> <b>Shift summary</b></p>
          <p className="ops-sub">Demo data · times in WITA</p>
        </div>
        <div className="ops-panel mt-3"><VitalsStrip vitals={vitals} /></div>

        {/* views */}
        <div className="mt-4" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'overview' && (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="flex min-w-0 flex-col gap-4">
                <ConflictCenter flights={scoped} conflicts={conflicts} onReassign={reassignGate} onReview={review} />
                <ActionQueue flights={scoped} onReview={review} onAdvance={advance} onDelay={(f, m) => delayFlight(f.id, m)} onCancel={(f) => cancelFlight(f.id)} clashIds={clashIds} />
                <AirlineRanking flights={scoped} />
              </div>
              <div className="flex min-w-0 flex-col gap-4 lg:order-last xl:order-none lg:col-span-2 xl:col-span-1">
                <RadarMap flights={scoped} onSelect={review} />
                <TrafficChart flights={scoped} />
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <GateMatrix flights={scoped} wing={wing} onReview={review} />
                <StatusMix flights={scoped} />
                <Panel eyebrow="Alerts / 06" title="Live notices" right={<span className="ops-count">{highAlerts} high</span>}>
                  <div className="ops-body">
                    <NoticeList notifs={notifs} limit={7} />
                    <button type="button" className="ops-btn ops-btn-sm mt-3 w-full" onClick={openLog}>View event log</button>
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {tab === 'monitor' && (
            <FlightMonitor flights={scoped} kind={kind} onKindChange={setKind} query={query} onQueryChange={setQuery} onUpdate={updateFlight} onAdvance={advance} clashIds={clashIds} />
          )}

          {tab === 'log' && <EventLog notifs={notifs} />}
        </div>
      </div>

      {dialog === 'flight' && <AddFlightDialog onClose={() => setDialog(null)} onCreate={createFlight} />}
      {dialog === 'notice' && <NoticeDialog onClose={() => setDialog(null)} onPublish={publishNotice} />}
    </main>
  )
}
