import React, { useState, useEffect } from 'react'
import { Card, Typography, Tag, Space, Button, Spin, Avatar } from 'antd'
import { 
  LinkOutlined, 
  TranslationOutlined
} from '@ant-design/icons'
import { translationService } from '../services/translationService'
import './StructuredMessage.css'

const { Text, Paragraph } = Typography

const StructuredMessage = ({ message, targetLanguage = 'ru', currentUser, users }) => {
  const [translatedText, setTranslatedText] = useState('')
  const [socialLinks, setSocialLinks] = useState([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)

  useEffect(() => {
    if (message.senderId !== currentUser.id && message.content) {
      // Извлекаем ссылки на соцсети
      const links = translationService.extractSocialLinks(message.content)
      setSocialLinks(links)
    }
  }, [message.content, currentUser.id])

  const handleShowTranslation = async () => {
    if (!translatedText && !isTranslating) {
      setIsTranslating(true)
      try {
        const translation = await translationService.translate(message.content, targetLanguage)
        setTranslatedText(translation)
      } catch (error) {
        console.error('Translation error:', error)
        setTranslatedText(message.content)
      } finally {
        setIsTranslating(false)
      }
    }
    setShowTranslation(!showTranslation)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getUserAvatar = (userId) => {
    const user = users.find(u => u.id === userId)
    return user?.avatar || '👤'
  }

  const isOwnMessage = message.senderId === currentUser.id

  if (isOwnMessage) {
    // Для собственных сообщений показываем обычный формат
    return (
      <div className={`message ${isOwnMessage ? 'sent' : 'received'}`}>
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
            <div className="message-text">
              <Text>{message.content}</Text>
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
    <div className={`message ${isOwnMessage ? 'sent' : 'received'}`}>
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
            <Button 
              type="text" 
              size="small"
              icon={<TranslationOutlined />}
              onClick={handleShowTranslation}
              loading={isTranslating}
            >
              {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
            </Button>
          </div>

        <div className="message-content-container">
          {/* Оригинальное сообщение */}
          <div className="original-message">
            <div className="message-text">
              <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Paragraph>
            </div>
          </div>

          {/* Переведенное и структурированное сообщение */}
          {showTranslation && (
            <div className="translated-message">
              <div className="message-section-header">
                <Text strong>Перевод и структурированная информация</Text>
              </div>
              
              {isTranslating ? (
                <div className="translation-loading">
                  <Spin size="small" />
                  <Text type="secondary" style={{ marginLeft: '8px' }}>
                    Переводим сообщение...
                  </Text>
                </div>
              ) : (
                <div className="structured-content">
                  {/* Основной перевод */}
                  <div className="translation-section">
                    <Text strong>Перевод:</Text>
                    <Paragraph style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>
                      {translatedText}
                    </Paragraph>
                  </div>

                  {/* Ссылки на соцсети */}
                  {socialLinks.length > 0 && (
                    <div className="info-section">
                      <Text strong>
                        <LinkOutlined style={{ marginRight: '4px' }} />
                        Ссылки на соцсети:
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
