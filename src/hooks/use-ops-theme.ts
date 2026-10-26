import { useCallback, useState } from 'react'

export type OpsTheme = 'dark' | 'light'
const KEY = 'mdc-ops-theme'

function read(): OpsTheme {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function useOpsTheme() {
  const [theme, setTheme] = useState<OpsTheme>(read)
  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: OpsTheme = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(KEY, next)
      } catch {
        /* storage unavailable: theme still changes for this session */
      }
      return next
    })
  }, [])
  return { theme, toggle }
}
