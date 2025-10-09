import React, { useState, useRef, useEffect } from 'react'
import { 
  Layout, 
  Button, 
  Input, 
  Avatar, 
  Typography, 
  Space,
  Tooltip,
  Card,
  Select
} from 'antd'
import { useTranslation } from '../hooks/useTranslation'
import { 
  MinusOutlined, 
  PlusOutlined, 
  FileTextOutlined, 
  PaperClipOutlined, 
  SendOutlined,
  MessageOutlined,
  TeamOutlined
} from '@ant-design/icons'
import MessageList from './MessageList'
import './ChatWindow.css'

const { Content } = Layout
const { Text } = Typography
const { Option } = Select

const ChatWindow = ({ 
  chat, 
  isMinimized, 
  onMinimize, 
  onSendMessage, 
  onShowTemplates,
  currentUser,
  users,
  onInsertTemplate,
  onShowParticipants,
  targetLanguage
}) => {
  const [messageInput, setMessageInput] = useState('')
  const messageInputRef = useRef(null)
  const { t } = useTranslation(targetLanguage)

  useEffect(() => {
    if (!isMinimized && messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }, [isMinimized, chat])

  // Создаем ref для функции вставки шаблона
  const insertTemplateRef = useRef(null)

  // Создаем функцию для вставки шаблона
  const insertTemplate = (templateContent) => {
    setMessageInput(templateContent)
    setTimeout(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus()
      }
    }, 0)
  }

  // Сохраняем функцию в ref
  insertTemplateRef.current = insertTemplate

  // Передаем функцию в родительский компонент
  useEffect(() => {
    if (onInsertTemplate) {
      onInsertTemplate(() => insertTemplateRef.current)
    }
  }, [onInsertTemplate])

  const handleSendMessage = () => {
    if (messageInput?.trim()) {
      onSendMessage(messageInput)
      setMessageInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getChatStatus = () => {
    if (!chat) return t('online')
    
    if (chat.type === 'private') {
      const participant = users.find(u => u.id !== currentUser.id && chat.participants.includes(u.id))
      return participant && participant.online ? t('online') : t('offline')
    } else {
      const onlineCount = chat.participants.filter(id => {
        const user = users.find(u => u.id === id)
        return user && user.online
      }).length
      return `${onlineCount} участников онлайн`
    }
  }

  const getChatAvatar = () => {
    if (!chat) return <Avatar icon={<MessageOutlined />} size={40} />
    if (chat.type === 'private') {
      // Находим пользователя для личного чата
      const participantId = chat.participants.find(id => id !== currentUser.id)
      const user = users.find(u => u.id === participantId)
      return <Avatar size={40} style={{ backgroundColor: '#87d068' }}>{user?.avatar || '👤'}</Avatar>
    } else {
      // Для групп показываем загруженную аватарку или иконку команды
      return (
        <Avatar 
          src={chat.avatar}
          icon={!chat.avatar && <TeamOutlined />} 
          size={40} 
          style={{ backgroundColor: '#52c41a' }} 
        />
      )
    }
  }

  // Свернутый чат - панель Messages
  if (isMinimized) {
    return (
      <Content className="main-content minimized-content">
        <div className="minimized-chat-panel">
          <Card 
            size="small"
            className="minimized-chat-card"
            bodyStyle={{ padding: '12px 16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <Text strong style={{ fontSize: '16px' }}>Messages</Text>
              <Button 
                type="primary" 
                size="small" 
                icon={<PlusOutlined />}
                onClick={onMinimize}
                style={{ marginLeft: 'auto' }}
              >
                Развернуть
              </Button>
            </div>
          </Card>
        </div>
      </Content>
    )
  }

  if (!chat) {
    return (
      <Content className="main-content">
        <div className="chat-container">
          <div className="welcome-screen">
            <MessageOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
            <Typography.Title level={2} style={{ color: '#8c8c8c' }}>
              Выберите чат для начала общения
            </Typography.Title>
            <Text type="secondary">Выберите чат из списка слева или создайте новый</Text>
          </div>
        </div>
      </Content>
    )
  }

  return (
    <Content className="main-content">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-info">
              {getChatAvatar()}
            <div className="chat-details">
              <Typography.Title 
                level={4} 
                style={{ 
                  margin: 0, 
                  cursor: chat.type === 'group' ? 'pointer' : 'default'
                }}
                onClick={chat.type === 'group' ? onShowParticipants : undefined}
              >
                {chat.name}
              </Typography.Title>
              <Text 
                type={getChatStatus() === t('online') ? 'success' : 'secondary'}
                style={{ fontSize: '12px' }}
              >
                {getChatStatus()}
              </Text>
            </div>
          </div>
          <Space>
            <Tooltip title={t('minimize')}>
              <Button 
                type="text"
                icon={<MinusOutlined />}
              onClick={onMinimize}
              />
            </Tooltip>
          </Space>
        </div>

        <MessageList 
          messages={chat.messages} 
          currentUser={currentUser}
          users={users}
          targetLanguage={targetLanguage}
        />
            
            <div className="chat-input-container">
          <Space.Compact style={{ width: '100%' }}>
            <Input
                  ref={messageInputRef}
                  placeholder="Введите сообщение..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
              prefix={
                <Space>
                  <Tooltip title="Шаблоны сообщений">
                    <Button 
                      type="text" 
                      size="small"
                      icon={<FileTextOutlined />}
                      onClick={onShowTemplates}
                    />
                  </Tooltip>
                  <Tooltip title="Прикрепить файл">
                    <Button 
                      type="text" 
                      size="small"
                      icon={<PaperClipOutlined />}
                    />
                  </Tooltip>
                </Space>
              }
              suffix={
                <Button 
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!messageInput?.trim()}
                />
              }
            />
          </Space.Compact>
            </div>
      </di