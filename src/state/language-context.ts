import { createContext } from 'react'
import type { Translations } from '@/i18n/types'
import { en } from '@/i18n/en'

export type Lang = 'en' | 'id'

export interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: en,
})
