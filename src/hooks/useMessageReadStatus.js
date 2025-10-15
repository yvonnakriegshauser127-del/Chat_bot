import React, { useEffect, useRef, useCallback } from 'react'

/**
 * Хук для отслеживания видимости сообщений и автоматического пометки их как прочитанных
 * Сообщение помечается прочитанным, когда оно полностью видимо в viewport (100% видимость)
 * @param {string} messageId - ID сообщения
 * @param {boolean} isRead - текущий статус прочитанности
 * @param {function} onMarkAsRead - функция для пометки сообщения как прочитанного
 * @param {boolean} isOwnMessage - является ли сообщение собственным (отправленным пользователем)
 */
export const useMessageReadStatus = (messageId, isRead, onMarkAsRead, isOwnMessage = false) => {
  const messageRef = useRef(null)
  const observerRef = useRef(null)
  const manuallyChangedRef = useRef(false)

  // Функция для пометки сообщения как прочитанного
  const markAsRead = useCallback(() => {
    if (!isRead && !isOwnMessage && onMarkAsRead && typeof onMarkAsRead === 'function' && !manuallyChangedRef.current) {
      onMarkAsRead(messageId)
    }
  }, [messageId, isRead, isOwnMessage, onMarkAsRead])

  // Функция для установки флага ручного изменения статуса
  const setManuallyChanged = useCallback((changed) => {
    manuallyChangedRef.current = changed
  }, [])

  // Функция для создания и настройки Intersection Observer
  const setupObserver = useCallback(() => {
    try {
      // Создаем Intersection Observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Проверяем, видимо ли сообщение на 100%
            // entry.intersectionRatio >= 1.0 означает, что элемент полностью видим в viewport
            if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
              markAsRead()
              // Отключаем наблюдение после пометки как прочитанного
              if (observerRef.current) {
                observerRef.current.unobserve(entry.target)
              }
            }
          })
        },
        {
          // Используем порог 1.0 для определения полной видимости
          threshold: [0, 0.25, 0.5, 0.75, 1.0]
        }
      )

      // Начинаем наблюдение за элементом
      observerRef.current.observe(messageRef.current)
    } catch (error) {
      console.error('Ошибка при создании Intersection Observer:', error)
    }
  }, [markAsRead])

  useEffect(() => {
    // Не отслеживаем видимость для собственных сообщений или уже прочитанных
    if (isOwnMessage || isRead || !messageRef.current || !onMarkAsRead) {
      return
    }

    // Проверяем поддержку Intersection Observer
    if (!window.IntersectionObserver) {
      console.warn('Intersection Observer не поддерживается в этом браузере')
      return
    }

    setupObserver()

    // Дополнительная проверка для полной видимости сообщения
    // (на случай, если Intersection Observer еще не сработал)
    const checkFullVisibility = () => {
      if (!messageRef.current || isRead) return
      
      const rect = messageRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Проверяем, полностью ли видимо сообщение (100% в viewport)
      // Верхняя граница >= 0 и нижняя граница <= высота viewport
      const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight
      
      if (isFullyVisible) {
        markAsRead()
      }
    }

    // Проверяем полную видимость через небольшую задержку
    const timeoutId = setTimeout(checkFullVisibility, 500)

    // Очистка при размонтировании
    return () => {
      clearTimeout(timeoutId)
      if (observerRef.current && messageRef.current) {
        observerRef.current.unobserve(messageRef.current)
      }
    }
  }, [messageId, isRead, isOwnMessage, markAsRead, setupObserver])

  // Очистка observer при размонтировании компонента
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { messageRef, setManuallyChanged }
}
