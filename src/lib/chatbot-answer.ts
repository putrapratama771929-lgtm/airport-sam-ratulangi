import { WEATHER, type Flight } from '@/data/airport'
import { matchByNumber, matchByPlace } from '@/lib/flight-search'
import type { Lang } from '@/state/language-context'

// ---------------------------------------------------------------------------
// English rules
// ---------------------------------------------------------------------------
const RULES_EN: Array<{ keys: string[]; answer: string }> = [
  {
    keys: ['park*'],
    answer:
      'We have 5 parking areas. P1 (terminal front) is closest at IDR 6,000/hr; overnight parking is IDR 50,000/day. Check the Parking section for occupancy.',
  },
  {
    keys: ['taxi', 'taxis', 'transport*', 'bus', 'buses', 'damri', 'grab', 'gojek', 'rental', 'shuttle', 'ride'],
    answer:
      'Official taxis queue at Arrivals Exit 2 (24h). DAMRI buses run to Manado & Bitung every 30–45 min. Ride-hailing pick-up is at Zone C. See the Transportation section for fares.',
  },
  {
    keys: ['wifi', 'wi-fi', 'internet'],
    answer: 'Free unlimited Wi-Fi: connect to "MDC-FreeWiFi" anywhere in the terminal and accept the terms.',
  },
  {
    keys: ['lost', 'found', 'left behind', 'forgot*', 'missing'],
    answer:
      'For lost items, visit the Lost & Found desk (Level 1, domestic wing, 06:00–22:00) or call (0431) 814-130. Items are kept for 90 days.',
  },
  {
    keys: ['check-in', 'check in', 'checkin', 'early'],
    answer:
      'Arrive 2 hours early for domestic and 3 hours for international flights. Check-in counters close 45 minutes before departure.',
  },
  {
    keys: ['liquid*', 'baggage', 'luggage', 'cabin', 'carry-on', 'carry on', 'bag', 'bags'],
    answer:
      'Cabin liquids must be in containers of 100 ml or less inside a single 1-litre transparent bag. Checked baggage limits depend on your airline.',
  },
  {
    keys: ['lounge', 'lounges'],
    answer:
      'Lounges: Minahasa Executive Lounge (International Wing, Level 2) and Sky View Lounge (Domestic Wing, Level 2, west end).',
  },
  {
    keys: ['wheelchair', 'disab*', 'elderly', 'senior', 'accessib*'],
    answer:
      'Wheelchair assistance is free — request it via your airline 48 hours ahead or at the information desk. Priority lanes are available at check-in, security, and boarding.',
  },
  {
    keys: ['emergency', 'medical', 'clinic', 'ambulance', 'doctor', 'hospital'],
    answer:
      'Emergency: dial 112 (24/7). The airport medical clinic is on Level 1 near domestic arrivals: (0431) 814-119.',
  },
  {
    keys: ['weather', 'rain', 'temperature'],
    answer: `Sample conditions shown on this site: ${WEATHER.temp}°C, ${WEATHER.cond.toLowerCase()}. This is demo data — for official conditions please check BMKG (bmkg.go.id).`,
  },
  {
    keys: ['bunaken', 'dive', 'diving', 'island'],
    answer:
      'For Bunaken: taxi or DAMRI bus to Manado harbour (± 45 min), then a boat to the island. Boats generally leave before 15:00.',
  },
  {
    keys: ['hotel', 'sleep', 'rest pod', 'rest pods', 'transit', 'layover'],
    answer:
      'Transit rest pods are available 24h in the International Wing. The terminal itself is open 24 hours with landside seating areas.',
  },
]

