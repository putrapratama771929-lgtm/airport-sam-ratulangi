import type { CSSProperties } from 'react'

/** Sets the --tone CSS variable used by rows, pills, callouts and notices. */
export const toneStyle = (color: string) => ({ '--tone': color }) as CSSProperties
