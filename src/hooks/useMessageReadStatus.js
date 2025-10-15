import React, { useEffect, useRef, useCallback } from 'react'

/**
 * Хук для отслеживания видимости сообщений и автоматического пометки их как прочитанных
 * @param {string} messageId - ID сообщения
 * @param {boolean} isRead - текущий статус прочитанности
 * @param {function} onMarkAsRead - функция для пометки сообщения как прочитанного
 * @param {boolean} isOwnMessage - является ли сообщение собственным (отправленным пользователем)
 * @param {boolean} hasScrolledToUnread - был ли выполнен скролл к непрочитанному сообщению
 */
export const useMessageReadStatus = (messageId, isRead, onMarkAsRead, isOwnMessage = false, hasScrolledToUnread = false) => {
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
            // Если сообщение видимо на 50% или более, считаем его прочитанным
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              markAsRead()
              // Отключаем наблюдение после пометки как прочитанного
              if (observerRef.current) {
                observerRef.current.unobserve(entry.target)
              }
            }
          })
        },
        {
          // Порог видимости - сообщение должно быть видимо на 50%
          threshold: 0.5,
          // Небольшой отступ от краев viewport для более точного определения
          rootMargin: '0px 0px -10% 0px'
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

    // Если был выполнен скролл к непрочитанному сообщению, добавляем задержку
    if (hasScrolledToUnread) {
      // Добавляем задержку 2 секунды после скролла, чтобы пользователь успел увидеть сообщение
      const timeoutId = setTimeout(() => {
        // Проверяем поддержку Intersection Observer
        if (!window.IntersectionObserver) {
          console.warn('Intersection Observer не поддерживается в этом браузере')
          return
        }
        setupObserver()
      }, 2000)
      
      return () => clearTimeout(timeoutId)
    }

    // Проверяем поддержку Intersection Observer
    if (!window.IntersectionObserver) {
      console.warn('Intersection Observer не поддерживается в этом браузере')
      return
    }

    setupObserver()

    // Очистка при размонтировании
    return () => {
      if (observerRef.current && messageRef.current) {
        observerRef.current.unobserve(messageRef.current)
      }
    }
  }, [messageId, isRead, isOwnMessage, markAsRead, hasScrolledToUnread, setupObserver])

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
