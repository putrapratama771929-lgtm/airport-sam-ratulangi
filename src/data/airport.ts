// ---- Types ----
export type FlightStatus =
  | 'SCHEDULED'
  | 'CHECK-IN'
  | 'BOARDING'
  | 'FINAL CALL'
  | 'DEPARTED'
  | 'LANDED'
  | 'DELAYED'
  | 'CANCELLED'

export interface Flight {
  id: string
  version?: number
  createdAt?: string
  updatedAt?: string
  serviceDate?: string
  no: string
  airline: string
  city: string // origin/destination city
  wing: 'D' | 'I' // Domestic / International wing
  gate: string
  sched: string // HH:mm
  est: string
  status: FlightStatus
  kind: 'departure' | 'arrival'
}

export interface Notif {
  id: number
  time: string
  msg: string
  type: 'info' | 'delay' | 'gate' | 'boarding'
  messageCode?: 'flight.added' | 'flight.delayed' | 'flight.cancelled' | 'flight.gate_changed' | 'flight.status_updated'
  messageParams?: Record<string, string | number>
}

// ---- Airlines & routes (Sam Ratulangi Intl — MDC, Manado) ----
const DEP_ROUTES: Array<[string, string, string, 'D' | 'I']> = [
  ['GA 601', 'Garuda Indonesia', 'Jakarta (CGK)', 'D'],
  ['JT 791', 'Lion Air', 'Makassar (UPG)', 'D'],
  ['ID 6181', 'Batik Air', 'Jakarta (CGK)', 'D'],
  ['QG 311', 'Citilink', 'Surabaya (SUB)', 'D'],
  ['IU 774', 'Super Air Jet', 'Denpasar (DPS)', 'D'],
  ['JT 3743', 'Lion Air', 'Balikpapan (BPN)', 'D'],
  ['ID 6357', 'Batik Air', 'Sorong (SOQ)', 'D'],
  ['IW 1361', 'Wings Air', 'Ternate (TTE)', 'D'],
  ['SJ 589', 'Sriwijaya Air', 'Gorontalo (GTO)', 'D'],
  ['TR 215', 'Scoot', 'Singapore (SIN)', 'I'],
  ['AK 1725', 'AirAsia', 'Kuala Lumpur (KUL)', 'I'],
  ['GA 845', 'Garuda Indonesia', 'Singapore (SIN)', 'I'],
  ['QG 555', 'Citilink', 'Jakarta (CGK)', 'D'],
  ['JT 787', 'Lion Air', 'Surabaya (SUB)', 'D'],
  ['IU 3770', 'Super Air Jet', 'Makassar (UPG)', 'D'],
  ['IW 1313', 'Wings Air', 'Tahuna (NAH)', 'D'],
]

const ARR_ROUTES: Array<[string, string, string, 'D' | 'I']> = [
  ['GA 600', 'Garuda Indonesia', 'Jakarta (CGK)', 'D'],
  ['JT 790', 'Lion Air', 'Makassar (UPG)', 'D'],
  ['ID 6180', 'Batik Air', 'Jakarta (CGK)', 'D'],
  ['QG 310', 'Citilink', 'Surabaya (SUB)', 'D'],
  ['IU 773', 'Super Air Jet', 'Denpasar (DPS)', 'D'],
  ['JT 3744', 'Lion Air', 'Balikpapan (BPN)', 'D'],
  ['ID 6358', 'Batik Air', 'Sorong (SOQ)', 'D'],
  ['IW 1362', 'Wings Air', 'Ternate (TTE)', 'D'],
  ['TR 214', 'Scoot', 'Singapore (SIN)', 'I'],
  ['AK 1724', 'AirAsia', 'Kuala Lumpur (KUL)', 'I'],
  ['GA 844', 'Garuda Indonesia', 'Singapore (SIN)', 'I'],
  ['JT 786', 'Lion Air', 'Surabaya (SUB)', 'D'],
]

// ---- Time helpers (all airport times are WITA / Asia/Makassar, regardless of the viewer's timezone) ----
export const AIRPORT_TZ = 'Asia/Makassar'

