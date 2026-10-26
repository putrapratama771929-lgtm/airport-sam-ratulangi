import { useMemo, useState, type ReactNode } from 'react'
import { en } from '@/i18n/en'
import { id } from '@/i18n/id'
import { AdminLanguageContext, type AdminLang } from './admin-language-context'

const STORAGE_KEY = 'mdc-admin-lang'

function readLanguage(): AdminLang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'id' ? 'id' : 'en'
  } catch {
    return 'en'
  }
}

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(readLanguage)

  const setLang = (next: AdminLang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // The current selection still works for this session when storage is unavailable.
    }
  }

  const t = useMemo(() => (lang === 'id' ? id.admin : en.admin), [lang])

  return <AdminLanguageContext.Provider value={{ lang, setLang, t }}>{children}</AdminLanguageContext.Provider>
}
