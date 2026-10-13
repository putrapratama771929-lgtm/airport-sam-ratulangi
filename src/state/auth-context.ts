import { createContext } from 'react'

export interface AdminUser {
  email: string
}

export interface AuthState {
  user: AdminUser | null
  login: (email: string, password: string) => string | null
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)
