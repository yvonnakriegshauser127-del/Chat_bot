// Утилиты для работы с localStorage

const LANGUAGE_KEY = 'chat_app_language'

export const localStorageUtils = {
  // Получить сохраненный язык
  getLanguage: () => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY)
      return savedLanguage || 'ru' // По умолчанию русский
    } catch (error) {
      console.warn('Не удалось загрузить язык из localStorage:', error)
      return 'ru'
    }
  },

  // Сохранить язык
  setLanguage: (language) => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language)
      return true
    } catch (error) {
      console.warn('Не удалось сохранить язык в localStorage:', error)
      return false
    }
  },

  // Удалить сохраненный язык
  removeLanguage: () => {
    try {
      localStorage.removeItem(LANGUAGE_KEY)
      return true
    } catch (error) {
      console.warn('Не удалось удалить язык из localStorage:', error)
      return false
    }
  }
}
