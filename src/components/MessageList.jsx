import React, { useEffect, useRef } from 'react'
import { List, Empty } from 'antd'
import StructuredMessage from './StructuredMessage'
import './MessageList.css'

const MessageList = ({ messages, currentUser, users, targetLanguage = 'ru' }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
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
      <div className="messages-container">
        {messages.map(message => (
          <StructuredMessage
            key={message.id}
            message={message}
            currentUser={currentUser}
            targetLanguage={targetLanguage}
            users={users}
          />
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
