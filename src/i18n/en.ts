import type { Translations } from './types'

export const en: Translations = {
  lang: 'en',

  nav: {
    flights: 'Flights',
    map: 'Map',
    parking: 'Parking',
    transport: 'Transport',
    terminals: 'Terminals',
    facilities: 'Facilities',
    guide: 'Guide',
    services: 'Services',
    faq: 'FAQ',
  },

  header: {
    notificationsTitle: 'Flight notifications',
  },

  hero: {
    eyebrow: 'Sam Ratulangi International Airport',
    title1: 'Gateway to',
    title2: 'North Sulawesi',
    subtitle:
      'A flight-information prototype with terminal maps, parking, and essential MDC passenger information — all on one quiet page.',
    searchPlaceholder: 'Search flight no., airline, or city — e.g. GA 601, Garuda, Singapore',
    liveBoard: 'Live board',
    noResults: (q) => `No flights match "${q}"`,
    localTime: 'Local time · WITA',
    weather: 'Weather',
    stats: {
      departuresToday: 'Departures today',
      nowBoarding: 'Now boarding',
      delayed: 'Delayed',
      airlinesServing: 'Airlines serving',
    },
    disclaimer: 'Demo data only — not an operational flight-information service',
  },

  flightBoard: {
    eyebrow: '01 · Flight information',
    title: 'Live board',
    subtitle: 'Refreshed continuously. Boarding and final-call rows blink — like the boards above the gates.',
    departures: 'Departures',
    arrivals: 'Arrivals',
    filterPlaceholder: 'Filter flights…',
    colTime: 'Time',
    colFlight: 'Flight',
    colDestination: 'Destination',
    colOrigin: 'Origin',
    colGate: 'Gate',
    colEst: 'Est.',
    colStatus: 'Status',
    noResults: (tab) => `No ${tab}s match your filter`,
    to: 'to',
    from: 'from',
    footnote:
      '* Prototype data — statuses advance automatically every few seconds to simulate a live feed (delays, gate changes, boarding calls). All times in WITA (UTC+8).',
  },

  map: {
    eyebrow: '02 · Airport map',
    title: 'Find your way',
    subtitle: 'Tap a zone on the plan to see what is inside — gates, lounges, toilets, dining, and services.',
    selectedZone: 'Selected zone',
    toiletsNote: 'Toilets & lifts available in every zone',
    legendPassenger: 'Passenger zone',
    legendSelected: 'Selected',
    legendAirside: 'Airside',
    zones: {
      checkin: {
        label: 'Check-in Hall',
        desc: 'Counters A–F, self-service kiosks, and baggage drop.',
        items: [
          'Counters A–C: Garuda, Batik, Citilink',
          'Counters D–F: Lion Group & others',
          '8 self-service kiosks',
          'Oversize baggage desk',
        ],
      },
      domestic: {
        label: 'Domestic Wing · Gates D1–D8',
        desc: 'All domestic departures after security screening.',
        items: ['Gates D1–D8', 'Food court & Kopi Kawanua', 'Kids zone & nursing room', 'Gate charging bars'],
      },
      international: {
        label: 'International Wing · Gates I1–I4',
        desc: 'Immigration, duty free, and regional international gates.',
        items: ['Immigration & e-gates', 'MDC Duty Free', 'Minahasa Executive Lounge', 'Transit rest pods'],
      },
      arrivals: {
        label: 'Arrivals & Baggage Claim',
        desc: 'Belts 1–6, customs, and the pick-up forecourt.',
        items: ['Baggage belts 1–6', 'Customs (e-CD fast lane)', 'Taxi & ride-hailing zones', 'DAMRI bus shelter'],
      },
      landside: {
        label: 'Landside Services',
        desc: 'Public hall services before security.',
        items: ['Information desk', 'Lost & Found', 'ATM centre & money changer', 'Souvenir house'],
      },
    },
  },

  parking: {
    eyebrow: '03 · Parking',
    title: 'Park & fly',
    subtitle: 'Live occupancy across all lots. Bars turn amber as a lot fills up.',
    occupancy: 'Occupancy',
    baysFree: (free, capacity) => `${free.toLocaleString()} of ${capacity.toLocaleString()} bays free`,
  },

  transport: {
    eyebrow: '04 · Transportation',
    title: 'To & from Manado',
    subtitle: 'The airport sits 13 km northeast of Manado city centre — about 45 minutes by road.',
    fare: 'Fare',
    schedule: 'Schedule',
    where: 'Where',
  },

  terminal: {
    eyebrow: '05 · Terminal guide',
    title: 'One terminal, two wings',
    floors: (n) => `${n} floors`,
    airlines: 'Airlines',
    keyFacilities: 'Key facilities',
  },

  facilities: {
    eyebrow: '06 · Facilities',
    title: 'Eat, shop, recharge',
    subtitle: 'Restaurants, shops, ATMs, lounges, rest zones, and charging points across both wings.',
    catAll: 'All',
    wing: 'Wing',
    where: 'Where',
    hours: 'Hours',
    domestic: 'Domestic',
    international: 'International',
  },

  guide: {
    eyebrow: '07 · Travel guide',
    title: 'Before & after you fly',
    departing: 'Departing from MDC',
    arriving: 'Arriving at MDC',
    departSteps: [
      { title: 'Arrive early', desc: 'Domestic: 2 hours before departure. International: 3 hours.', time: 'T-3h to T-2h' },
      { title: 'Check in', desc: 'Counter, self-service kiosk, or online check-in via your airline app.', time: 'Until T-45m' },
      { title: 'Baggage drop', desc: 'Drop checked bags at the baggage counter. Cabin liquids limited to 100 ml.', time: 'Until T-45m' },
      { title: 'Security screening', desc: 'Have boarding pass & ID ready. Remove jackets, belts, and large electronics.', time: '± 15 min' },
      { title: 'Immigration (intl.)', desc: 'Passport valid min. 6 months plus travel documents.', time: '± 20 min' },
      { title: 'Head to gate', desc: 'Watch the boards — gates can change. Boarding closes 20 min before departure.', time: 'T-40m' },
    ],
    arriveSteps: [
      { title: 'Immigration (intl.)', desc: 'Queue by citizenship; use autogates if registered.', time: '± 15 min' },
      { title: 'Collect baggage', desc: 'Check the belt number on the baggage-claim screens.', time: '± 20 min' },
      { title: 'Customs', desc: 'Complete the e-CD (electronic customs declaration) before arrival for the fast lane.', time: '± 10 min' },
      { title: 'Pick-up zone', desc: 'Ride-hailing and official taxis have separate zones — follow the signs.', time: '—' },
      { title: 'Onward journey', desc: 'DAMRI bus, taxi, or the free shuttle for connecting flights.', time: '—' },
    ],
  },

  services: {
    eyebrow: '08 · Passenger services',
    title: 'Help when you need it',
    weatherTitle: 'Weather at MDC',
    feelsLike: 'Feels like',
    wind: 'Wind',
    humidity: 'Humidity',
    visibility: 'Visibility',
    lostFoundTitle: 'Lost & Found',
    desk: 'Desk',
    hours: 'Hours',
    phone: 'Phone',
    email: 'Email',
    accessibilityTitle: 'Accessibility',
    accessibilityItems: [
      {
        title: 'Wheelchair assistance',
        desc: 'Free of charge — request via your airline at least 48 hours before departure, or at the information desk.',
      },
      {
        title: 'Priority lanes',
        desc: 'Dedicated check-in, security, and boarding lanes for seniors, pregnant travellers, and passengers with disabilities.',
      },
      {
        title: 'Accessible facilities',
        desc: 'Step-free routes, tactile paving, accessible toilets on both levels, and reserved parking bays at P1.',
      },
      {
        title: 'Travelling with companions',
        desc: 'One companion may escort a passenger with reduced mobility through to the boarding gate.',
      },
    ],
    emergencyTitle: 'Emergency information',
    emergencyTips: [
      'In an evacuation, leave all baggage and follow the illuminated green exit signs.',
      'Assembly points are located in the P2 East Lot and the arrivals forecourt.',
      'AED units are mounted beside every information desk and Gate D4 / I2.',
      'Report unattended items to any uniformed officer — do not touch or move them.',
    ],
    lostFoundSteps: [
      'Report the item at the Lost & Found desk or via email with your flight details.',
      'Provide a description: brand, colour, contents, and where it was last seen.',
      'You will receive a case number for tracking within 1×24 hours.',
      'Items are kept for 90 days; unclaimed items are handed to the authorities.',
    ],
  },

  faq: {
    eyebrow: '09 · FAQ',
    title: 'Common questions',
    subtitle: "Can't find your answer? Ask Nara, our assistant, in the chat bubble at the bottom right.",
    items: [
      {
        q: 'How early should I arrive at the airport?',
        a: 'For domestic flights, arrive at least 2 hours before departure; for international flights, 3 hours. Check-in counters close 45 minutes before departure.',
      },
      {
        q: 'What is the cabin baggage liquid rule?',
        a: 'Liquids, aerosols, and gels in cabin baggage must be in containers of 100 ml or less, placed in a single transparent 1-litre resealable bag.',
      },
      {
        q: 'Is there free Wi-Fi at the airport?',
        a: 'Yes. Connect to the "MDC-FreeWiFi" network throughout the terminal. No time limit; simply accept the terms on the landing page.',
      },
      {
        q: 'Where can I store my luggage?',
        a: 'A left-luggage counter is available on Level 1 of the domestic wing (06:00–21:00). Rates start from IDR 25,000 per item per 4 hours.',
      },
      {
        q: 'How do I get to Bunaken from the airport?',
        a: 'Take a taxi or DAMRI bus to Manado harbour (± 45 minutes), then a public boat or charter to Bunaken Island. Boats generally depart before 15:00.',
      },
      {
        q: 'Can I sleep at the airport overnight?',
        a: 'The terminal is open 24 hours. Transit rest pods in the international wing and landside seating areas are available; overnight parking applies for vehicles.',
      },
      {
        q: 'What documents do I need for international flights?',
        a: "A passport valid for at least 6 months, applicable visas, and a completed e-CD customs declaration. Check your destination's entry requirements before flying.",
      },
    ],
  },

  footer: {
    address: 'Jl. A.A. Maramis, Manado 95374, North Sulawesi, Indonesia. IATA: MDC · ICAO: WAMM.',
    explore: 'Explore',
    contact: 'Contact',
    links: [
      ['Flights', '#flights'],
      ['Airport map', '#map'],
      ['Parking', '#parking'],
      ['Transport', '#transport'],
      ['Facilities', '#facilities'],
      ['Travel guide', '#guide'],
      ['Services', '#services'],
      ['FAQ', '#faq'],
    ],
    infoLabel: 'Information',
    emergencyLabel: 'Emergency',
    lostFoundLabel: 'Lost & Found',
    openHours: 'Open 24 hours · WITA (UTC+8)',
    copyright: '© 2026 Sam Ratulangi International Airport — design prototype',
  },

  admin: {
    language: { label: 'Dashboard language', english: 'English', indonesian: 'Indonesian', switchToEnglish: 'Switch dashboard language to English', switchToIndonesian: 'Switch dashboard language to Indonesian' },
    shell: {
      brandTitle: 'Sam Ratulangi Airport', brandSubtitle: 'Aerodrome operations · MDC', pilot: 'Internal pilot', pilotTooltip: 'Internal airport operations pilot with manual flight entry',
      clockLabel: 'Current airport time', timeZone: 'WITA', themeToLight: 'Switch to light theme', themeToDark: 'Switch to dark theme',
      eventLog: (unread) => `Event log${unread ? `, ${unread} unread` : ''}`, openEventLog: 'Open event log', signOut: (email) => `Sign out${email ? ` ${email}` : ''}`,
      sessionChecking: 'Checking pilot session…',
    },
    navigation: {
      label: 'Admin sections', overview: 'Overview', monitor: 'Flight monitor', eventLog: 'Event log',
      conflictCount: (count) => `${count} ${count === 1 ? 'conflict' : 'conflicts'}`, unreadCount: (count) => `${count} unread ${count === 1 ? 'notice' : 'notices'}`,
      footerDuty: 'Duty officer · WITA', manualPilot: 'INTERNAL PILOT · SYNTHETIC DEMO DATA',
    },
    operationalAlerts: {
      label: 'Operational status', attention: 'Attention required', scheduleUpdates: 'Schedule updates', noAlerts: 'No active operational alerts', syntheticScope: 'Internal pilot · synthetic data',
      conflictCount: (count) => `${count} active gate conflict${count === 1 ? '' : 's'}`,
      delayCount: (count) => `${count} recent high-severity delay notice${count === 1 ? '' : 's'}`,
      gateChangeCount: (count) => `${count} recent gate-change notice${count === 1 ? '' : 's'}`,
      viewMonitor: 'Open flight monitor', viewEventLog: 'Open event log',
    },
    summaryMetrics: {
      heading: 'At-a-glance metrics', scope: 'Airport-wide · synthetic pilot data', activeFlights: 'Active flights', delayedFlights: 'Delayed flights',
      onTimeEstimate: 'On-time performance · pilot estimate', gateUtilization: 'Gate utilization',
      trackedFlights: (tracked) => `${tracked} tracked · cancellations excluded`,
      delayedOfTracked: (delayed, tracked) => `${delayed} of ${tracked} tracked flights`,
      estimateBasis: (onTime, tracked) => `${onTime} not delayed / ${tracked} tracked · cancellations excluded`,
      gateOccupancy: (used, total) => `${used} of ${total} gates occupied`,
    },
    page: {
      overviewEyebrow: 'Operations / Terminal', overviewTitle: 'Airport operations', overviewDescription: 'Shift status, active exceptions, and movement overview.',
      monitorEyebrow: 'Operations / Flights', monitorTitle: 'Flight monitor', monitorDescription: 'Search and update scheduled, arriving, and departing flights.',
      eventEyebrow: 'Operations / Activity', eventTitle: 'Event log', eventDescription: 'Recent operational notices and flight status updates. Unread state is shared across this pilot desk.',
      dutyOfficer: 'Duty officer', loading: 'Loading pilot operations data…', retry: 'Retry', filterWing: 'Filter by airport wing', allWings: 'All wings',
      domesticWing: 'Domestic wing', internationalWing: 'International wing', dateLabel: 'Operating date in WITA',
      broadcastNotice: 'Broadcast notice', addFlight: 'Add flight', coreVitals: 'Core vitals', metricsPending: 'Draft metrics pending operations sign-off',
      pilotDateSummary: (date) => `Internal pilot · synthetic demo data · ${date} · WITA`, highAlerts: (count) => `${count} high`, operationsNotices: 'Operations notices', alertEyebrow: 'Alerts / Internal', viewEventLog: 'View event log',
    },
    common: {
      all: 'All', cancel: 'Cancel', keep: 'Keep', confirm: 'Confirm', review: 'Review', edit: 'Edit', save: 'Save',
      searchFlights: 'Search flights', searchFlightRouteGate: 'Search flight, route or gate', noFlightsMatch: 'No flights match the active filter.',
      departure: 'Departure', arrival: 'Arrival', domestic: 'Domestic', international: 'International', gate: 'Gate', gateConflict: 'Gate conflict', route: 'Route', status: 'Status', estimate: 'Estimate',
      notAvailable: '—', flights: 'flights', completed: 'Completed',
    },
    status: { SCHEDULED: 'Scheduled', 'CHECK-IN': 'Check-in', BOARDING: 'Boarding', 'FINAL CALL': 'Final call', DEPARTED: 'Departed', LANDED: 'Landed', DELAYED: 'Delayed', CANCELLED: 'Cancelled' },
    severity: { high: 'HIGH', med: 'MED', info: 'INFO' },
    actions: {
      openCheckIn: 'Open check-in', startBoarding: 'Start boarding', finalCall: 'Final call', markDeparted: 'Mark departed', markLanded: 'Mark landed', advance: 'Advance', completed: 'Completed',
      delay: (flight, minutes) => `Delay ${flight} by ${minutes} minutes`,
    },
    vitals: {
      labels: { completion: 'Flight completion', delayRate: 'Delay rate', boarding: 'Now boarding', gateUtilisation: 'Gate utilisation', activeFlights: 'Active flights' },
      units: { completedTracked: 'Departed or landed / tracked', delayedTracked: 'Delayed / tracked flights', boardingActive: 'Boarding or final call / active', gatesUsedTotal: 'Gates in use / total gates', activeTracked: 'In progress / tracked' },
    },
    queue: {
      eyebrow: 'Action queue / 01', title: 'Priority flights', subtitle: 'Delayed first. Advance a flight to close the loop.', delayed: 'Delayed', noDelayed: 'No delayed flights', delayedOnly: 'Delayed only', showAll: 'Show all',
      attention: (count) => `Attention (${count})`, allActive: (count) => `All active (${count})`, flightRoute: 'Flight / route', gateEstimateStatus: 'Gate · Est · Status', to: 'To', from: 'From', gateConflictTitle: 'Gate conflict',
      noFlightsMatchView: 'No flights match this view.', confirmCancel: (flight) => `Confirm cancel ${flight}`, delayFlight: (flight, minutes) => `Delay ${flight} by ${minutes} minutes`,
    },
    conflicts: {
      eyebrow: 'Conflict center / 00', title: 'Gate conflicts', noConflicts: 'No gate conflicts detected', needsAction: 'Needs action', autoResolve: (count) => `Auto-resolve ${count}`,
      noFreeGate: (wing) => `No free ${wing} gate — delay a flight or change its time.`, noFreeGatePlan: (count) => `${count} conflict(s) have no free gate — adjust times or delay a flight.`,
      draftRule: 'Draft pilot rule pending operations sign-off: shared gate within 30 minutes or gate outside wing range.',
      doubleBooked: (gate) => `Gate ${gate} double-booked`, invalidGate: (gate) => `Invalid gate “${gate}”`, moveFlight: (flight, gate) => `Move ${flight} to ${gate}`, reviewFlight: 'Review flight',
    },
    gates: {
      eyebrow: 'Gate matrix / 02', title: 'Gate status', selectGate: 'Select a gate to see its flights.', occupied: 'Occupied', boarding: 'Boarding', delayed: 'Delayed', free: 'Free',
      gates: 'gates', activeFlights: (count) => `${count} active`, flightAbbr: 'flt', noFlightsOnGate: 'No active flights on this gate.', gateAccessible: (gate, count) => `Gate ${gate}, ${count} active ${count === 1 ? 'flight' : 'flights'}`,
    },
    traffic: {
      eyebrow: 'Traffic / 04', title: 'Movements by hour', departures: 'Departures', arrivals: 'Arrivals', chartLabel: 'Departures and arrivals per estimated hour',
      chartDescription: (hour, count, direction) => `${hour}:00 — ${count} ${direction}`, groupedByEstimate: 'Grouped by estimated time (WITA). Highlighted column is the current hour.',
    },
    statusMix: { eyebrow: 'Status mix / 05', title: 'Flights by status', chartLabel: (count) => `${count} flights by status`, empty: 'No flights in this view.' },
    airlines: { eyebrow: 'Airlines / 03', title: 'Traffic by airline', rightLabel: 'Flights · delay share', empty: 'No flights in this view.' },
    notices: {
      empty: 'No notices yet.', severityLabel: 'Notice severity',
      system: {
        flightAdded: (flight, direction, city) => `Operations added flight ${flight} ${direction} ${city}.`,
        delayed: (flight, direction, city, minutes) => `Flight ${flight} ${direction} ${city} is delayed by ${minutes} minutes.`,
        cancelled: (flight, direction, city) => `Flight ${flight} ${direction} ${city} has been cancelled. Please contact your airline.`,
        gateChanged: (flight, gate) => `Gate change: flight ${flight} now uses Gate ${gate}.`,
        statusUpdated: (flight, status) => `Operations updated ${flight}: ${status.toLowerCase()}.`,
      },
    },
    eventLog: {
      eyebrow: 'Event log / 03', title: 'Latest notices', highRecent: (total, high) => `${total} · ${high} high · recent events`, filterLabel: 'Filter notices', all: 'All', delays: 'Delays', gateChanges: 'Gate changes', boarding: 'Boarding', info: 'Info', emptyType: 'No notices of this type.',
    },
    monitor: {
      eyebrow: 'Flight management / 02', title: 'Flight monitor', flightType: 'Flight type', allFlights: 'All flights', departures: 'Departures', arrivals: 'Arrivals',
      sortBy: 'Sort flights by', sortEstimate: 'Estimated time', sortFlight: 'Flight number', sortAirline: 'Airline', sortRoute: 'Route', sortGate: 'Gate', sortStatus: 'Status', sortAscending: 'Sort ascending', sortDescending: 'Sort descending',
      searchPlaceholder: 'Search flight, route, gate', tableFlight: 'Flight', tableRoute: 'Route', tableGate: 'Gate', tableEstimate: 'Estimate', tableStatus: 'Status', nextStep: 'Next step',
      gateFor: (flight) => `Gate for ${flight}`, estimateFor: (flight) => `Estimated time for ${flight}`, statusFor: (flight) => `Status for ${flight}`, invalidGate: 'Gate is not valid for this wing.', gateConflict: 'Gate conflict: another active flight uses this gate within 30 minutes.', schedule: (time) => `sched. ${time}`,
      showing: (start, end, total) => `Showing ${start}–${end} of ${total} loaded flights`, noMatches: 'No flights match the active filter.', previous: 'Previous', next: 'Next',
    },
    dialogs: {
      eyebrow: 'Operations action', close: 'Close dialog', addTitle: 'Add a flight', editTitle: (flight) => `Edit ${flight}`, noticeTitle: 'Broadcast notice', flightNumber: 'Flight number', airline: 'Airline', destination: 'Destination', origin: 'Origin', flightType: 'Flight type', wing: 'Wing', gate: 'Gate', operatingDate: 'Operating date (WITA)', scheduledWita: 'Scheduled (WITA)', estimatedWita: 'Estimated (WITA)', status: 'Status', noticeLabel: 'Internal operations notice', noticePlaceholder: 'Enter an internal operations notice…', noticeInfo: 'Stored in the internal Event log. This pilot does not publish notices to the public website.', gateExample: 'e.g. D1 or I3', createFlight: 'Create flight', saveFlight: 'Save flight', publishNotice: 'Publish notice', saving: 'Saving…', errorFlight: 'Could not complete the flight action.',
    },
    errors: {
      generic: 'The request could not be completed.', authRequired: 'Sign in to use airport operations.', permissionDenied: 'This account cannot perform airport operations.', validation: 'Check the flight details and try again.', duplicateRecord: 'A record with those details already exists.', duplicateActiveFlight: 'An active flight with those details is already on the board.', flightNotFound: 'Flight was not found. Refresh the board and try again.', versionConflict: 'This flight changed. Refresh and review the latest values before saving.', flightFinished: 'This flight is already complete.', rateLimited: 'Too many sign-in attempts. Try again later.', originRejected: 'Request origin is not allowed.',
    },
  },

  chatbot: {
    greeting:
      "Hello! I'm Nara, the MDC airport assistant. Ask me about flights, gates, parking, transport, or facilities.",
    title: 'Nara · Airport Assistant',
    online: 'Online · 24/7',
    placeholder: 'Ask about flights, parking…',
    fallback:
      'I can help with flights, parking, transport, facilities, lost & found, and more. Try asking "Where is GA 601?" or "How much is parking?"',
  },
}
