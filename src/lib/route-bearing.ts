import type { Flight } from '@/data/airport'

/**
 * Approximate compass bearing (0° = north) from Manado (MDC) to each destination/origin,
 * computed from airport coordinates. Used only to place flights on the radar view.
 */
const BEARING: Record<string, number> = {
  CGK: 247, SUB: 234, UPG: 219, DPS: 223, BPN: 251, SOQ: 110,
  TTE: 105, GTO: 247, SIN: 270, KUL: 273, NAH: 16,
}

export const RADAR_R_MIN = 30
export const RADAR_R_MAX = 200
export const RADAR_MAX_ETA = 240 // minutes shown on the radar; the outer ring

const hash = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Radius for a given ETA in minutes (overdue flights sit on the inner ring). */
export const etaRadius = (etaMin: number) =>
  RADAR_R_MIN + (Math.min(Math.max(etaMin, 0), RADAR_MAX_ETA) / RADAR_MAX_ETA) * (RADAR_R_MAX - RADAR_R_MIN)

/** Position of a flight on the radar: angle from the route's bearing (+ small stable jitter), radius from ETA. */
export function blipPosition(f: Flight, etaMin: number): { x: number; y: number } {
  const code = /\(([A-Z]{3})\)/.exec(f.city)?.[1]
  const base = code !== undefined && code in BEARING ? BEARING[code] : hash(f.city) % 360
  const jitter = (hash(`${f.kind}${f.no}`) % 17) - 8
  const rad = ((base + jitter) * Math.PI) / 180
  const r = etaRadius(etaMin)
  return { x: r * Math.sin(rad), y: -r * Math.cos(rad) }
}
