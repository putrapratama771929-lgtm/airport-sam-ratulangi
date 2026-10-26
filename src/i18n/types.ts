// ---------------------------------------------------------------------------
// Translation shape — every key here must be present in both en.ts and id.ts
// ---------------------------------------------------------------------------

import type { FlightStatus } from '@/data/airport'

export interface ZoneTranslation {
  label: string
  desc: string
  items: string[]
}

export interface FaqItem {
  q: string
  a: string
}

export interface GuideStep {
  title: string
  desc: string
  time: string
}

export interface AccessibilityItem {
  title: string
  desc: string
}

export interface AdminTranslations {
  language: { label: string; english: string; indonesian: string; switchToEnglish: string; switchToIndonesian: string }
  shell: {
    brandTitle: string; brandSubtitle: string; pilot: string; pilotTooltip: string
    clockLabel: string; timeZone: string; themeToLight: string; themeToDark: string
    eventLog: (unread: number) => string; openEventLog: string; signOut: (email?: string) => string
    sessionChecking: string
  }
  navigation: {
    label: string; overview: string; monitor: string; eventLog: string
    conflictCount: (count: number) => string; unreadCount: (count: number) => string
    footerDuty: string; manualPilot: string
  }
  operationalAlerts: {
    label: string; attention: string; scheduleUpdates: string; noAlerts: string; syntheticScope: string
    conflictCount: (count: number) => string; delayCount: (count: number) => string; gateChangeCount: (count: number) => string
    viewMonitor: string; viewEventLog: string
  }
  summaryMetrics: {
    heading: string; scope: string; activeFlights: string; delayedFlights: string; onTimeEstimate: string; gateUtilization: string
    trackedFlights: (trackedCount: number) => string; delayedOfTracked: (delayedCount: number, trackedCount: number) => string
    estimateBasis: (onTimeCount: number, trackedCount: number) => string; gateOccupancy: (used: number, total: number) => string
  }
  page: {
    overviewEyebrow: string; overviewTitle: string; overviewDescription: string
    monitorEyebrow: string; monitorTitle: string; monitorDescription: string
    eventEyebrow: string; eventTitle: string; eventDescription: string
    dutyOfficer: string; loading: string; retry: string; filterWing: string; allWings: string
    domesticWing: string; internationalWing: string; dateLabel: string
    broadcastNotice: string; addFlight: string; coreVitals: string
    metricsPending: string; pilotDateSummary: (date: string) => string
    highAlerts: (count: number) => string; operationsNotices: string; alertEyebrow: string
    viewEventLog: string
  }
  common: {
    all: string; cancel: string; keep: string; confirm: string; review: string; edit: string; save: string
    searchFlights: string; searchFlightRouteGate: string; noFlightsMatch: string
    departure: string; arrival: string; domestic: string; international: string
    gate: string; gateConflict: string; route: string; status: string; estimate: string
    notAvailable: string; flights: string; completed: string
  }
  status: Record<FlightStatus, string>
  severity: { high: string; med: string; info: string }
  actions: {
    openCheckIn: string; startBoarding: string; finalCall: string; markDeparted: string; markLanded: string
    advance: string; completed: string; delay: (flight: string, minutes: number) => string
  }
  vitals: {
    labels: { completion: string; delayRate: string; boarding: string; gateUtilisation: string; activeFlights: string }
    units: { completedTracked: string; delayedTracked: string; boardingActive: string; gatesUsedTotal: string; activeTracked: string }
  }
  queue: {
    eyebrow: string; title: string; subtitle: string; delayed: string; noDelayed: string; delayedOnly: string
    showAll: string; attention: (count: number) => string; allActive: (count: number) => string
    flightRoute: string; gateEstimateStatus: string; to: string; from: string; gateConflictTitle: string
    noFlightsMatchView: string; confirmCancel: (flight: string) => string; delayFlight: (flight: string, minutes: number) => string
  }
  conflicts: {
    eyebrow: string; title: string; noConflicts: string; needsAction: string; autoResolve: (count: number) => string
    noFreeGate: (wing: string) => string; noFreeGatePlan: (count: number) => string
    draftRule: string; doubleBooked: (gate: string) => string; invalidGate: (gate: string) => string
    moveFlight: (flight: string, gate: string) => string; reviewFlight: string
  }
  gates: {
    eyebrow: string; title: string; selectGate: string; occupied: string; boarding: string; delayed: string; free: string
    gates: string; activeFlights: (count: number) => string; flightAbbr: string; noFlightsOnGate: string
    gateAccessible: (gate: string, count: number) => string
  }
  traffic: {
    eyebrow: string; title: string; departures: string; arrivals: string; chartLabel: string
    chartDescription: (hour: string, count: number, direction: string) => string
    groupedByEstimate: string
  }
  statusMix: { eyebrow: string; title: string; chartLabel: (count: number) => string; empty: string }
  airlines: { eyebrow: string; title: string; rightLabel: string; empty: string }
  notices: {
    empty: string; severityLabel: string
    system: {
      flightAdded: (flight: string, direction: string, city: string) => string
      delayed: (flight: string, direction: string, city: string, minutes: number) => string
      cancelled: (flight: string, direction: string, city: string) => string
      gateChanged: (flight: string, gate: string) => string
      statusUpdated: (flight: string, status: string) => string
    }
  }
  eventLog: {
    eyebrow: string; title: string; highRecent: (total: number, high: number) => string
    filterLabel: string; all: string; delays: string; gateChanges: string; boarding: string; info: string
    emptyType: string
  }
  monitor: {
    eyebrow: string; title: string; flightType: string; allFlights: string; departures: string; arrivals: string
    sortBy: string; sortEstimate: string; sortFlight: string; sortAirline: string; sortRoute: string
    sortGate: string; sortStatus: string; sortAscending: string; sortDescending: string
    searchPlaceholder: string; tableFlight: string; tableRoute: string; tableGate: string
    tableEstimate: string; tableStatus: string; nextStep: string; gateFor: (flight: string) => string
    estimateFor: (flight: string) => string; statusFor: (flight: string) => string
    invalidGate: string; gateConflict: string; schedule: (time: string) => string
    showing: (start: number, end: number, total: number) => string; noMatches: string
    previous: string; next: string
  }
  dialogs: {
    eyebrow: string; close: string; addTitle: string; editTitle: (flight: string) => string; noticeTitle: string
    flightNumber: string; airline: string; destination: string; origin: string; flightType: string
    wing: string; gate: string; operatingDate: string; scheduledWita: string; estimatedWita: string
    status: string; noticeLabel: string; noticePlaceholder: string; noticeInfo: string
    gateExample: string; createFlight: string; saveFlight: string; publishNotice: string
    saving: string; errorFlight: string
  }
  errors: {
    generic: string; authRequired: string; permissionDenied: string; validation: string
    duplicateRecord: string; duplicateActiveFlight: string; flightNotFound: string
    versionConflict: string; flightFinished: string; rateLimited: string; originRejected: string
  }
}

