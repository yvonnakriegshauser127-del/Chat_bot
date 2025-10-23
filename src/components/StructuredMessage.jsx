import React, { useState, useEffect } from 'react'
import { Card, Typography, Tag, Space, Button, Spin, Avatar } from 'antd'
import { 
  LinkOutlined, 
  TranslationOutlined,
  MessageOutlined,
  SendOutlined,
  EyeInvisibleOutlined,
  PushpinOutlined
} from '@ant-design/icons'
import { translationService } from '../services/translationService'
import { useTranslation } from '../hooks/useTranslation'
import { useMessageReadStatus } from '../hooks/useMessageReadStatus'
import MessageText from './MessageText'
import './StructuredMessage.css'

const { Text, Paragraph } = Typography

const StructuredMessage = ({ id, message, targetLanguage = 'ru', currentUser, users, onReplyToMessage, onForwardMessage, onScrollToMessage, onMarkAsUnread, onMarkAsRead, activeSearchTerm = '', isFirstUnread = false, hasScrolledToUnread = false, onTogglePinMessage }) => {
  const [translatedText, setTranslatedText] = useState('')
  const [translatedLanguage, setTranslatedLanguage] = useState('')
  const [socialLinks, setSocialLinks] = useState([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const { t } = useTranslation(targetLanguage)

  // Определяем, является ли сообщение собственным
  const isOwnMessage = message.senderId === currentUser?.id

  // Хук для отслеживания видимости сообщения
  const { messageRef, setManuallyChanged } = useMessageReadStatus(
    message.id,
    message.read || false,
    onMarkAsRead,
    isOwnMessage,
    hasScrolledToUnread
  )

  // Инъекция CSS стилей для предотвращения разбивания слов
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .ant-typography, 
      .ant-typography p, 
      .ant-typography span,
      .message-text,
      .message-text * {
        word-break: normal !important;
        overflow-wrap: break-word !important;
        hyphens: none !important;
        -webkit-hyphens: none !important;
        -moz-hyphens: none !important;
        -ms-hyphens: none !important;
      }
      
      /* Для коротких сообщений предотвращаем переносы */
      .message-text:has(span[style*="white-space: nowrap"]) {
        white-space: nowrap !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    if (message.senderId !== currentUser.id && message.content) {
      // Извлекаем ссылки на соцсети
      const links = translationService.extractSocialLinks(message.content)
      setSocialLinks(links)
    }
  }, [message.content, currentUser.id])

  // Сбрасываем переведенный текст при изменении языка
  useEffect(() => {
    setTranslatedText('')
    setTranslatedLanguage('')
    setShowTranslation(false)
  }, [targetLanguage])

  const handleShowTranslation = async () => {
    // Если блок перевода скрыт, показываем его и переводим
    if (!showTranslation) {
      // Если перевода нет или он был сделан на другом языке, переводим заново
      if ((!translatedText || translatedLanguage !== targetLanguage) && !isTranslating) {
        setIsTranslating(true)
        try {
          const translation = await translationService.translate(message.content, targetLanguage)
          setTranslatedText(translation)
          setTranslatedLanguage(targetLanguage)
        } catch (error) {
          console.error('Translation error:', error)
          setTranslatedText(message.content)
          setTranslatedLanguage(targetLanguage)
        } finally {
          setIsTranslating(false)
        }
      }
      setShowTranslation(true)
    } else {
      // Если блок перевода показан, просто скрываем его
      setShowTranslation(false)
    }
  }

  const handleReplyToMessage = () => {
    if (onReplyToMessage) {
      onReplyToMessage(message)
    }
  }

  const handleForwardMessage = () => {
    if (onForwardMessage) {
      onForwardMessage(message)
    }
  }

  const handleMarkAsUnread = () => {
    if (onMarkAsUnread) {
      // Устанавливаем флаг ручного изменения статуса
      setManuallyChanged(true)
      onMarkAsUnread(message.id)
    }
  }

  const handleTogglePin = () => {
    if (onTogglePinMessage) {
      onTogglePinMessage(message.id)
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getUserAvatar = (userId) => {
    // Для собственных сообщений используем аватар из currentUser
    if (userId === currentUser.id) {
      return currentUser.avatar || '👤'
    }
    
    // Для других пользователей ищем в массиве users
    const user = users.find(u => u.id === userId)
    return user?.avatar || '👤'
  }

  const isSystemMessage = message.isSystemMessage

  // Специальная обработка системных сообщений
  if (isSystemMessage) {
    return (
      <div id={id} className="message system-message">
        <div style={{ 
          textAlign: 'center', 
          padding: '8px 16px',
          margin: '8px 0',
          backgroundColor: '#f6f8fa',
          border: '1px solid #e1e4e8',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#586069'
        }}>
          <Text type="secondary" style={{ fontStyle: 'italic' }}>
            {message.content}
          </Text>
        </div>
      </div>
    )
  }

  if (isOwnMessage) {
    // Для собственных сообщений показываем обычный формат с поддержкой ответов
    return (
      <div id={id} className={`message ${isOwnMessage ? 'sent' : 'received'}`}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', justifyContent: 'flex-end' }}>
          <div className="message-content">
            <div className="message-info">
              <Text strong style={{ fontSize: '12px' }}>
                {message.senderName}
              </Text>
              <Text type="secondary" style={{ fontSize: '11px', marginLeft: '8px' }}>
                {formatTime(message.timestamp)}
              </Text>
            </div>
            
            {/* Отображение ответа на сообщение для собственных сообщений */}
            {message.replyTo && (
              <div 
                style={{ 
                  padding: '6px 10px', 
                  backgroundColor: 'rgb(255,243,213)', 
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => onScrollToMessage && onScrollToMessage(message.replyTo.messageId)}
              >
                <div style={{
                  borderLeft: '2px solid #ff4d4f',
                  paddingLeft: '6px'
                }}>
                  <Text style={{ fontSize: '11px', color: '#ff4d4f', fontWeight: 'bold' }}>
                    {message.replyTo.senderName}
                  </Text>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#666', 
                    marginTop: '2px',
                    maxWidth: '100%',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    lineHeight: '1.3'
                  }}>
                    {message.replyTo.content}
                  </div>
                </div>
              </div>
            )}
            
            <div className="message-text">
              <MessageText searchTerm={activeSearchTerm}>{message.content}</MessageText>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <Button 
                type="text" 
                size="small"
                icon={<PushpinOutlined />}
                onClick={handleTogglePin}
                title={message.isPinned ? t('unpinMessage') : t('pinMessage')}
                style={{ 
                  color: message.isPinned ? '#1890ff' : undefined,
                  height: '14px',
                  width: '14px',
                  minWidth: '14px',
                  padding: '0'
                }}
              />
              <Button 
                type="text" 
                size="small"
                icon={<SendOutlined />}
                onClick={handleForwardMessage}
                title={t('forwardMessage')}
                style={{ 
                  minWidth: 'auto',
                  padding: '2px 4px',
                  fontSize: '11px',
                  height: 'auto',
                  lineHeight: '1.2'
                }}
              />
            </div>
          </div>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {getUserAvatar(message.senderId)}
          </Avatar>
        </div>
      </div>
    )
  }

  return (
    <div ref={messageRef} id={id} className={`message ${isOwnMessage ? 'sent' : 'received'} ${isFirstUnread ? 'first-unread' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <Avatar size="small" style={{ backgroundColor: '#87d068' }}>
          {getUserAvatar(message.senderId)}
        </Avatar>
        <Card className="structured-message-card" size="small" style={{ flex: 1 }}>
          <div className="message-header">
            <div className="sender-info">
              <Text strong style={{ fontSize: '14px' }}>
                {message.senderName}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                {formatTime(message.timestamp)}
              </Text>
            </div>
            <Space>
              <Button 
                type="text" 
                size="small"
                icon={<MessageOutlined />}
                onClick={handleReplyToMessage}
                title={t('replyToMessage')}
              />
              <Button 
                type="text" 
                size="small"
                icon={<SendOutlined />}
                onClick={handleForwardMessage}
                title={t('forwardMessage')}
              />
              <Button 
                type="text" 
                size="small"
                icon={<TranslationOutlined />}
                onClick={handleShowTranslation}
                loading={isTranslating}
                title={showTranslation ? t('hideTranslation') : t('showTranslation')}
              />
              <Button 
                type="text" 
                size="small"
                icon={<PushpinOutlined />}
                onClick={handleTogglePin}
                title={message.isPinned ? t('unpinMessage') : t('pinMessage')}
                style={{ 
                  color: message.isPinned ? '#1890ff' : undefined,
                  height: '14px',
                  width: '14px',
                  minWidth: '14px',
                  padding: '0'
                }}
              />
              {!isOwnMessage && (
                <Button 
                  type="text" 
                  size="small"
                  icon={<EyeInvisibleOutlined />}
                  onClick={handleMarkAsUnread}
                  title={t('markAsUnread')}
                />
              )}
            </Space>
          </div>

          {/* Отображение ответа на сообщение */}
          {message.replyTo && (
            <div 
              style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f8f8f8', 
                border: '1px solid #e8e8e8',
                borderRadius: '6px',
                marginBottom: '8px',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => onScrollToMessage && onScrollToMessage(message.replyTo.messageId)}
            >
              <div style={{
                borderLeft: '2px solid #ff4d4f',
                paddingLeft: '8px'
              }}>
                <Text style={{ fontSize: '12px', color: '#ff4d4f', fontWeight: 'bold' }}>
                  {message.replyTo.senderName}
                </Text>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginTop: '2px',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  lineHeight: '1.3'
                }}>
                  {message.replyTo.content}
                </div>
              </div>
            </div>
          )}

        <div className="message-content-container">
          {/* Оригинальное сообщение */}
          <div className="original-message">
            <div className="message-text">
              <MessageText searchTerm={activeSearchTerm}>{message.content}</MessageText>
            </div>
          </div>

          {/* Переведенное и структурированное сообщение */}
          {showTranslation && (
            <div className="translated-message">
              
              {isTranslating ? (
                <div className="translation-loading">
                  <Spin size="small" />
                  <Text type="secondary" style={{ marginLeft: '8px' }}>
                    {t('translatingMessage')}
                  </Text>
                </div>
              ) : (
                <div className="structured-content">
                  {/* Основной перевод */}
                  <div className="translation-section">
                    <Text strong>{t('translation')}</Text>
                    <Paragraph style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>
                      {translatedText}
                    </Paragraph>
                  </div>

                  {/* Ссылки на соцсети */}
                  {socialLinks.length > 0 && (
                    <div className="info-section">
                      <Text strong>
                        <LinkOutlined style={{ marginRight: '4px' }} />
                        {t('socialLinks')}:
                      </Text>
                      <div style={{ marginTop: '4px' }}>
                        {socialLinks.map((link, index) => (
                          <Tag key={index} color="blue" style={{ margin: '2px' }}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              {link.platform}
                            </a>
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      </div>
    </div>
  )
}

export default StructuredMessage
