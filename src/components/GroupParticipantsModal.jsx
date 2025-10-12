import React, { useState } from 'react'
import { Modal, List, Avatar, Typography, Space, Button, Tooltip } from 'antd'
import { TeamOutlined, UserAddOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'
import AddParticipantsModal from './AddParticipantsModal'

const { Text } = Typography

const GroupParticipantsModal = ({ visible, chat, users, onClose, targetLanguage = 'ru', onAddParticipants, onRemoveParticipant, currentUser }) => {
  const { t } = useTranslation(targetLanguage)
  const [showAddParticipants, setShowAddParticipants] = useState(false)
  
  if (!chat || chat.type !== 'group') return null

  const getParticipantInfo = (userId) => {
    // Для текущего пользователя используем данные из currentUser
    if (userId === currentUser.id) {
      return {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || '👤'
      }
    }
    
    // Для других пользователей ищем в массиве users
    const user = users.find(u => u.id === userId)
    return user || { id: userId, name: t('unknownUser'), avatar: '👤' }
  }

  const participants = chat.participants.map(getParticipantInfo)


  const handleAddParticipants = () => {
    setShowAddParticipants(true)
  }

  const handleRemoveParticipantClick = (participant) => {
    if (onRemoveParticipant) {
      onRemoveParticipant(chat.id, participant.id)
    }
  }

  return (
    <Modal
      title={
        <Space>
          <TeamOutlined style={{ color: '#52c41a' }} />
          <span>{t('groupParticipants')} "{chat.name}"</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<UserAddOutlined />}
            onClick={handleAddParticipants}
          >
            {t('addParticipants')}
          </Button>
        </div>
      }
      width={600}
      className="group-participants-modal"
    >
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary">
          {t('totalParticipants')}: {participants.length}
        </Text>
      </div>

      <List
        dataSource={participants}
        renderItem={(participant) => (
          <List.Item
            actions={[
              // Показываем кнопку удаления только для других участников, не для текущего пользователя
              currentUser && participant.id !== currentUser.id && (
                <Tooltip title={t('removeParticipant')}>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    danger
                    onClick={() => handleRemoveParticipantClick(participant)}
                  />
                </Tooltip>
              )
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  size="large" 
                  style={{ 
                    backgroundColor: '#87d068'
                  }}
                >
                  {participant.avatar}
                </Avatar>
              }
              title={
                <Text strong>{participant.name}</Text>
              }
            />
          </List.Item>
        )}
      />

      <AddParticipantsModal
        visible={showAddParticipants}
        chat={chat}
        users={users}
        onClose={() => setShowAddParticipants(false)}
        onAddParticipants={onAddParticipants}
        targetLanguage={targetLanguage}
      />
    </Modal>
  )
}

export default GroupParticipantsModal

