import { getTranslation } from '../locales/translations'
import { localStorageUtils } from '../utils/localStorage'

export const useTranslation = (language = null) => {
  // Если язык не передан, используем сохраненный в localStorage
  const currentLanguage = language || localStorageUtils.getLanguage()
  const t = (key) => getTranslation(key, currentLanguage)
  
  return { t, currentLanguage }
}

