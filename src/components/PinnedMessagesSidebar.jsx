import React, { useState } from 'react'
import { Drawer, List, Avatar, Typography, Button, Space } from 'antd'
import { PushpinOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'
import './PinnedMessagesSidebar.css'

const { Text, Title } = Typography

const PinnedMessagesSidebar = ({ 
  visible, 
  onClose, 
  pinnedMessages = [], 
  users = [],
  currentUser,
  onScrollToMessage,
  onUnpinAll,
  targetLanguage = 'ru'
}) => {
  const { t } = useTranslation(targetLanguage)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleUnpinAll = () => {
    setShowConfirm(true)
  }

  const confirmUnpinAll = () => {
    onUnpinAll()
    setShowConfirm(false)
  }

  const cancelUnpinAll = () => {
    setShowConfirm(false)
  }

  const getUserAvatar = (userId) => {
    if (userId === currentUser?.id) {
      return currentUser.avatar || '👤'
    }
    
    const user = users.find(u => u.id === userId)
    return user?.avatar || '👤'
  }

  const getUserName = (userId) => {
    if (userId === currentUser?.id) {
      return currentUser.name || 'Вы'
    }
    
    const user = users.find(u => u.id === userId)
    return user?.name || 'Неизвестный'
  }


  return (
    <Drawer
      title={
        <Title level={4} style={{ margin: 0 }}>
          {pinnedMessages.length} {t('pinnedMessages')}
        </Title>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      className="pinned-messages-sidebar"
    >
      <div className="pinned-messages-content">
        {pinnedMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <PushpinOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Text type="secondary">{t('noPinnedMessages')}</Text>
          </div>
        ) : (
          <>
            <List
              dataSource={pinnedMessages}
              renderItem={(message) => (
                <List.Item
                  className="pinned-message-item"
                  onClick={() => onScrollToMessage(message.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        size="small" 
                        style={{ backgroundColor: message.senderId === currentUser?.id ? '#1890ff' : '#87d068' }}
                      >
                        {getUserAvatar(message.senderId)}
                      </Avatar>
                    }
                    title={
                      <Text strong style={{ color: message.senderId === currentUser?.id ? '#1890ff' : '#52c41a' }}>
                        {getUserName(message.senderId)}
                      </Text>
                    }
                    description={
                      <Text style={{ fontSize: '14px' }}>
                        {message.content}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
            
            {pinnedMessages.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f0f0f0', position: 'relative' }}>
                {showConfirm && (
                  <div style={{ 
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '16px', 
                    backgroundColor: '#fff', 
                    border: '1px solid #d9d9d9', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    minWidth: '280px',
                    maxWidth: '350px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <ExclamationCircleOutlined style={{ 
                        color: '#fa8c16', 
                        fontSize: '16px', 
                        marginRight: '8px' 
                      }} />
                      <Text strong style={{ fontSize: '14px' }}>
                        {t('unpinAllMessages')}?
                      </Text>
                    </div>
                    <Text style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>
                      {t('unpinAllMessagesConfirm')}
                    </Text>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <Button 
                        onClick={cancelUnpinAll}
                        style={{ 
                          backgroundColor: '#fff',
                          borderColor: '#d9d9d9',
                          color: '#000'
                        }}
                      >
                        {t('no')}
                      </Button>
                      <Button 
                        type="primary"
                        onClick={confirmUnpinAll}
                        style={{ backgroundColor: '#1890ff' }}
                      >
                        {t('yes')}
                      </Button>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    type="text"
                    size="small"
                    onClick={handleUnpinAll}
                    style={{ color: '#1890ff' }}
                  >
                    {t('unpinAllMessages')}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  )
}

export default PinnedMessagesSidebar
