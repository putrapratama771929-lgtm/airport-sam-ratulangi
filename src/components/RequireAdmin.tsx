import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/state/use-auth'
import type { ReactNode } from 'react'
import { useAdminLanguage } from '@/state/use-admin-language'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const { t } = useAdminLanguage()
  const location = useLocation()
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">{t.shell.sessionChecking}</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}