const hhmmFormat = new Intl.DateTimeFormat('en-GB', { timeZone: AIRPORT_TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
const clockFormat = new Intl.DateTimeFormat('en-GB', { timeZone: AIRPORT_TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
const dateFormat = new Intl.DateTimeFormat('en-GB', { timeZone: AIRPORT_TZ, weekday: 'short', day: '2-digit', month: 'short' })

/** "HH:mm" in WITA */
export const fmtTime = (d: Date) => hhmmFormat.format(d)
/** "HH:mm:ss" in WITA */
export const fmtClock = (d: Date) => clockFormat.format(d)
/** e.g. "Wed, 30 Sept" in WITA */
export const fmtDate = (d: Date) => dateFormat.format(d)

const HHMM = /^([01]?\d|2[0-3]):([0-5]\d)$/

/** Minutes since midnight for a valid "HH:mm" string, otherwise null. */
export function toMinutes(hhmm: string): number | null {
  const m = HHMM.exec(hhmm.trim())
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

export const isValidTime = (hhmm: string) => toMinutes(hhmm) !== null

/** Add minutes to an "HH:mm" string, wrapping past midnight. Returns the input unchanged if it is invalid. */
export function addMinutes(hhmm: string, delta: number): string {
  const base = toMinutes(hhmm)
  if (base === null) return hhmm
  const total = (((base + delta) % 1440) + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

/** Current minutes since midnight in WITA. */
export const nowMinutes = (d: Date = new Date()) => toMinutes(fmtTime(d)) ?? 0

/**
 * Sort key for a board time: orders times on a rolling window (6h ago -> 18h ahead of `ref`)
 * so that 23:50 and 00:10 sort correctly around midnight. Invalid times sort last.
 */
export function boardKey(hhmm: string, ref: number): number {
  const m = toMinutes(hhmm)
  if (m === null) return Number.POSITIVE_INFINITY
  return (((m - ref + 360) % 1440) + 1440) % 1440
}

function at(offsetMin: number, base: Date) {
  return fmtTime(new Date(base.getTime() + offsetMin * 60_000))
}

export function initialFlights(): Flight[] {
  const now = new Date()
  const out: Flight[] = []
  DEP_ROUTES.forEach(([no, airline, city, wing], i) => {
    const offset = -40 + i * 22
    const status: FlightStatus =
      offset < -15 ? 'DEPARTED' : offset < 10 ? 'BOARDING' : offset < 40 ? 'CHECK-IN' : 'SCHEDULED'
    out.push({
      id: `D${i}`,
      no,
      airline,
      city,
      wing,
      gate: `${wing}${(i % 8) + 1}`,
      sched: at(offset, now),
      est: at(offset, now),
      status,
      kind: 'departure',
    })
  })
  ARR_ROUTES.forEach(([no, airline, city, wing], i) => {
    const offset = -25 + i * 18
    const status: FlightStatus = offset < 0 ? 'LANDED' : offset < 30 ? 'FINAL CALL' : 'SCHEDULED'
    out.push({
      id: `A${i}`,
      no,
      airline,
      city,
      wing,
      gate: `${wing}${(i % 8) + 1}`,
      sched: at(offset, now),
      est: at(offset, now),
      status,
      kind: 'arrival',
    })
  })
  return out
}

// ---- Terminals ----
export interface TerminalInfo {
  code: string
  name: string
  focus: string
  airlines: string[]
  facilities: string[]
  floors: number
  gates: string
}

export const TERMINALS: TerminalInfo[] = [
  {
    code: 'D',
    name: 'Domestic Wing',
    focus: 'All domestic departures & arrivals across Indonesia',
    airlines: ['Garuda Indonesia', 'Lion Air', 'Batik Air', 'Citilink', 'Super Air Jet', 'Wings Air', 'Sriwijaya Air'],
    facilities: ['Food court', 'Prayer rooms', 'ATM centre', 'Souvenir shops', 'Nursing room', 'Kids zone'],
    floors: 2,
    gates: 'Gates D1–D8',
  },
  {
    code: 'I',
    name: 'International Wing',
    focus: 'Regional international routes — Singapore & Kuala Lumpur',
    airlines: ['Scoot', 'AirAsia', 'Garuda Indonesia'],
    facilities: ['Immigration & customs', 'Duty free', 'Executive lounge', 'Money changer', 'Transit rest area'],
    floors: 2,
    gates: 'Gates I1–I4',
  },
]

// ---- Parking ----
export interface ParkingInfo {
  name: string
  capacity: number
  used: number
  rate: string
  note: string
  type: string
}

export const PARKING: ParkingInfo[] = [
  { name: 'P1 — Terminal Front', capacity: 800, used: 645, rate: 'IDR 6,000 / hr', note: 'Max IDR 60,000 / day', type: 'Car' },
  { name: 'P2 — East Lot', capacity: 600, used: 210, rate: 'IDR 6,000 / hr', note: 'Max IDR 60,000 / day', type: 'Car' },
  { name: 'Motorcycle Park', capacity: 500, used: 190, rate: 'IDR 3,000 / hr', note: 'Max IDR 25,000 / day', type: 'Motorcycle' },
  { name: 'Overnight Parking', capacity: 250, used: 218, rate: 'IDR 50,000 / day', note: 'Day 4+ IDR 35,000', type: 'Car' },
  { name: 'Premium Drop-off', capacity: 80, used: 31, rate: 'IDR 20,000 / 30 min', note: 'Closest to departure hall', type: 'Car' },
]

// ---- Transportation ----
export interface TransportInfo {
  name: string
  icon: 'taxi' | 'bus' | 'car' | 'shuttle' | 'ride'
  desc: string
  fare: string
  sched: string
  where: string
}

export const TRANSPORT: TransportInfo[] = [
  {
    name: 'Official Airport Taxi',
    icon: 'taxi',
    desc: 'Metered taxis with an official queue at the arrivals curb.',
    fare: 'From IDR 15,000 + meter',
    sched: '24 hours',
    where: 'Arrivals level, Exit 2',
  },
  {
    name: 'DAMRI Airport Bus',
    icon: 'bus',
    desc: 'Routes to Manado city centre, Megamas, and Bitung.',
    fare: 'IDR 30,000–50,000',
    sched: 'Every 30–45 min, 05:00–21:00',
    where: 'Bus shelter, arrivals forecourt',
  },
  {
    name: 'Ride-hailing Pick-up',
    icon: 'ride',
    desc: 'Grab & Gojek dedicated pick-up zone with waiting lounge.',
    fare: 'App fare',
    sched: '24 hours',
    where: 'Zone C, ground parking level',
  },
  {
    name: 'Car Rental',
    icon: 'car',
    desc: 'Self-drive or chauffeured cars; counters in the arrivals gallery.',
    fare: 'From IDR 400,000 / day',
    sched: '06:00–22:00',
    where: 'Arrivals gallery, domestic wing',
  },
  {
    name: 'Inter-wing Shuttle',
    icon: 'shuttle',
    desc: 'Free electric shuttle between domestic & international wings.',
    fare: 'Free',
    sched: 'Every 10 min, 24 hours',
    where: 'Shuttle stop at each wing entrance',
  },
]

// ---- Facilities ----
export interface FacilityInfo {
  name: string
  cat: 'Dining' | 'Shopping' | 'ATM' | 'Lounge' | 'Rest' | 'Charging'
  wing: string
  where: string
  hours: string
}

export const FACILITIES: FacilityInfo[] = [
  { name: 'Kopi Kawanua', cat: 'Dining', wing: 'D', where: 'Level 2, near Gate D3', hours: '05:00–22:00' },
  { name: 'Manado Seafood Grill', cat: 'Dining', wing: 'D', where: 'Level 2, food court', hours: '06:00–21:00' },
  { name: 'Bunaken Bites', cat: 'Dining', wing: 'I', where: 'After immigration', hours: '24 hours' },
  { name: 'Kawanua Souvenir House', cat: 'Shopping', wing: 'D', where: 'Level 1, public hall', hours: '06:00–21:00' },
  { name: 'MDC Duty Free', cat: 'Shopping', wing: 'I', where: 'International departures', hours: '05:00–00:00' },
  { name: 'Minimart 24', cat: 'Shopping', wing: 'D', where: 'Level 2, by escalators', hours: '24 hours' },
  { name: 'ATM Centre (BCA · Mandiri · BNI)', cat: 'ATM', wing: 'D', where: 'Level 1, main entrance', hours: '24 hours' },
  { name: 'Money Changer', cat: 'ATM', wing: 'I', where: 'International arrivals', hours: '06:00–22:00' },
  { name: 'Minahasa Executive Lounge', cat: 'Lounge', wing: 'I', where: 'Level 2, near Gate I2', hours: '05:00–22:00' },
  { name: 'Sky View Lounge', cat: 'Lounge', wing: 'D', where: 'Level 2, west end', hours: '05:00–21:00' },
  { name: 'Transit Rest Pods', cat: 'Rest', wing: 'I', where: 'Transit zone, Level 2', hours: '24 hours' },
  { name: 'Quiet Room & Prayer Rooms', cat: 'Rest', wing: 'D', where: 'Both levels, follow signage', hours: '24 hours' },
  { name: 'Gate Charging Bars', cat: 'Charging', wing: 'D', where: 'Every departure gate', hours: '24 hours' },
  { name: 'Fast-Charge Hub', cat: 'Charging', wing: 'I', where: 'Central atrium', hours: '24 hours' },
]

// ---- Travel guide ----
export interface Step {
  title: string
  desc: string
  time: string
}

export const GUIDE_DEPART: Step[] = [
  { title: 'Arrive early', desc: 'Domestic: 2 hours before departure. International: 3 hours.', time: 'T-3h to T-2h' },
  { title: 'Check in', desc: 'Counter, self-service kiosk, or online check-in via your airline app.', time: 'Until T-45m' },
  { title: 'Baggage drop', desc: 'Drop checked bags at the baggage counter. Cabin liquids limited to 100 ml.', time: 'Until T-45m' },
  { title: 'Security screening', desc: 'Have boarding pass & ID ready. Remove jackets, belts, and large electronics.', time: '± 15 min' },
  { title: 'Immigration (intl.)', desc: 'Passport valid min. 6 months plus travel documents.', time: '± 20 min' },
  { title: 'Head to gate', desc: 'Watch the boards — gates can change. Boarding closes 20 min before departure.', time: 'T-40m' },
]

export const GUIDE_ARRIVE: Step[] = [
  { title: 'Immigration (intl.)', desc: 'Queue by citizenship; use autogates if registered.', time: '± 15 min' },
  { title: 'Collect baggage', desc: 'Check the belt number on the baggage-claim screens.', time: '± 20 min' },
  { title: 'Customs', desc: 'Complete the e-CD (electronic customs declaration) before arrival for the fast lane.', time: '± 10 min' },
  { title: 'Pick-up zone', desc: 'Ride-hailing and official taxis have separate zones — follow the signs.', time: '—' },
  { title: 'Onward journey', desc: 'DAMRI bus, taxi, or the free shuttle for connecting flights.', time: '—' },
]

// ---- Emergency ----
export interface EmergencyContact {
  name: string
  number: string
  desc: string
}

export const EMERGENCY: EmergencyContact[] = [
  { name: 'Airport Emergency Centre', number: '112', desc: 'Fire, medical, and security response — 24/7' },
  { name: 'Aviation Security (Avsec)', number: '(0431) 814-112', desc: 'Suspicious items, security incidents' },
  { name: 'Medical Clinic (Level 1)', number: '(0431) 814-119', desc: 'First aid & airport clinic near domestic arrivals' },
  { name: 'National Search & Rescue', number: '115', desc: 'BASARNAS coordination line' },
]

export const EMERGENCY_TIPS: string[] = [
  'In an evacuation, leave all baggage and follow the illuminated green exit signs.',
  'Assembly points are located in the P2 East Lot and the arrivals forecourt.',
  'AED units are mounted beside every information desk and Gate D4 / I2.',
  'Report unattended items to any uniformed officer — do not touch or move them.',
]

// ---- Lost & Found ----
export const LOST_FOUND = {
  phone: '(0431) 814-130',
  email: 'lostandfound@mdc-airport.id',
  desk: 'Level 1, beside the information desk (domestic wing)',
  hours: '06:00–22:00',
  steps: [
    'Report the item at the Lost & Found desk or via email with your flight details.',
    'Provide a description: brand, colour, contents, and where it was last seen.',
    'You will receive a case number for tracking within 1×24 hours.',
    'Items are kept for 90 days; unclaimed items are handed to the authorities.',
  ],
}

// ---- Accessibility ----
export const ACCESSIBILITY = [
  { title: 'Wheelchair assistance', desc: 'Free of charge — request via your airline at least 48 hours before departure, or at the information desk.' },
  { title: 'Priority lanes', desc: 'Dedicated check-in, security, and boarding lanes for seniors, pregnant travellers, and passengers with disabilities.' },
  { title: 'Accessible facilities', desc: 'Step-free routes, tactile paving, accessible toilets on both levels, and reserved parking bays at P1.' },
  { title: 'Travelling with companions', desc: 'One companion may escort a passenger with reduced mobility through to the boarding gate.' },
]

// ---- FAQ ----
export const FAQ: Array<{ q: string; a: string }> = [
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
    a: 'A passport valid for at least 6 months, applicable visas, and a completed e-CD customs declaration. Check your destination\'s entry requirements before flying.',
  },
]

// ---- Weather (static snapshot for the prototype) ----
export const WEATHER = {
  temp: 29,
  feels: 33,
  cond: 'Partly Cloudy',
  wind: '14 km/h WSW',
  humidity: '78%',
  vis: '9 km',
  updated: 'Sample data · Manado, North Sulawesi',
}
