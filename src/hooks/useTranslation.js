import { getTranslation } from '../locales/translations'

export const useTranslation = (language = 'ru') => {
  const t = (key) => getTranslation(key, language)
  
  return { t }
}

