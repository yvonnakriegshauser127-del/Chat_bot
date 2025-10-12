import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Upload, Avatar, message, Space } from 'antd'
import { UserOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'

const ProfileSettingsModal = ({ 
  visible, 
  onClose, 
  currentUser, 
  onUpdateProfile, 
  targetLanguage = 'ru' 
}) => {
  const { t } = useTranslation(targetLanguage)
  const [form] = Form.useForm()
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '👤')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible && currentUser) {
      form.setFieldsValue({
        name: currentUser.name
      })
      setAvatarUrl(currentUser.avatar || '👤')
    }
  }, [visible, currentUser, form])

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    
    if (info.file.status === 'done') {
      // В реальном приложении здесь был бы URL загруженного файла
      // Для демонстрации используем эмодзи
      const emojis = ['👤', '👨', '👩', '👨‍💻', '👩‍💼', '👨‍🔬', '👩‍🎓', '👨‍🚀', '👩‍⚕️', '👨‍🎨', '👩‍🎨']
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
      setAvatarUrl(randomEmoji)
      setLoading(false)
      message.success(t('avatarUploaded'))
    }
    
    if (info.file.status === 'error') {
      setLoading(false)
      message.error(t('avatarUploadError'))
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const updatedProfile = {
        ...currentUser,
        name: values.name,
        avatar: avatarUrl
      }
      onUpdateProfile(updatedProfile)
      message.success(t('profileUpdated'))
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const uploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error(t('onlyImagesAllowed'))
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error(t('imageTooLarge'))
        return false
      }
      return true
    },
    onChange: handleAvatarChange,
    customRequest: ({ file, onSuccess }) => {
      // Симуляция загрузки
      setTimeout(() => {
        onSuccess('ok')
      }, 1000)
    }
  }

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined style={{ color: '#1890ff' }} />
          <span>{t('profileSettings')}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('cancel')}
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          {t('save')}
        </Button>
      ]}
      width={500}
      className="profile-settings-modal"
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Avatar
          size={80}
          style={{ 
            backgroundColor: '#1890ff',
            fontSize: '32px',
            marginBottom: '16px'
          }}
        >
          {avatarUrl}
        </Avatar>
        <div>
          <Upload {...uploadProps}>
            <Button 
              icon={<UploadOutlined />} 
              loading={loading}
              size="small"
            >
              {t('changeAvatar')}
            </Button>
          </Upload>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: currentUser?.name || ''
        }}
      >
        <Form.Item
          name="name"
          label={t('userName')}
          rules={[
            { required: true, message: t('nameRequired') },
            { min: 2, message: t('nameTooShort') },
            { max: 50, message: t('nameTooLong') }
          ]}
        >
          <Input 
            placeholder={t('enterUserName')}
            prefix={<UserOutlined />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProfileSettingsModal
