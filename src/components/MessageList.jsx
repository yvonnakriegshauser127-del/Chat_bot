import React, { useEffect, useRef } from 'react'
import { List, Empty } from 'antd'
import StructuredMessage from './StructuredMessage'
import './MessageList.css'

const MessageList = ({ messages, currentUser, users, targetLanguage = 'ru', onReplyToMessage, onForwardMessage, onScrollToMessage, onMarkAsUnread, onMarkAsRead, activeSearchTerm = '' }) => {
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const hasScrolledToUnreadRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToFirstUnread = () => {
    // Небольшая задержка для обновления DOM
    setTimeout(() => {
      // Находим первое непрочитанное сообщение от других пользователей
      const firstUnreadMessage = messages.find(message => 
        !message.read && message.senderId !== currentUser?.id
      )
      
      if (firstUnreadMessage) {
        // Ищем элемент сообщения по ID
        const messageElement = document.getElementById(`message-${firstUnreadMessage.id}`)
        if (messageElement) {
          messageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' // Центрируем сообщение в viewport
          })
          hasScrolledToUnreadRef.current = true
          return
        }
      }
      
      // Если непрочитанных сообщений нет, скроллим к последнему
      scrollToBottom()
    }, 100)
  }

  useEffect(() => {
    // Сбрасываем флаг при изменении сообщений (новый чат)
    hasScrolledToUnreadRef.current = false
    scrollToFirstUnread()
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="chat-messages">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Начните общение в этом чате"
        />
      </div>
    )
  }

  return (
    <div className="chat-messages">
      <div ref={messagesContainerRef} className="messages-container">
        {messages.map((message, index) => {
          // Определяем, является ли это первым непрочитанным сообщением
          const isFirstUnread = !message.read && 
            message.senderId !== currentUser?.id && 
            !messages.slice(0, index).some(msg => !msg.read && msg.senderId !== currentUser?.id)
          
          return (
            <StructuredMessage
              key={message.id}
              id={`message-${message.id}`}
              message={message}
              currentUser={currentUser}
              targetLanguage={targetLanguage}
              users={users}
              onReplyToMessage={onReplyToMessage}
              onForwardMessage={onForwardMessage}
              onScrollToMessage={onScrollToMessage}
              onMarkAsUnread={onMarkAsUnread}
              onMarkAsRead={onMarkAsRead}
              activeSearchTerm={activeSearchTerm}
              isFirstUnread={isFirstUnread}
              hasScrolledToUnread={hasScrolledToUnreadRef.current}
            />
          )
        })}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
