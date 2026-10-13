// ---------------------------------------------------------------------------
// Translation shape — every key here must be present in both en.ts and id.ts
// ---------------------------------------------------------------------------

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

export interface Translations {
  lang: 'en' | 'id'

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
