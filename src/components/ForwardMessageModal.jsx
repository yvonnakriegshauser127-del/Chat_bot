import React, { useState } from 'react'
import { Modal, List, Avatar, Typography, Input, Empty, Button } from 'antd'
import { SearchOutlined, TeamOutlined } from '@ant-design/icons'

const { Text } = Typography

const ForwardMessageModal = ({ 
  visible, 
  onClose, 
  onForward, 
  chats, 
  currentChatId, 
  forwardedMessage,
  users 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChatId, setSelectedChatId] = useState(null)

  // Фильтрация чатов
  const filteredChats = chats.filter(chat => {
    if (chat.id === currentChatId) return false // Исключаем текущий чат
    if (chat.isArchived) return false // Исключаем архивированные чаты
    
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return chat.name.toLowerCase().includes(searchLower)
  })

  const handleForward = () => {
    if (selectedChatId && forwardedMessage) {
      onForward(selectedChatId, forwardedMessage)
      setSelectedChatId(null)
      setSearchTerm('')
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedChatId(null)
    setSearchTerm('')
    onClose()
  }

  const getChatAvatar = (chat) => {
    if (chat.type === 'private') {
      const participantId = chat.participants.find(id => id !== 1) // Исключаем текущего пользователя
      const user = users.find(u => u.id === participantId)
      return <Avatar style={{ backgroundColor: '#87d068' }}>{user?.avatar || '👤'}</Avatar>
    } else {
      return (
        <Avatar 
          src={chat.avatar}
          icon={!chat.avatar && <TeamOutlined />} 
          style={{ backgroundColor: '#52c41a' }} 
        />
      )
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) {
      return 'сейчас'
    } else if (minutes < 60) {
      return `${minutes}м`
    } else if (hours < 24) {
      return `${hours}ч`
    } else if (days < 7) {
      return `${days}д`
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <Modal
      title="Переслать сообщение"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button 
          key="forward" 
          type="primary" 
          onClick={handleForward}
          disabled={!selectedChatId}
        >
          Переслать
        </Button>
      ]}
      width={500}
    >
      {/* Предварительный просмотр пересылаемого сообщения */}
      {forwardedMessage && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #d9d9d9',
          maxHeight: '275px',
          overflow: 'hidden'
        }}>
          <Text strong style={{ fontSize: '12px', color: '#666' }}>
            Пересылаемое сообщение:
          </Text>
          <div style={{ 
            marginTop: '4px',
            padding: '8px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e8e8e8',
            maxHeight: '225px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            <Text style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
              <strong>{forwardedMessage.senderName}:</strong> {forwardedMessage.content}
            </Text>
          </div>
        </div>
      )}

      {/* Поиск чатов */}
      <Input
        placeholder="Поиск чатов..."
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '16px' }}
        allowClear
      />

      {/* Список чатов */}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredChats.length === 0 ? (
          <Empty 
            description="Нет доступных чатов для пересылки"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={filteredChats}
            renderItem={(chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1]
              const lastMessageTime = lastMessage ? formatTime(lastMessage.timestamp) : ''
              const lastMessageText = lastMessage ? lastMessage.content : 'Нет сообщений'
              
              return (
                <List.Item
                  key={chat.id}
                  className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
                  style={{ 
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedChatId === chat.id ? '#e6f7ff' : 'transparent',
                    borderRadius: '8px',
                    margin: '4px 0'
                  }}
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  <List.Item.Meta
                    avatar={getChatAvatar(chat)}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                          {chat.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {lastMessageTime}
                        </Text>
                      </div>
                    }
                    description={
                      <Text 
                        type="secondary" 
                        style={{ 
                          fontSize: '12px',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {lastMessageText}
                      </Text>
                    }
                  />
                </List.Item>
              )
            }}
          />
        )}
      </div>
    </Modal>
  )
}

export default ForwardMessageModal
