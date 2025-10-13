import React, { useState } from 'react'
import { Modal, Form, Input, Select, Tag, Space, Avatar, Button, Upload } from 'antd'
import { UploadOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'


const NewChatModal = ({ 
  visible, 
  users, 
  onClose, 
  onCreateChat, 
  currentGroupParticipants = [],
  onAddParticipant,
  onRemoveParticipant,
  targetLanguage = 'ru'
}) => {
  const [form] = Form.useForm()
  const { t } = useTranslation(targetLanguage)
  const [groupAvatar, setGroupAvatar] = useState(null)

  const handleCreateChat = async () => {
    try {
      const values = await form.validateFields()
      
      if (currentGroupParticipants.length === 0) {
        Modal.error({
          title: 'Ошибка',
          content: 'Добавьте хотя бы одного участника в группу'
        })
        return
      }

      const chatData = {
        name: values.chatName,
        type: 'group',
        participants: currentGroupParticipants,
        avatar: groupAvatar
      }

      onCreateChat(chatData)
      form.resetFields()
      setGroupAvatar(null)
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }


  const getParticipantName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Неизвестный пользователь'
  }

  const getParticipantAvatar = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.avatar : '👤'
  }

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      // В реальном приложении здесь был бы URL загруженного файла
      // Для демонстрации используем base64
      const reader = new FileReader()
      reader.onload = (e) => {
        setGroupAvatar(e.target.result)
      }
      reader.readAsDataURL(info.file.originFileObj)
    }
  }

  const uploadProps = {
    name: 'avatar',
    listType: 'picture-card',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        Modal.error({
          title: 'Ошибка',
          content: 'Можно загружать только изображения!'
        })
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        Modal.error({
          title: 'Ошибка',
          content: 'Размер файла не должен превышать 2MB!'
        })
        return false
      }
      return true
    },
    onChange: handleAvatarUpload
  }

  return (
    <Modal
      title={t('createNewGroup')}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('cancel')}
        </Button>,
        <Button key="create" type="primary" onClick={handleCreateChat}>
          {t('create')}
        </Button>
      ]}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          label={t('groupName')}
          name="chatName"
          rules={[{ required: true, message: t('enterGroupName') }]}
        >
          <Input placeholder={t('enterGroupName')} />
        </Form.Item>

        <Form.Item label={t('groupAvatar')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Avatar 
              size={64} 
              style={{ backgroundColor: '#52c41a' }}
              src={groupAvatar}
              icon={!groupAvatar && <UserOutlined />}
            />
            <Upload {...uploadProps}>
              <Button 
                icon={<PlusOutlined />}
                size="small"
              >
                {groupAvatar ? t('changeAvatar') : t('addAvatar')}
              </Button>
            </Upload>
          </div>
        </Form.Item>
        
        <Form.Item label={t('participants')}>
          <Select
            mode="multiple"
            placeholder={t('selectUsers')}
            value={currentGroupParticipants}
            onChange={(selectedUserIds) => {
              // Обновляем участников в родительском компоненте
              currentGroupParticipants.forEach(id => {
                if (!selectedUserIds.includes(id)) {
                  onRemoveParticipant(id)
                }
              })
              selectedUserIds.forEach(id => {
                if (!currentGroupParticipants.includes(id)) {
                  onAddParticipant(id)
                }
              })
            }}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            tagRender={(props) => {
              const { label, closable, onClose } = props
              const userId = currentGroupParticipants.find(id => getParticipantName(id) === label)
              return (
                <Tag
                  closable={closable}
                  onClose={onClose}
                  style={{ 
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>
                    {getParticipantAvatar(userId)}
                  </span>
                  <span>{label}</span>
                </Tag>
              )
            }}
          >
            {users.map(user => (
              <Select.Option 
                key={user.id} 
                value={user.id}
                style={{
                  backgroundColor: currentGroupParticipants.includes(user.id) ? '#e6f7ff' : 'transparent'
                }}
              >
                <Space>
                  <Avatar size="small" style={{ backgroundColor: '#87d068' }}>
                    {user.avatar}
                  </Avatar>
                  {user.name}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default NewChatModal
