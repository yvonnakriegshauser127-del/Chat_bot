import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Upload, Avatar, message, Space, Select } from 'antd'
import { UserOutlined, SettingOutlined, UploadOutlined, TranslationOutlined, CameraOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'
import './AvatarStyles.css'

const ProfileSettingsModal = ({ 
  visible, 
  onClose, 
  currentUser, 
  onUpdateProfile, 
  targetLanguage = 'ru',
  onLanguageChange
}) => {
  const { t } = useTranslation(targetLanguage)
  const [form] = Form.useForm()
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '👤')
  const [loading, setLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(targetLanguage || 'ru')

  useEffect(() => {
    if (visible && currentUser) {
      form.setFieldsValue({
        name: currentUser.name,
        language: targetLanguage || 'ru'
      })
      setAvatarUrl(currentUser.avatar || '👤')
      setSelectedLanguage(targetLanguage || 'ru')
    }
  }, [visible, currentUser, form, targetLanguage])

  // Отдельный useEffect для отслеживания изменений targetLanguage
  useEffect(() => {
    console.log('ProfileSettingsModal: targetLanguage changed to:', targetLanguage)
    const newLanguage = targetLanguage || 'ru'
    console.log('ProfileSettingsModal: setting selectedLanguage to:', newLanguage)
    setSelectedLanguage(newLanguage)
  }, [targetLanguage])

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
      
      // Применяем изменения языка
      const newLanguage = values.language || selectedLanguage
      if (newLanguage !== targetLanguage) {
        onLanguageChange(newLanguage)
        // Не показываем уведомление при смене языка
      } else {
        // Показываем уведомление только если язык не изменился
        message.success(t('profileUpdated'))
      }
      
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleCancel = () => {
    // Сбрасываем все изменения при отмене
    setSelectedLanguage(targetLanguage)
    setAvatarUrl(currentUser?.avatar || '👤')
    form.resetFields()
    onClose()
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
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
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
        <div className="avatar-hover-container">
          <Upload {...uploadProps}>
            <div>
              <Avatar
                size={80}
                style={{ 
                  backgroundColor: '#1890ff',
                  fontSize: '32px',
                  marginBottom: '16px',
                  transition: 'all 0.3s ease'
                }}
              >
                {avatarUrl}
              </Avatar>
              <div className="camera-overlay">
                <CameraOutlined style={{ color: 'white', fontSize: '12px' }} />
              </div>
            </div>
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

        <Form.Item
          name="language"
          label={t('language')}
        >
          {console.log('ProfileSettingsModal: rendering Select with selectedLanguage:', selectedLanguage)}
          <Select
            onChange={(value) => {
              console.log('ProfileSettingsModal: language changed to:', value)
              setSelectedLanguage(value)
            }}
            style={{ width: '100%' }}
            suffixIcon={<TranslationOutlined />}
            placeholder="Выберите язык"
          >
            <Select.Option value="ru">Русский</Select.Option>
            <Select.Option value="uk">Українська</Select.Option>
            <Select.Option value="en">English</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProfileSettingsModal
