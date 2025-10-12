import React, { useState, useEffect } from 'react'
import { Modal, List, Avatar, Typography, Button, Space, Checkbox, Input, Empty } from 'antd'
import { UserOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'

const { Text } = Typography
const { Search } = Input

const AddParticipantsModal = ({ 
  visible, 
  chat, 
  users, 
  onClose, 
  onAddParticipants, 
  targetLanguage = 'ru' 
}) => {
  const { t } = useTranslation(targetLanguage)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  // Фильтруем пользователей, исключая уже добавленных в группу
  useEffect(() => {
    const availableUsers = users.filter(user => 
      !chat.participants.includes(user.id) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(availableUsers)
  }, [users, chat.participants, searchTerm])

  const handleUserSelect = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId])
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleAddParticipants = () => {
    if (selectedUsers.length > 0) {
      onAddParticipants(selectedUsers)
      setSelectedUsers([])
      setSearchTerm('')
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedUsers([])
    setSearchTerm('')
    onClose()
  }

  const isAllSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length

  return (
    <Modal
      title={
        <Space>
          <UserAddOutlined style={{ color: '#1890ff' }} />
          <span>{t('addParticipantsToGroup')} "{chat.name}"</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Space>
            <Button onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={handleAddParticipants}
              disabled={selectedUsers.length === 0}
            >
              {t('addSelected')} ({selectedUsers.length})
            </Button>
          </Space>
        </div>
      }
      width={500}
      className="add-participants-modal"
    >
      <div style={{ marginBottom: '16px' }}>
        <Search
          placeholder={t('searchUsers')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>

      {filteredUsers.length > 0 && (
        <div style={{ 
          marginBottom: '12px', 
          padding: '8px 0', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              <Text strong>{t('selectAll')}</Text>
            </Checkbox>
          </div>
          <Text type="secondary">
            {t('selectedUsers')}: {selectedUsers.length}
          </Text>
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <Empty
          description={
            searchTerm ? t('noUsersFound') : t('allUsersAlreadyInGroup')
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={filteredUsers}
          renderItem={(user) => (
            <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  size="large" 
                  style={{ backgroundColor: '#87d068' }}
                >
                  {user.avatar}
                </Avatar>
              }
              title={
                <Text strong>{user.name}</Text>
              }
            />
              <Checkbox
                checked={selectedUsers.includes(user.id)}
                onChange={(e) => handleUserSelect(user.id, e.target.checked)}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  )
}

export default AddParticipantsModal
