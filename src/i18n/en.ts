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