export interface Translations {
  lang: 'en' | 'id'
  admin: AdminTranslations

  nav: {
    flights: string
    map: string
    parking: string
    transport: string
    terminals: string
    facilities: string
    guide: string
    services: string
    faq: string
  }

  header: {
    notificationsTitle: string
  }

  hero: {
    eyebrow: string
    title1: string
    title2: string
    subtitle: string
    searchPlaceholder: string
    liveBoard: string
    noResults: (q: string) => string
    localTime: string
    weather: string
    stats: {
      departuresToday: string
      nowBoarding: string
      delayed: string
      airlinesServing: string
    }
    disclaimer: string
  }

  flightBoard: {
    eyebrow: string
    title: string
    subtitle: string
    departures: string
    arrivals: string
    filterPlaceholder: string
    colTime: string
    colFlight: string
    colDestination: string
    colOrigin: string
    colGate: string
    colEst: string
    colStatus: string
    noResults: (tab: 'departure' | 'arrival') => string
    to: string
    from: string
    footnote: string
  }

  map: {
    eyebrow: string
    title: string
    subtitle: string
    selectedZone: string
    toiletsNote: string
    legendPassenger: string
    legendSelected: string
    legendAirside: string
    zones: Record<'checkin' | 'domestic' | 'international' | 'arrivals' | 'landside', ZoneTranslation>
  }

  parking: {
    eyebrow: string
    title: string
    subtitle: string
    occupancy: string
    baysFree: (free: number, capacity: number) => string
  }

  transport: {
    eyebrow: string
    title: string
    subtitle: string
    fare: string
    schedule: string
    where: string
  }

  terminal: {
    eyebrow: string
    title: string
    floors: (n: number) => string
    airlines: string
    keyFacilities: string
  }

  facilities: {
    eyebrow: string
    title: string
    subtitle: string
    catAll: string
    wing: string
    where: string
    hours: string
    domestic: string
    international: string
  }

  guide: {
    eyebrow: string
    title: string
    departing: string
    arriving: string
    departSteps: GuideStep[]
    arriveSteps: GuideStep[]
  }

  services: {
    eyebrow: string
    title: string
    weatherTitle: string
    feelsLike: string
    wind: string
    humidity: string
    visibility: string
    lostFoundTitle: string
    desk: string
    hours: string
    phone: string
    email: string
    accessibilityTitle: string
    accessibilityItems: AccessibilityItem[]
    emergencyTitle: string
    emergencyTips: string[]
    lostFoundSteps: string[]
  }

  faq: {
    eyebrow: string
    title: string
    subtitle: string
    items: FaqItem[]
  }

  footer: {
    address: string
    explore: string
    contact: string
    links: Array<[string, string]>
    infoLabel: string
    emergencyLabel: string
    lostFoundLabel: string
    openHours: string
    copyright: string
  }

  chatbot: {
    greeting: string
    title: string
    online: string
    placeholder: string
    fallback: string
  }
}
