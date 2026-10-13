import { useState, type ReactNode } from 'react'
import { AuthContext, type AdminUser } from './auth-context'

const SESSION_KEY = 'mdc-admin-session'
function readSession(): AdminUser | null {
  try {
    const value = sessionStorage.getItem(SESSION_KEY)
    return value ? (JSON.parse(value) as AdminUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(readSession)

  const login = (email: string, password: string) => {
    if (!email.trim() || password.length < 8) return 'Enter a valid email and a password of at least 8 characters.'
    const next = { email: email.trim().toLowerCase() }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
    setUser(next)
    return null
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
