import React from 'react'
import { Modal, List, Avatar, Typography, Tag, Space } from 'antd'
import { UserOutlined, TeamOutlined } from '@ant-design/icons'

const { Text } = Typography

const GroupParticipantsModal = ({ visible, chat, users, onClose }) => {
  if (!chat || chat.type !== 'group') return null

  const getParticipantInfo = (userId) => {
    const user = users.find(u => u.id === userId)
    return user || { id: userId, name: 'Неизвестный пользователь', avatar: '👤', online: false }
  }

  const participants = chat.participants.map(getParticipantInfo)
  const onlineCount = participants.filter(p => p.online).length

  return (
    <Modal
      title={
        <Space>
          <TeamOutlined style={{ color: '#52c41a' }} />
          <span>Участники группы "{chat.name}"</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary">
          Всего участников: {participants.length} • Онлайн: {onlineCount}
        </Text>
      </div>

      <List
        dataSource={participants}
        renderItem={(participant) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  size="large" 
                  style={{ backgroundColor: '#87d068' }}
                >
                  {participant.avatar}
                </Avatar>
              }
              title={
                <Space>
                  <Text strong>{participant.name}</Text>
                  {participant.online && (
                    <Tag color="green" size="small">Онлайн</Tag>
                  )}
                </Space>
              }
              description={
                participant.online ? (
                  <Text type="success" style={{ fontSize: '12px' }}>
                    В сети
                  </Text>
                ) : (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Не в сети
                  </Text>
                )
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default GroupParticipantsModal
