import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Megaphone, Plus } from 'lucide-react'
import { useAuth } from '@/state/use-auth'
import { useAdminFlights } from '@/state/use-admin-flights'
import { useOpsTheme } from '@/hooks/use-ops-theme'
import { useAdminLanguage } from '@/state/use-admin-language'
import { computeVitals, filterWing, type WingFilter } from '@/lib/ops-stats'
import type { Flight } from '@/data/airport'
import '@/components/admin/ops-theme.css'
import { AdminNavigation, type AdminView } from '@/components/admin/AdminNavigation'
import { TopBar } from '@/components/admin/TopBar'
import { VitalsStrip } from '@/components/admin/VitalsStrip'
import { OperationalAlertStrip } from '@/components/admin/OperationalAlertStrip'
import { SummaryMetricsRow } from '@/components/admin/SummaryMetricsRow'
import { ActionQueue } from '@/components/admin/ActionQueue'
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
import { toneStyle } from '@/components/admin/tone'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const { lang, t } = useAdminLanguage()
  const { flights, notifs, unread, serviceDate, setServiceDate, loading, error, refresh, markRead, updateFlight, createFlight, publishNotice, reassignGate, reassignGates, delayFlight, cancelFlight, advanceFlight } = useAdminFlights()
  const { theme, toggle } = useOpsTheme()
  const navigate = useNavigate()
  const viewRef = useRef<HTMLDivElement>(null)

  const [view, setView] = useState<AdminView>('overview')
  const [wing, setWing] = useState<WingFilter>('all')
  const [kind, setKind] = useState<KindFilter>('all')
  const [query, setQuery] = useState('')
  const [dialog, setDialog] = useState<'flight' | 'notice' | null>(null)

  const scoped = useMemo(() => filterWing(flights, wing), [flights, wing])
  const airportVitals = useMemo(() => computeVitals(flights, 'all'), [flights])
  const vitals = useMemo(() => computeVitals(scoped, wing), [scoped, wing])
  const delayNoticeCount = notifs.filter((notice) => notice.type === 'delay').length
  const gateNoticeCount = notifs.filter((notice) => notice.type === 'gate').length
  const conflicts = useMemo(() => detectConflicts(scoped), [scoped])
  const allConflicts = useMemo(() => detectConflicts(flights), [flights])
  const clashIds = useMemo(() => new Set(conflicts.flatMap((c) => c.flights.map((f) => f.id))), [conflicts])
  const highAlerts = notifs.filter((n) => noticeSeverity(n.type) === 'high').length
  const viewTitle = view === 'overview' ? t.page.overviewTitle : view === 'monitor' ? t.page.monitorTitle : t.page.eventTitle
  const viewDescription = view === 'overview' ? t.page.overviewDescription : view === 'monitor' ? t.page.monitorDescription : t.page.eventDescription
  const viewEyebrow = view === 'overview' ? t.page.overviewEyebrow : view === 'monitor' ? t.page.monitorEyebrow : t.page.eventEyebrow

  const changeView = (next: AdminView) => setView(next)

  const signOut = () => { void logout().finally(() => navigate('/login', { replace: true })) }

  const review = (flight: Flight) => {
    setKind(flight.kind)
    setQuery(flight.no)
    changeView('monitor')
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const advance = (flight: Flight) => { void advanceFlight(flight.id) }

  const openLog = () => {
    void markRead()
    changeView('log')
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openMonitor = () => {
    changeView('monitor')
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="ops-root" data-theme={theme} lang={lang}>
      <TopBar email={user?.email} unread={unread} theme={theme} onToggleTheme={toggle} onBell={openLog} onSignOut={signOut} />

      <div className="ops-shell">
        <aside className="ops-sidebar">
          <div>
            <p className="ops-sidebar-label">{t.navigation.label}</p>
            <AdminNavigation view={view} onChange={changeView} conflicts={conflicts.length} unread={unread} />
          </div>
          <div className="ops-sidebar-footer">
            MDC · Sam Ratulangi Intl<br />
            {t.navigation.footerDuty}<br />
            <b>{t.navigation.manualPilot}</b>
          </div>
        </aside>

        <main className="ops-content">
          <div className="ops-content-inner">
            {error && (
              <div className="ops-callout mb-4" role="alert" style={toneStyle('var(--ops-bad)')}>
                <span>{error}</span>
                <button type="button" onClick={() => void refresh()}>{t.page.retry}</button>
              </div>
            )}
            {loading && <p className="ops-sub mb-3" role="status">{t.page.loading}</p>}
            <OperationalAlertStrip conflictCount={allConflicts.length} delayNoticeCount={delayNoticeCount} gateNoticeCount={gateNoticeCount} onViewMonitor={openMonitor} onViewLog={openLog} />
            <SummaryMetricsRow vitals={airportVitals} />
            <header className="ops-page-head">
              <div className="min-w-0">
                <p className="ops-eyebrow">{viewEyebrow}</p>
                <h1 className="ops-page-title">{viewTitle}</h1>
                <p className="ops-page-description">{viewDescription}{user?.email ? ` · ${user.email}` : ''}</p>
              </div>
              <div className="ops-page-actions">
                {view !== 'log' && (
                  <label className="ops-filter">
                    <span className="sr-only">{t.page.dateLabel}</span>
                    <input type="date" className="ops-input" value={serviceDate} onChange={(event) => setServiceDate(event.target.value)} />
                  </label>
                )}
                <label className="ops-filter">
                  <span className="sr-only">{t.page.filterWing}</span>
                  <select className="ops-input" value={wing} onChange={(e) => setWing(e.target.value as WingFilter)}>
                    <option value="all">{t.page.allWings}</option>
                    <option value="D">{t.page.domesticWing}</option>
                    <option value="I">{t.page.internationalWing}</option>
                  </select>
                </label>
                <button type="button" className="ops-btn" onClick={() => setDialog('notice')}><Megaphone className="h-4 w-4" /> {t.page.broadcastNotice}</button>
                <button type="button" className="ops-btn ops-btn-primary" onClick={() => setDialog('flight')}><Plus className="h-4 w-4" /> {t.page.addFlight}</button>
              </div>
            </header>

            {view === 'overview' && (
              <section className="ops-summary" aria-label={t.page.coreVitals}>
                <div className="ops-section-label">
                  <span>{t.page.coreVitals} · {t.page.metricsPending}</span>
                  <span>{t.page.pilotDateSummary(serviceDate)}</span>
                </div>
                <div className="ops-panel"><VitalsStrip vitals={vitals} /></div>
              </section>
            )}

            <div key={view} ref={viewRef} className="ops-view motion-safe:animate-ops-view-enter motion-reduce:animate-none" id={`admin-view-${view}`} aria-labelledby="admin-view-heading">
              <h2 id="admin-view-heading" className="sr-only">{viewTitle}</h2>
              {view === 'overview' && (
                <div className="ops-overview-grid">
                  <div className="ops-primary-column">
                    <ConflictCenter flights={scoped} conflicts={conflicts} onReassign={reassignGate} onReassignMany={reassignGates} onReview={review} />
                    <ActionQueue flights={scoped} onReview={review} onAdvance={advance} onDelay={(f, m) => delayFlight(f.id, m)} onCancel={(f) => cancelFlight(f.id)} clashIds={clashIds} />
                    <TrafficChart flights={scoped} />
                    <AirlineRanking flights={scoped} />
                  </div>
                  <div className="ops-side-column">
                    <GateMatrix flights={scoped} wing={wing} onReview={review} />
                    <StatusMix flights={scoped} />
                    <Panel eyebrow={t.page.alertEyebrow} title={t.page.operationsNotices} right={<span className="ops-count">{t.page.highAlerts(highAlerts)}</span>}>
                      <div className="ops-body">
                        <NoticeList notifs={notifs} limit={7} />
                        <button type="button" className="ops-btn ops-btn-sm mt-3 w-full" onClick={openLog}>{t.page.viewEventLog}</button>
                      </div>
                    </Panel>
                  </div>
                </div>
              )}

              {view === 'monitor' && (
                <FlightMonitor flights={scoped} kind={kind} onKindChange={setKind} query={query} onQueryChange={setQuery} onUpdate={updateFlight} onAdvance={advance} clashIds={clashIds} />
              )}

              {view === 'log' && <EventLog notifs={notifs} />}
            </div>
          </div>
        </main>
      </div>

      {dialog === 'flight' && <AddFlightDialog serviceDate={serviceDate} onClose={() => setDialog(null)} onCreate={createFlight} />}
      {dialog === 'notice' && <NoticeDialog onClose={() => setDialog(null)} onPublish={publishNotice} />}
    </div>
  )
}
