import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type AdminUser } from './auth-context'

const readSession = async (): Promise<AdminUser | null> => {
  const response = await fetch('/api/admin/session', { credentials: 'same-origin' })
  if (!response.ok) return null
  const result = await response.json() as { user: AdminUser | null }
  return result.user
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void readSession().then((current) => {
      if (active) setUser(current)
    }).catch(() => {
      if (active) setUser(null)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || password.length < 12) return 'Enter your pilot email and a password of at least 12 characters.'
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const result = await response.json() as { user?: AdminUser | null; message?: string }
      if (!response.ok || !result.user) return result.message ?? 'Sign-in failed.'
      setUser(result.user)
      return null
    } catch {
      return 'The pilot sign-in service is unavailable. Try again when the local service is running.'
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/admin/session', { method: 'DELETE', credentials: 'same-origin' })
    } catch {
      // Clear local access even when the service is unreachable; the server session expires independently.
    } finally {
      setUser(null)
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}