// ---------------------------------------------------------------------------
// Indonesian rules
// ---------------------------------------------------------------------------
const RULES_ID: Array<{ keys: string[]; answer: string }> = [
  {
    keys: ['park*', 'parkir*'],
    answer:
      'Terdapat 5 area parkir. P1 (depan terminal) terdekat dengan tarif IDR 6.000/jam; parkir semalam IDR 50.000/hari. Cek bagian Parkir untuk ketersediaan.',
  },
  {
    keys: ['taksi', 'taxi', 'transport*', 'bus', 'damri', 'grab', 'gojek', 'rental', 'shuttle', 'ojek'],
    answer:
      'Taksi resmi antre di Pintu Kedatangan 2 (24 jam). Bus DAMRI ke Manado & Bitung setiap 30–45 menit. Area ojek online di Zona C. Lihat bagian Transportasi untuk tarif.',
  },
  {
    keys: ['wifi', 'wi-fi', 'internet'],
    answer: 'Wi-Fi gratis tanpa batas: sambungkan ke "MDC-FreeWiFi" di mana saja di terminal dan terima syaratnya.',
  },
  {
    keys: ['hilang', 'ketinggalan', 'lupa', 'barang', 'temuan'],
    answer:
      'Untuk barang hilang, kunjungi meja Barang Hilang & Temuan (Lantai 1, sayap domestik, 06:00–22:00) atau hubungi (0431) 814-130. Barang disimpan 90 hari.',
  },
  {
    keys: ['check-in', 'checkin', 'lapor', 'daftar'],
    answer:
      'Tiba 2 jam lebih awal untuk penerbangan domestik dan 3 jam untuk internasional. Konter check-in tutup 45 menit sebelum keberangkatan.',
  },
  {
    keys: ['cairan', 'bagasi', 'koper', 'kabin', 'tas'],
    answer:
      'Cairan di bagasi kabin harus dalam wadah ≤100 ml di dalam satu kantong transparan 1 liter. Batas bagasi terdaftar tergantung maskapai.',
  },
  {
    keys: ['lounge', 'ruang tunggu vip'],
    answer:
      'Lounge: Minahasa Executive Lounge (Sayap Internasional, Lantai 2) dan Sky View Lounge (Sayap Domestik, Lantai 2, sisi barat).',
  },
  {
    keys: ['kursi roda', 'disabilitas', 'lansia', 'hamil', 'aksesib*'],
    answer:
      'Bantuan kursi roda gratis — minta melalui maskapai 48 jam sebelumnya atau di meja informasi. Jalur prioritas tersedia di check-in, keamanan, dan boarding.',
  },
  {
    keys: ['darurat', 'medis', 'klinik', 'ambulans', 'dokter', 'sakit'],
    answer:
      'Darurat: hubungi 112 (24 jam). Klinik medis bandara di Lantai 1 dekat kedatangan domestik: (0431) 814-119.',
  },
  {
    keys: ['cuaca', 'hujan', 'suhu', 'temperatur'],
    answer: `Kondisi sampel: ${WEATHER.temp}°C, ${WEATHER.cond.toLowerCase()}. Ini data demo — untuk kondisi resmi, cek BMKG (bmkg.go.id).`,
  },
  {
    keys: ['bunaken', 'selam', 'pulau', 'wisata'],
    answer:
      'Ke Bunaken: taksi atau bus DAMRI ke pelabuhan Manado (±45 menit), lalu kapal ke pulau. Kapal biasanya berangkat sebelum pukul 15:00.',
  },
  {
    keys: ['hotel', 'tidur', 'rest pod', 'transit', 'menginap'],
    answer:
      'Transit rest pod tersedia 24 jam di Sayap Internasional. Terminal buka 24 jam dengan area tempat duduk sisi darat.',
  },
]

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
const escapeRegex = (k: string) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function buildMatchers(rules: typeof RULES_EN) {
  return rules.map((rule) => ({
    rule,
    regex: new RegExp(
      rule.keys
        .map((k) => (k.endsWith('*') ? `\\b${escapeRegex(k.slice(0, -1))}` : `\\b${escapeRegex(k)}\\b`))
        .join('|'),
      'i',
    ),
  }))
}

const MATCHERS_EN = buildMatchers(RULES_EN)
const MATCHERS_ID = buildMatchers(RULES_ID)

const FALLBACK_EN =
  'I can help with flights, parking, transport, facilities, lost & found, and more. Try asking "Where is GA 601?" or "How much is parking?"'
const FALLBACK_ID =
  'Saya bisa membantu soal penerbangan, parkir, transportasi, fasilitas, barang hilang, dan lainnya. Coba tanya "Di mana GA 601?" atau "Berapa tarif parkir?"'

const describeFlight = (f: Flight, lang: Lang) => {
  const dir = f.kind === 'departure' ? (lang === 'id' ? 'ke' : 'to') : (lang === 'id' ? 'dari' : 'from')
  const sched = lang === 'id' ? `jadwal ${f.sched}` : `scheduled ${f.sched}`
  const est = f.est !== f.sched ? (lang === 'id' ? `, estimasi ${f.est}` : `, estimated ${f.est}`) : ''
  const gate = lang === 'id' ? `Gate ${f.gate}` : `Gate ${f.gate}`
  const status = lang === 'id' ? `Status: ${f.status}` : `Status: ${f.status}`
  return `Flight ${f.no} (${f.airline}) ${dir} ${f.city} — ${sched}${est}, ${gate}. ${status}.`
}

/**
 * Returns an answer based on the query, flights list, and selected language.
 * Order: explicit flight number → topic rules → city/airline match → fallback.
 */
export function answer(q: string, flights: Flight[], lang: Lang = 'en'): string {
  const matchers = lang === 'id' ? MATCHERS_ID : MATCHERS_EN
  const fallback = lang === 'id' ? FALLBACK_ID : FALLBACK_EN

  const byNumber = matchByNumber(flights, q)
  if (byNumber.length) return byNumber.map((f) => describeFlight(f, lang)).join('\n')

  for (const { rule, regex } of matchers) {
    if (regex.test(q)) return rule.answer
  }

  const byPlace = matchByPlace(flights, q)
  if (byPlace.length) {
    const shown = byPlace.slice(0, 3).map((f) => describeFlight(f, lang)).join('\n')
    const more =
      byPlace.length > 3
        ? lang === 'id'
          ? `\n…dan ${byPlace.length - 3} lainnya di papan Live.`
          : `\n…and ${byPlace.length - 3} more on the Live board.`
        : ''
    return shown + more
  }
  return fallback
}
