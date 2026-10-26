import { createContext } from 'react'

export interface AdminUser {
  id: string
  email: string
  role: 'operator'
}

export interface AuthState {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)
