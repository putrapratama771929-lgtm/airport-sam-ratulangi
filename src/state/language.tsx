import { useState, useMemo, type ReactNode } from 'react'
import { LanguageContext, type Lang } from './language-context'
import { en } from '@/i18n/en'
import { id } from '@/i18n/id'

const STORAGE_KEY = 'mdc-lang'

function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'id' ? 'id' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // ignore
    }
  }

  const t = useMemo(() => (lang === 'id' ? id : en), [lang])

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}
