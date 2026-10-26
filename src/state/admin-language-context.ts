import { createContext } from 'react'
import type { Translations } from '@/i18n/types'
import { en } from '@/i18n/en'

export type AdminLang = 'en' | 'id'

export interface AdminLanguageContextValue {
  lang: AdminLang
  setLang: (lang: AdminLang) => void
  t: Translations['admin']
}

export const AdminLanguageContext = createContext<AdminLanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: en.admin,
})
