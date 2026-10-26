import { useContext } from 'react'
import { AdminLanguageContext } from './admin-language-context'

export const useAdminLanguage = () => useContext(AdminLanguageContext)
