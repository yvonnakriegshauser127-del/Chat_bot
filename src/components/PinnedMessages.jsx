import React, { useState, useEffect } from 'react'
import { Card, Typography, Button, Space, Tooltip } from 'antd'
import { PushpinOutlined, CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'
import './PinnedMessages.css'

const { Text } = Typography

const PinnedMessages = ({ 
  pinnedMessages = [], 
  onUnpinMessage, 
  onScrollToMessage, 
  targetLanguage = 'ru' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useTranslation(targetLanguage)

  const totalPinned = pinnedMessages.length
  const currentMessage = totalPinned > 0 ? pinnedMessages[currentIndex] : null

  // Сбрасываем индекс, если он выходит за границы массива
  useEffect(() => {
    if (currentIndex >= totalPinned && totalPinned > 0) {
      setCurrentIndex(0)
    }
  }, [totalPinned, currentIndex])

  if (!pinnedMessages || pinnedMessages.length === 0) {
    return null
  }

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : totalPinned - 1
    setCurrentIndex(newIndex)
    
    // Автоматический скроллинг к предыдущему закрепленному сообщению
    if (onScrollToMessage && pinnedMessages[newIndex]) {
      onScrollToMessage(pinnedMessages[newIndex].id)
    }
  }

  const handleNext = () => {
    const newIndex = currentIndex < totalPinned - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    
    // Автоматический скроллинг к следующему закрепленному сообщению
    if (onScrollToMessage && pinnedMessages[newIndex]) {
      onScrollToMessage(pinnedMessages[newIndex].id)
    }
  }

  const handleUnpin = () => {
    if (onUnpinMessage && currentMessage) {
      onUnpinMessage(currentMessage.id)
    }
  }

  const handleClick = () => {
    if (onScrollToMessage && currentMessage) {
      onScrollToMessage(currentMessage.id)
    }
  }

  const getMessagePreview = (message) => {
    if (!message || !message.content) return ''
    return message.content.length > 50 
      ? message.content.substring(0, 50) + '...' 
      : message.content
  }

  // Если нет текущего сообщения, не рендерим компонент
  if (!currentMessage) {
    return null
  }

  return (
    <div className="pinned-messages-container">
      <Card 
        size="small" 
        className="pinned-message-card"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="pinned-message-content">
          <div className="pinned-message-header">
            <Space>
              <PushpinOutlined style={{ color: '#1890ff' }} />
              <Text strong>
                {totalPinned > 1 
                  ? `${t('pinnedMessage')} #${currentIndex + 1}` 
                  : t('pinnedMessage')
                }
              </Text>
            </Space>
            <Space>
              {totalPinned > 1 && (
                <>
                  <Tooltip title="Предыдущее закрепленное сообщение">
                    <Button
                      type="text"
                      size="small"
                      icon={<LeftOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePrevious()
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Следующее закрепленное сообщение">
                    <Button
                      type="text"
                      size="small"
                      icon={<RightOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNext()
                      }}
                    />
                  </Tooltip>
                </>
              )}
              <Tooltip title={t('unpinMessage')}>
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnpin()
                  }}
                />
              </Tooltip>
            </Space>
          </div>
          <div className="pinned-message-preview">
            <Text type="secondary">
              {getMessagePreview(currentMessage)}
            </Text>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PinnedMessages
