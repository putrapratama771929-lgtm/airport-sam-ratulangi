import type { Flight } from '@/data/airport'

/** Extracts a flight number such as "GA 601", "ga601" or "ID-6181" from free text. Returns e.g. "GA 601". */
export function parseFlightNo(text: string): string | null {
  const m = /\b([a-z]{2})[\s-]?(\d{2,4})\b/i.exec(text)
  return m ? `${m[1].toUpperCase()} ${m[2]}` : null
}

export function matchByNumber(flights: Flight[], text: string): Flight[] {
  const no = parseFlightNo(text)
  return no ? flights.filter((f) => f.no.toUpperCase() === no) : []
}

const plainCity = (city: string) => city.replace(/\s*\(.*\)\s*$/, '').toLowerCase()
const iata = (city: string) => /\(([A-Z]{3})\)/.exec(city)?.[1].toLowerCase()

/** Matches flights whose city, IATA code or airline is mentioned in the text. */
export function matchByPlace(flights: Flight[], text: string): Flight[] {
  const s = text.toLowerCase()
  const words = new Set(s.split(/[^a-z0-9]+/).filter(Boolean))
  return flights.filter((f) => {
    const code = iata(f.city)
    return s.includes(plainCity(f.city)) || (code !== undefined && words.has(code)) || s.includes(f.airline.toLowerCase())
  })
}

/** Flight number first, then place/airline. */
export function searchFlights(flights: Flight[], text: string): Flight[] {
  if (!text.trim()) return []
  const byNumber = matchByNumber(flights, text)
  return byNumber.length ? byNumber : matchByPlace(flights, text)
}
