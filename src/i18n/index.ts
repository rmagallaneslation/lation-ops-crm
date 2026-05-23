import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'

const storedLanguage = localStorage.getItem('lation-language')
const initialLanguage = storedLanguage === 'en' || storedLanguage === 'es' ? storedLanguage : 'es'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
