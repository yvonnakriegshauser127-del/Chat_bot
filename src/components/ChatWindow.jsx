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
  TeamOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  UpOutlined,
  DownOutlined,
  PushpinOutlined
} from '@ant-design/icons'
import MessageList from './MessageList'
import PinnedMessages from './PinnedMessages'
import PinnedMessagesSidebar from './PinnedMessagesSidebar'
import './ChatWindow.css'

const { Content } = Layout
const { Text } = Typography

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
  targetLanguage,
  onForwardMessage,
  onScrollToMessage,
  onMarkAsUnread,
  onMarkAsRead,
  onUpdateProfile,
  activeSearchTerm,
  searchResults,
  currentSearchIndex,
  onNextSearchResult,
  onPreviousSearchResult,
  onTogglePinMessage,
  hasAnyModalOpen,
  invitationMessages = [],
  rejectionMessages = [],
  selectedInvitationId,
  selectedRejectionId,
  selectedPrompt
}) => {
  const [messageInput, setMessageInput] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showPinnedSidebar, setShowPinnedSidebar] = useState(false)
  const messageInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const { t } = useTranslation(targetLanguage)

  useEffect(() => {
    if (!isMinimized && !hasAnyModalOpen && messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }, [isMinimized, chat, hasAnyModalOpen])

  // Создаем ref для функции вставки шаблона
  const insertTemplateRef = useRef(null)

  // Создаем функцию для вставки шаблона
  const insertTemplate = (templateContent) => {
    setMessageInput(templateContent)
    setTimeout(() => {
      if (messageInputRef.current && !hasAnyModalOpen) {
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
    if (messageInput?.trim() || selectedFiles.length > 0) {
      onSendMessage(messageInput, replyingTo, selectedFiles)
      setMessageInput('')
      setReplyingTo(null)
      setSelectedFiles([])
    }
  }

  const handleKeyPress = (e) => {
    if (hasAnyModalOpen) return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
  }

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(prev => [...prev, ...files])
    // Очищаем input для возможности выбора того же файла снова
    e.target.value = ''
  }

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUnpinAllMessages = () => {
    if (!chat) return
    
    const pinnedMessages = chat.messages.filter(msg => msg.isPinned)
    pinnedMessages.forEach(message => {
      onTogglePinMessage(chat.id, message.id)
    })
  }

  const getChatStatus = () => {
    if (!chat) return ''
    
    if (chat.type === 'private') {
      return ''
    } else {
      return `${chat.participants.length} ${t('participantsCount')}`
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
              {t('selectChatToStart')}
            </Typography.Title>
            <Text type="secondary">{t('selectChatFromList')}</Text>
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
                  cursor: chat.type === 'group' ? 'pointer' : 'default',
                  transition: 'color 0.2s ease'
                }}
                onClick={chat.type === 'group' ? onShowParticipants : undefined}
                onMouseEnter={(e) => {
                  if (chat.type === 'group') {
                    e.target.style.color = '#1890ff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (chat.type === 'group') {
                    e.target.style.color = ''
                  }
                }}
              >
                {chat.name}
              </Typography.Title>
              {getChatStatus() && (
                <Text 
                  type="secondary"
                  style={{ fontSize: '12px' }}
                >
                  {getChatStatus()}
                </Text>
              )}
            </div>
          </div>
          <Space>
            {/* Кнопка закрепленных сообщений */}
            {chat.messages.filter(msg => msg.isPinned).length > 0 && (
              <Button 
                type="text"
                icon={<PushpinOutlined />}
                onClick={() => setShowPinnedSidebar(true)}
                style={{ color: '#1890ff' }}
              >
                {chat.messages.filter(msg => msg.isPinned).length} {t('pinnedMessages')}
              </Button>
            )}
            {/* Кнопки навигации по поиску */}
            {activeSearchTerm && searchResults.length > 1 && (
              <>
                <Tooltip title={t('previousResult')}>
                  <Button 
                    type="text"
                    icon={<UpOutlined />}
                    onClick={onPreviousSearchResult}
                    disabled={currentSearchIndex === 0}
                    size="small"
                  />
                </Tooltip>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {currentSearchIndex + 1} / {searchResults.length}
                </Text>
                <Tooltip title={t('nextResult')}>
                  <Button 
                    type="text"
                    icon={<DownOutlined />}
                    onClick={onNextSearchResult}
                    disabled={currentSearchIndex === searchResults.length - 1}
                    size="small"
                  />
                </Tooltip>
              </>
            )}
            <Tooltip title={t('minimize')}>
              <Button 
                type="text"
                icon={<MinusOutlined />}
              onClick={onMinimize}
              />
            </Tooltip>
          </Space>
        </div>

        {/* Закрепленные сообщения */}
        <PinnedMessages
          pinnedMessages={chat.messages.filter(msg => msg.isPinned)}
          onUnpinMessage={(messageId) => onTogglePinMessage(chat.id, messageId)}
          onScrollToMessage={onScrollToMessage}
          targetLanguage={targetLanguage}
        />

        <MessageList 
          chatId={chat.id}
          messages={chat.messages} 
          currentUser={currentUser}
          users={users}
          targetLanguage={targetLanguage}
          onReplyToMessage={setReplyingTo}
          onForwardMessage={onForwardMessage}
          onScrollToMessage={onScrollToMessage}
          onMarkAsUnread={onMarkAsUnread}
          onMarkAsRead={onMarkAsRead}
          activeSearchTerm={activeSearchTerm}
          onTogglePinMessage={(messageId) => onTogglePinMessage(chat.id, messageId)}
          onSendMessage={onSendMessage}
          invitationMessages={invitationMessages}
          rejectionMessages={rejectionMessages}
          selectedInvitationId={selectedInvitationId}
          selectedRejectionId={selectedRejectionId}
          selectedPrompt={selectedPrompt}
        />
            
            <div className="chat-input-container">
          {/* Скрытый input для выбора файлов */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="*/*"
          />
          
          {/* Отображение выбранных файлов */}
          {selectedFiles.length > 0 && (
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f5f5f5', 
              borderBottom: '1px solid #d9d9d9',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px'
            }}>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    backgroundColor: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <span>{file.name}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => handleRemoveFile(index)}
                    style={{ padding: '0', minWidth: '16px', height: '16px' }}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Отображение ответа на сообщение */}
          {replyingTo && (
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#f8f8f8', 
              border: '1px solid #e8e8e8',
              borderBottom: 'none',
              borderRadius: '6px 6px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderLeft: '3px solid #ff4d4f'
            }}>
              <ArrowLeftOutlined style={{ color: '#ff4d4f' }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  borderLeft: '2px solid #ff4d4f',
                  paddingLeft: '8px'
                }}>
                  <Text style={{ fontSize: '12px', color: '#ff4d4f', fontWeight: 'bold' }}>
                    {replyingTo.senderName}
                  </Text>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginTop: '2px',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {replyingTo.content}
                  </div>
                </div>
              </div>
              <Button 
                type="text" 
                size="small" 
                icon={<CloseOutlined />}
                onClick={handleCancelReply}
                style={{ color: '#999' }}
              />
            </div>
          )}
          <Space.Compact style={{ width: '100%' }}>
            <Input
                  ref={messageInputRef}
                  placeholder={t('enterMessage')}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
              prefix={
                <Space>
                  <Tooltip title={t('messageTemplatesTooltip')}>
                    <Button 
                      type="text" 
                      size="small"
                      icon={<FileTextOutlined />}
                      onClick={onShowTemplates}
                    />
                  </Tooltip>
                  <Tooltip title={t('attachFile')}>
                    <Button 
                      type="text" 
                      size="small"
                      icon={<PaperClipOutlined />}
                      onClick={handleFileSelect}
                    />
                  </Tooltip>
                </Space>
              }
              suffix={
                <Button 
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!messageInput?.trim() && selectedFiles.length === 0}
                />
              }
            />
          </Space.Compact>
            </div>

        {/* Боковая панель закрепленных сообщений */}
        <PinnedMessagesSidebar
          visible={showPinnedSidebar}
          onClose={() => setShowPinnedSidebar(false)}
          pinnedMessages={chat.messages.filter(msg => msg.isPinned)}
          users={users}
          currentUser={currentUser}
          onScrollToMessage={onScrollToMessage}
          onUnpinAll={handleUnpinAllMessages}
          targetLanguage={targetLanguage}
        />
      </div>
    </Content>
  )
}

export default ChatWindow
