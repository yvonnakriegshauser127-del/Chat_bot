import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Modal, Form, Input, Button, Upload, Avatar, message, Space, Select, Tabs, Popconfirm, Tooltip, Divider } from 'antd'
import { UserOutlined, SettingOutlined, UploadOutlined, TranslationOutlined, CameraOutlined, EditOutlined, SaveOutlined, PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'
import './AvatarStyles.css'

const { TextArea } = Input

const DEFAULT_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
  { value: 'gpt-4.1', label: 'GPT-4.1' },
  { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' }
]

const ProfileSettingsModal = ({ 
  visible, 
  onClose, 
  currentUser, 
  onUpdateProfile, 
  targetLanguage = 'ru',
  onLanguageChange,
  // AI settings props
  models = DEFAULT_MODELS,
  initialSelectedModel,
  initialPrompts = [],
  initialSelectedPromptId,
  onSaveAiSettings,
  // Messages settings props
  initialInvitationMessages = [],
  initialRejectionMessages = [],
  initialSelectedInvitationId,
  initialSelectedRejectionId,
  onSaveMessagesSettings,
  activeTab = 'general',
  onTabChange
}) => {
  const { t } = useTranslation(targetLanguage)
  const [form] = Form.useForm()
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '👤')
  const [loading, setLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(targetLanguage || 'ru')
  
  // AI settings state
  const [selectedModel, setSelectedModel] = useState(initialSelectedModel || models[0]?.value)
  const [prompts, setPrompts] = useState(initialPrompts)
  const [selectedPromptId, setSelectedPromptId] = useState(initialSelectedPromptId || null)
  const [promptName, setPromptName] = useState('')
  const [promptText, setPromptText] = useState('')
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const blockDropdownRef = useRef(false)

  // Messages state (invitations and rejections)
  const [invitationMessages, setInvitationMessages] = useState(initialInvitationMessages)
  const [rejectionMessages, setRejectionMessages] = useState(initialRejectionMessages)
  const [selectedInvitationId, setSelectedInvitationId] = useState(initialSelectedInvitationId || null)
  const [selectedRejectionId, setSelectedRejectionId] = useState(initialSelectedRejectionId || null)
  const [invitationName, setInvitationName] = useState('')
  const [invitationText, setInvitationText] = useState('')
  const [rejectionName, setRejectionName] = useState('')
  const [rejectionText, setRejectionText] = useState('')
  const [showInvitationEditor, setShowInvitationEditor] = useState(false)
  const [showRejectionEditor, setShowRejectionEditor] = useState(false)
  const [isEditingInvitation, setIsEditingInvitation] = useState(false)
  const [isEditingRejection, setIsEditingRejection] = useState(false)
  const blockInvitationDropdownRef = useRef(false)
  const blockRejectionDropdownRef = useRef(false)

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
    const newLanguage = targetLanguage || 'ru'
    setSelectedLanguage(newLanguage)
  }, [targetLanguage])

  // AI settings useEffect
  useEffect(() => {
    if (visible) {
      setSelectedModel(initialSelectedModel || models[0]?.value)
      setPrompts(initialPrompts)
      setSelectedPromptId(initialSelectedPromptId || null)

      const found = initialPrompts.find(p => p.id === initialSelectedPromptId)
      setPromptName(found?.name || '')
      setPromptText(found?.text || '')
      setShowPromptEditor(false)
      setIsEditingPrompt(false)
    }
  }, [visible, initialSelectedModel, initialPrompts, initialSelectedPromptId, models])

  // Messages settings useEffect
  useEffect(() => {
    if (visible) {
      setInvitationMessages(initialInvitationMessages)
      setRejectionMessages(initialRejectionMessages)
      setSelectedInvitationId(initialSelectedInvitationId || null)
      setSelectedRejectionId(initialSelectedRejectionId || null)

      const foundInvitation = initialInvitationMessages.find(m => m.id === initialSelectedInvitationId)
      setInvitationName(foundInvitation?.name || '')
      setInvitationText(foundInvitation?.text || '')
      const foundRejection = initialRejectionMessages.find(m => m.id === initialSelectedRejectionId)
      setRejectionName(foundRejection?.name || '')
      setRejectionText(foundRejection?.text || '')
      setShowInvitationEditor(false)
      setShowRejectionEditor(false)
      setIsEditingInvitation(false)
      setIsEditingRejection(false)
    }
  }, [visible, initialInvitationMessages, initialRejectionMessages, initialSelectedInvitationId, initialSelectedRejectionId])

  // AI handlers
  const handleSelectPrompt = (id) => {
    setSelectedPromptId(id)
    const found = prompts.find(p => p.id === id)
    setPromptName(found?.name || '')
    setPromptText(found?.text || '')
  }

  const handleSavePrompt = () => {
    const trimmedName = (promptName || '').trim()
    const trimmedText = (promptText || '').trim()
    if (!trimmedName || !trimmedText) {
      message.error('Укажите название и текст промпта')
      return
    }
    if (isEditingPrompt && selectedPromptId) {
      const updated = prompts.map(p => p.id === selectedPromptId ? { ...p, name: trimmedName, text: trimmedText } : p)
      setPrompts(updated)
      setShowPromptEditor(false)
      message.success(t('promptUpdatedSuccessfully') || 'Промпт обновлён')
    } else {
      const newPrompt = {
        id: Date.now().toString(),
        name: trimmedName,
        text: trimmedText
      }
      const updated = [...prompts, newPrompt]
      setPrompts(updated)
      setShowPromptEditor(false)
      setPromptName('')
      setPromptText('')
      message.success(t('promptCreatedSuccessfully') || 'Промпт успешно создан')
    }
  }

  const handleDeletePrompt = useCallback((promptId) => {
    // Если удаляемый промпт был выбран, сбрасываем выбор
    if (selectedPromptId === promptId) {
      setSelectedPromptId(null)
      setPromptName('')
      setPromptText('')
      setShowPromptEditor(false)
    }
    
    setPrompts(prev => prev.filter(p => p.id !== promptId))
    message.success(t('promptDeletedSuccessfully') || 'Промпт удалён')
  }, [selectedPromptId, t])

  const modelOptions = models.map(m => ({ value: m.value, label: m.label }))

  // Messages handlers
  const handleSelectInvitation = (id) => {
    setSelectedInvitationId(id)
    const found = invitationMessages.find(m => m.id === id)
    setInvitationName(found?.name || '')
    setInvitationText(found?.text || '')
  }

  const handleSelectRejection = (id) => {
    setSelectedRejectionId(id)
    const found = rejectionMessages.find(m => m.id === id)
    setRejectionName(found?.name || '')
    setRejectionText(found?.text || '')
  }

  const handleSaveInvitation = () => {
    const trimmedName = (invitationName || '').trim()
    const trimmedText = (invitationText || '').trim()
    if (!trimmedName || !trimmedText) {
      message.error(t('messageTextRequired') || 'Укажите название и текст сообщения')
      return
    }
    if (isEditingInvitation && selectedInvitationId) {
      const updated = invitationMessages.map(m => m.id === selectedInvitationId ? { ...m, name: trimmedName, text: trimmedText } : m)
      setInvitationMessages(updated)
      setShowInvitationEditor(false)
      message.success(t('messageUpdatedSuccessfully') || 'Сообщение обновлено')
    } else {
      const newMessage = {
        id: Date.now().toString(),
        name: trimmedName,
        text: trimmedText
      }
      const updated = [...invitationMessages, newMessage]
      setInvitationMessages(updated)
      setShowInvitationEditor(false)
      setInvitationName('')
      setInvitationText('')
      message.success(t('messageCreatedSuccessfully') || 'Сообщение успешно создано')
    }
  }

  const handleSaveRejection = () => {
    const trimmedName = (rejectionName || '').trim()
    const trimmedText = (rejectionText || '').trim()
    if (!trimmedName || !trimmedText) {
      message.error(t('messageTextRequired') || 'Укажите название и текст сообщения')
      return
    }
    if (isEditingRejection && selectedRejectionId) {
      const updated = rejectionMessages.map(m => m.id === selectedRejectionId ? { ...m, name: trimmedName, text: trimmedText } : m)
      setRejectionMessages(updated)
      setShowRejectionEditor(false)
      message.success(t('messageUpdatedSuccessfully') || 'Сообщение обновлено')
    } else {
      const newMessage = {
        id: Date.now().toString(),
        name: trimmedName,
        text: trimmedText
      }
      const updated = [...rejectionMessages, newMessage]
      setRejectionMessages(updated)
      setShowRejectionEditor(false)
      setRejectionName('')
      setRejectionText('')
      message.success(t('messageCreatedSuccessfully') || 'Сообщение успешно создано')
    }
  }

  const handleDeleteInvitation = useCallback((messageId) => {
    if (selectedInvitationId === messageId) {
      setSelectedInvitationId(null)
      setInvitationName('')
      setInvitationText('')
      setShowInvitationEditor(false)
    }
    setInvitationMessages(prev => prev.filter(m => m.id !== messageId))
    message.success(t('messageDeletedSuccessfully') || 'Сообщение удалено')
  }, [selectedInvitationId, t])

  const handleDeleteRejection = useCallback((messageId) => {
    if (selectedRejectionId === messageId) {
      setSelectedRejectionId(null)
      setRejectionName('')
      setRejectionText('')
      setShowRejectionEditor(false)
    }
    setRejectionMessages(prev => prev.filter(m => m.id !== messageId))
    message.success(t('messageDeletedSuccessfully') || 'Сообщение удалено')
  }, [selectedRejectionId, t])

  const invitationMessageOptions = useMemo(() => {
    return invitationMessages.map(m => ({
      value: m.id,
      label: (
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
          onMouseDown={(e) => {
            const target = e.target
            if (target.closest('button') || target.closest('.ant-popover')) {
              blockInvitationDropdownRef.current = true
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          onClick={(e) => {
            const target = e.target
            if (target.closest('button') || target.closest('.ant-popover')) {
              e.preventDefault()
              e.stopPropagation()
              setTimeout(() => {
                blockInvitationDropdownRef.current = false
              }, 100)
            }
          }}
        >
          <span style={{ flex: 1 }}>{m.name}</span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                setSelectedInvitationId(m.id)
                setInvitationName(m.name)
                setInvitationText(m.text)
                setShowInvitationEditor(true)
                setIsEditingInvitation(true)
              }}
              title={t('editMessage') || 'Редактировать сообщение'}
            />
            <div
              onMouseDown={(e) => { 
                blockInvitationDropdownRef.current = true
                e.preventDefault(); 
                e.stopPropagation() 
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation()
              }}
            >
              <Popconfirm
                title={t('deleteMessage') || 'Удалить сообщение?'}
                description={t('confirmDeleteMessage') || 'Вы уверены, что хотите удалить это сообщение?'}
                onConfirm={(e) => {
                  e?.stopPropagation()
                  e?.preventDefault()
                  handleDeleteInvitation(m.id)
                  setTimeout(() => {
                    blockInvitationDropdownRef.current = false
                  }, 200)
                }}
                onCancel={(e) => {
                  e?.stopPropagation()
                  e?.preventDefault()
                  setTimeout(() => {
                    blockInvitationDropdownRef.current = false
                  }, 200)
                }}
                okText={t('yes') || 'Да'}
                cancelText={t('no') || 'Нет'}
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                getPopupContainer={() => document.body}
              >
                <Button 
                  type="text" 
                  size="small" 
                  icon={<DeleteOutlined />}
                  onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  title={t('deleteMessage') || 'Удалить сообщение'}
                  danger
                />
              </Popconfirm>
            </div>
          </div>
        </div>
      )
    }))
  }, [invitationMessages, t, handleDeleteInvitation])

  const rejectionMessageOptions = useMemo(() => {
    return rejectionMessages.map(m => ({
      value: m.id,
      label: (
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
          onMouseDown={(e) => {
            const target = e.target
            if (target.closest('button') || target.closest('.ant-popover')) {
              blockRejectionDropdownRef.current = true
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          onClick={(e) => {
            const target = e.target
            if (target.closest('button') || target.closest('.ant-popover')) {
              e.preventDefault()
              e.stopPropagation()
              setTimeout(() => {
                blockRejectionDropdownRef.current = false
              }, 100)
            }
          }}
        >
          <span style={{ flex: 1 }}>{m.name}</span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                setSelectedRejectionId(m.id)
                setRejectionName(m.name)
                setRejectionText(m.text)
                setShowRejectionEditor(true)
                setIsEditingRejection(true)
              }}
              title={t('editMessage') || 'Редактировать сообщение'}
            />
            <div
              onMouseDown={(e) => { 
                blockRejectionDropdownRef.current = true
                e.preventDefault(); 
                e.stopPropagation() 
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation()
              }}
            >
              <Popconfirm
                title={t('deleteMessage') || 'Удалить сообщение?'}
                description={t('confirmDeleteMessage') || 'Вы уверены, что хотите удалить это сообщение?'}
                onConfirm={(e) => {
                  e?.stopPropagation()
                  e?.preventDefault()
                  handleDeleteRejection(m.id)
                  setTimeout(() => {
                    blockRejectionDropdownRef.current = false
                  }, 200)
                }}
                onCancel={(e) => {
                  e?.stopPropagation()
                  e?.preventDefault()
                  setTimeout(() => {
                    blockRejectionDropdownRef.current = false
                  }, 200)
                }}
                okText={t('yes') || 'Да'}
                cancelText={t('no') || 'Нет'}
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                getPopupContainer={() => document.body}
              >
                <Button 
                  type="text" 
                  size="small" 
                  icon={<DeleteOutlined />}
                  onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  title={t('deleteMessage') || 'Удалить сообщение'}
                  danger
                />
              </Popconfirm>
            </div>
          </div>
        </div>
      )
    }))
  }, [rejectionMessages, t, handleDeleteRejection])

  const promptOptions = useMemo(() => {
    return prompts.map(p => ({
      value: p.id,
      label: (
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
          onMouseDown={(e) => {
            // Предотвращаем открытие дропдауна при клике на кнопки
            const target = e.target
            if (target.closest('button') || target.closest('.ant-popover')) {
              blockDropdownRef.current = true
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          onClick={(e) => {
            // Предотвращаем выбор опции при клике на кнопки
            const target = e.target
            if (target.closest('button') || target.closest('.ant-popover')) {
              e.preventDefault()
              e.stopPropagation()
              // Сбрасываем флаг после небольшой задержки
              setTimeout(() => {
                blockDropdownRef.current = false
              }, 100)
            }
          }}
        >
          <span style={{ flex: 1 }}>{p.name}</span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                setSelectedPromptId(p.id)
                setPromptName(p.name)
                setPromptText(p.text)
                setShowPromptEditor(true)
                setIsEditingPrompt(true)
              }}
              title={t('aiEditPrompt') || 'Редактировать промпт'}
            />
            <div
              onMouseDown={(e) => { 
                blockDropdownRef.current = true
                e.preventDefault(); 
                e.stopPropagation() 
              }}
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation() 
              }}
            >
              <Popconfirm
                title={t('deletePrompt') || 'Удалить промпт?'}
                description={t('confirmDeletePrompt') || 'Вы уверены, что хотите удалить этот промпт?'}
                onConfirm={(e) => {
                  e?.stopPropagation()
                  e?.preventDefault()
                  handleDeletePrompt(p.id)
                  setTimeout(() => {
                    blockDropdownRef.current = false
                  }, 200)
                }}
                onCancel={(e) => {
                  e?.stopPropagation()
                  e?.preventDefault()
                  // Сбрасываем флаг после закрытия Popconfirm с задержкой
                  setTimeout(() => {
                    blockDropdownRef.current = false
                  }, 200)
                }}
                okText={t('yes') || 'Да'}
                cancelText={t('no') || 'Нет'}
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                getPopupContainer={() => document.body}
              >
                <Button 
                  type="text" 
                  size="small" 
                  icon={<DeleteOutlined />}
                  onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  title={t('deletePrompt') || 'Удалить промпт'}
                  danger
                />
              </Popconfirm>
            </div>
          </div>
        </div>
      )
    }))
  }, [prompts, t, handleDeletePrompt])

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
      
      // Сохраняем AI настройки
      if (onSaveAiSettings) {
        onSaveAiSettings({
          selectedModel,
          prompts,
          selectedPromptId
        })
      }

      // Сохраняем настройки сообщений
      if (onSaveMessagesSettings) {
        onSaveMessagesSettings({
          invitations: invitationMessages,
          rejections: rejectionMessages,
          selectedInvitationId,
          selectedRejectionId
        })
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
      width={720}
      className="profile-settings-modal"
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          if (onTabChange) {
            onTabChange(key)
          }
        }}
        items={[
          {
            key: 'general',
            label: t('general') || 'Общие',
            children: (
              <>
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
                    <Select
                      onChange={(value) => {
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
              </>
            )
          },
          {
            key: 'ai',
            label: t('aiModalTitle') || 'AI',
            children: (
              <Form layout="vertical">
                <Form.Item label={t('aiModel') || 'Модель'}>
                  <Select
                    value={selectedModel}
                    onChange={setSelectedModel}
                    options={modelOptions}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 20, marginBottom: 20 }}>
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      setShowPromptEditor(true)
                      setIsEditingPrompt(false)
                      setPromptName('')
                      setPromptText('')
                    }}
                    title={t('aiCreatePrompt') || 'Создать промпт'}
                    style={{ height: '32px' }}
                  >
                    {t('aiCreatePrompt') || 'Создать промпт'}
                  </Button>
                </div>
                <Form.Item 
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {t('aiSavedPrompts') || 'Сохранённые промпты'}
                      <Tooltip title={t('promptTooltip') || 'Данный промпт будет использоваться для оценки соцсетей блогеров'}>
                        <InfoCircleOutlined style={{ color: '#8c8c8c', cursor: 'help' }} />
                      </Tooltip>
                    </span>
                  }
                  style={{ marginBottom: 20 }}
                >
                  <Select
                    placeholder={t('aiSelectPromptPlaceholder') || 'Выберите промпт'}
                    value={selectedPromptId || undefined}
                    onChange={handleSelectPrompt}
                    options={promptOptions}
                    onDropdownVisibleChange={(open) => {
                      // Если дропдаун пытается открыться, но был блокирован, закрываем его немедленно
                      if (open && blockDropdownRef.current) {
                        // Используем requestAnimationFrame для закрытия на следующем кадре
                        requestAnimationFrame(() => {
                          // Ищем активный Select с открытым дропдауном
                          const openDropdown = document.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
                          if (openDropdown) {
                            // Находим связанный Select элемент
                            const selectId = openDropdown.getAttribute('id')
                            if (selectId) {
                              const selectTrigger = document.querySelector(`[aria-owns="${selectId}"]`)
                              if (selectTrigger) {
                                // Кликаем на триггер для закрытия
                                selectTrigger.click()
                              }
                            } else {
                              // Альтернативный способ - клик по области вне дропдауна
                              const selector = document.querySelector('.ant-select-selection')
                              if (selector && selector.offsetParent !== null) {
                                selector.click()
                              }
                            }
                          }
                          // Сбрасываем флаг после попытки закрытия
                          setTimeout(() => {
                            blockDropdownRef.current = false
                          }, 50)
                        })
                      }
                    }}
                  />
                </Form.Item>

                {showPromptEditor && (
                  <Space direction="vertical" style={{ width: '100%' }} size={20}>
                    <Form.Item label={t('aiPromptNamePlaceholder') || 'Название промпта'} style={{ marginBottom: 0 }}>
                      <Input
                        placeholder={t('aiPromptNamePlaceholder') || 'Название промпта'}
                        value={promptName}
                        onChange={(e) => setPromptName(e.target.value)}
                        prefix={<EditOutlined />}
                      />
                    </Form.Item>
                    <Form.Item label={t('aiPromptTextPlaceholder') || 'Текст промпта'} style={{ marginBottom: 0 }}>
                      <div style={{ position: 'relative' }}>
                        <TextArea
                          placeholder={t('aiPromptTextPlaceholder') || 'Текст промпта'}
                          value={promptText}
                          onChange={(e) => setPromptText(e.target.value)}
                          rows={6}
                          style={{ paddingRight: '40px' }}
                        />
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={handleSavePrompt}
                          style={{
                            position: 'absolute',
                            right: 8,
                            bottom: 8,
                            zIndex: 1
                          }}
                          title={t('save') || 'Сохранить'}
                        />
                      </div>
                    </Form.Item>
                  </Space>
                )}
              </Form>
            )
          },
          {
            key: 'messages',
            label: t('messages') || 'Сообщения',
            children: (
              <Form layout="vertical">
                {/* Invitation Block */}
                <div style={{ marginBottom: 40 }}>
                  <div style={{ marginBottom: 20, fontSize: '14px', fontWeight: 400, color: 'rgba(0, 0, 0, 0.85)' }}>
                    {t('invitation') || 'Приглашение'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
                    <Button 
                      type="primary" 
                      size="small" 
                      icon={<PlusOutlined />} 
                      onClick={() => {
                        setShowInvitationEditor(true)
                        setIsEditingInvitation(false)
                        setInvitationName('')
                        setInvitationText('')
                      }}
                      title={t('createMessage') || 'Создать сообщение'}
                      style={{ height: '32px' }}
                    >
                      {t('createMessage') || 'Создать сообщение'}
                    </Button>
                  </div>
                  <Form.Item 
                    label={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {t('savedMessages') || 'Сохранённые сообщения'}
                        <Tooltip title={t('invitationTooltip') || 'Данное сообщение будет отправлено пользователю для приглашения в кампанию'}>
                          <InfoCircleOutlined style={{ color: '#8c8c8c', cursor: 'help' }} />
                        </Tooltip>
                      </span>
                    }
                    style={{ marginBottom: 20 }}
                  >
                    <Select
                      placeholder={t('selectMessagePlaceholder') || 'Выберите сообщение'}
                      value={selectedInvitationId || undefined}
                      onChange={handleSelectInvitation}
                      options={invitationMessageOptions}
                      onDropdownVisibleChange={(open) => {
                        if (open && blockInvitationDropdownRef.current) {
                          requestAnimationFrame(() => {
                            const openDropdown = document.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
                            if (openDropdown) {
                              const selectId = openDropdown.getAttribute('id')
                              if (selectId) {
                                const selectTrigger = document.querySelector(`[aria-owns="${selectId}"]`)
                                if (selectTrigger) {
                                  selectTrigger.click()
                                }
                              } else {
                                const selector = document.querySelector('.ant-select-selection')
                                if (selector && selector.offsetParent !== null) {
                                  selector.click()
                                }
                              }
                            }
                            setTimeout(() => {
                              blockInvitationDropdownRef.current = false
                            }, 50)
                          })
                        }
                      }}
                    />
                  </Form.Item>

                  {showInvitationEditor && (
                    <Space direction="vertical" style={{ width: '100%' }} size={20}>
                      <Form.Item label={t('messageNamePlaceholder') || 'Название сообщения'} style={{ marginBottom: 0 }}>
                        <Input
                          placeholder={t('messageNamePlaceholder') || 'Название сообщения'}
                          value={invitationName}
                          onChange={(e) => setInvitationName(e.target.value)}
                          prefix={<EditOutlined />}
                        />
                      </Form.Item>
                      <Form.Item label={t('messageTextPlaceholder') || 'Текст сообщения'} style={{ marginBottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                          <TextArea
                            placeholder={t('messageTextPlaceholder') || 'Текст сообщения'}
                            value={invitationText}
                            onChange={(e) => setInvitationText(e.target.value)}
                            rows={6}
                            style={{ paddingRight: '40px' }}
                          />
                          <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSaveInvitation}
                            style={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              zIndex: 1
                            }}
                          />
                        </div>
                      </Form.Item>
                    </Space>
                  )}
                </div>

                <Divider style={{ margin: '32px 0' }} />

                {/* Rejection Block */}
                <div>
                  <div style={{ marginBottom: 20, fontSize: '14px', fontWeight: 400, color: 'rgba(0, 0, 0, 0.85)' }}>
                    {t('rejection') || 'Отказ'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
                    <Button 
                      type="primary" 
                      size="small" 
                      icon={<PlusOutlined />} 
                      onClick={() => {
                        setShowRejectionEditor(true)
                        setIsEditingRejection(false)
                        setRejectionName('')
                        setRejectionText('')
                      }}
                      title={t('createMessage') || 'Создать сообщение'}
                      style={{ height: '32px' }}
                    >
                      {t('createMessage') || 'Создать сообщение'}
                    </Button>
                  </div>
                  <Form.Item 
                    label={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {t('savedMessages') || 'Сохранённые сообщения'}
                        <Tooltip title={t('rejectionTooltip') || 'Данное сообщение будет отправлено пользователю при отказе присоединиться к кампании'}>
                          <InfoCircleOutlined style={{ color: '#8c8c8c', cursor: 'help' }} />
                        </Tooltip>
                      </span>
                    }
                    style={{ marginBottom: 20 }}
                  >
                    <Select
                      placeholder={t('selectMessagePlaceholder') || 'Выберите сообщение'}
                      value={selectedRejectionId || undefined}
                      onChange={handleSelectRejection}
                      options={rejectionMessageOptions}
                      onDropdownVisibleChange={(open) => {
                        if (open && blockRejectionDropdownRef.current) {
                          requestAnimationFrame(() => {
                            const openDropdown = document.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
                            if (openDropdown) {
                              const selectId = openDropdown.getAttribute('id')
                              if (selectId) {
                                const selectTrigger = document.querySelector(`[aria-owns="${selectId}"]`)
                                if (selectTrigger) {
                                  selectTrigger.click()
                                }
                              } else {
                                const selector = document.querySelector('.ant-select-selection')
                                if (selector && selector.offsetParent !== null) {
                                  selector.click()
                                }
                              }
                            }
                            setTimeout(() => {
                              blockRejectionDropdownRef.current = false
                            }, 50)
                          })
                        }
                      }}
                    />
                  </Form.Item>

                  {showRejectionEditor && (
                    <Space direction="vertical" style={{ width: '100%' }} size={20}>
                      <Form.Item label={t('messageNamePlaceholder') || 'Название сообщения'} style={{ marginBottom: 0 }}>
                        <Input
                          placeholder={t('messageNamePlaceholder') || 'Название сообщения'}
                          value={rejectionName}
                          onChange={(e) => setRejectionName(e.target.value)}
                          prefix={<EditOutlined />}
                        />
                      </Form.Item>
                      <Form.Item label={t('messageTextPlaceholder') || 'Текст сообщения'} style={{ marginBottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                          <TextArea
                            placeholder={t('messageTextPlaceholder') || 'Текст сообщения'}
                            value={rejectionText}
                            onChange={(e) => setRejectionText(e.target.value)}
                            rows={6}
                            style={{ paddingRight: '40px' }}
                          />
                          <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSaveRejection}
                            style={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              zIndex: 1
                            }}
                          />
                        </div>
                      </Form.Item>
                    </Space>
                  )}
                </div>
              </Form>
            )
          }
        ]}
      />
    </Modal>
  )
}

export default ProfileSettingsModal
