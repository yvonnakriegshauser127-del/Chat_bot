import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal, Form, Select, Button, message, Input, Space, Popconfirm } from 'antd'
import { AmazonOutlined, InstagramOutlined, MailOutlined, TikTokOutlined, UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'

const { TextArea } = Input

const WriteMessageModal = ({ 
  visible, 
  onClose, 
  stores = [], 
  users = [], 
  targetLanguage = 'ru',
  onSendMessage,
  campaignParticipants = {}
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [selectedStores, setSelectedStores] = useState([])
  const [messageTemplates, setMessageTemplates] = useState(() => {
    try {
      const raw = localStorage.getItem('writeMessageTemplates')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [editingTemplateId, setEditingTemplateId] = useState(null)
  const [templateName, setTemplateName] = useState('')
  const [templateText, setTemplateText] = useState('')
  const { t } = useTranslation(targetLanguage)

  // Сохранение шаблонов в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('writeMessageTemplates', JSON.stringify(messageTemplates))
    } catch {}
  }, [messageTemplates])

  // Получаем список пользователей, участвовавших в кампаниях от выбранных магазинов
  const getAvailableUsers = () => {
    if (selectedStores.length === 0) {
      return []
    }

    // Собираем всех уникальных пользователей из кампаний выбранных магазинов
    const userIds = new Set()
    selectedStores.forEach(storeName => {
      const participants = campaignParticipants[storeName] || []
      participants.forEach(userId => userIds.add(userId))
    })

    // Фильтруем пользователей по ID
    return users.filter(user => userIds.has(user.id))
  }

  const availableUsers = getAvailableUsers()

  // Обработчики для шаблонов
  const handleCreateTemplate = () => {
    setShowTemplateEditor(true)
    setEditingTemplateId(null)
    setTemplateName('')
    setTemplateText('')
  }

  const handleEditTemplate = (template) => {
    setShowTemplateEditor(true)
    setEditingTemplateId(template.id)
    setTemplateName(template.name)
    setTemplateText(template.text)
  }

  const handleSaveTemplate = () => {
    const trimmedName = (templateName || '').trim()
    const trimmedText = (templateText || '').trim()
    if (!trimmedName || !trimmedText) {
      message.error(t('templateNameAndTextRequired') || 'Укажите название и текст шаблона')
      return
    }

    if (editingTemplateId) {
      // Редактирование существующего шаблона
      setMessageTemplates(prev => prev.map(t => 
        t.id === editingTemplateId 
          ? { ...t, name: trimmedName, text: trimmedText }
          : t
      ))
      message.success(t('templateUpdatedSuccessfully') || 'Шаблон обновлён')
    } else {
      // Создание нового шаблона
      const newTemplate = {
        id: Date.now().toString(),
        name: trimmedName,
        text: trimmedText
      }
      setMessageTemplates(prev => [...prev, newTemplate])
      message.success(t('templateCreatedSuccessfully') || 'Шаблон создан')
    }

    setShowTemplateEditor(false)
    setEditingTemplateId(null)
    setTemplateName('')
    setTemplateText('')
  }

  const handleDeleteTemplate = useCallback((templateId) => {
    setMessageTemplates(prev => prev.filter(t => t.id !== templateId))
    message.success(t('templateDeletedSuccessfully') || 'Шаблон удалён')
  }, [t])

  const handleSelectTemplate = (templateId) => {
    const template = messageTemplates.find(t => t.id === templateId)
    if (template) {
      form.setFieldsValue({ message: template.text })
    }
  }

  const handleCancelTemplateEditor = () => {
    setShowTemplateEditor(false)
    setEditingTemplateId(null)
    setTemplateName('')
    setTemplateText('')
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      
      // Получаем все значения формы
      const allValues = form.getFieldsValue()
      
      // Валидируем только поле message
      await form.validateFields(['message'])
      
      // Проверяем stores и bloggers вручную
      if (!allValues.stores || allValues.stores.length === 0) {
        message.error(t('noStoresSelected') || 'Выберите хотя бы один магазин')
        setLoading(false)
        return
      }
      
      if (!allValues.bloggers || allValues.bloggers.length === 0) {
        message.error(t('noBloggersSelected') || 'Выберите хотя бы одного получателя')
        setLoading(false)
        return
      }

      // Формируем данные для отправки: для каждой связки магазин-пользователь
      const storeUserPairs = []
      allValues.stores.forEach(storeName => {
        allValues.bloggers.forEach(bloggerId => {
          // Проверяем, что пользователь участвовал в кампании от этого магазина
          const participants = campaignParticipants[storeName] || []
          if (participants.includes(bloggerId)) {
            storeUserPairs.push({
              storeName,
              bloggerId
            })
          }
        })
      })

      if (storeUserPairs.length === 0) {
        message.error(t('noValidPairs') || 'Нет подходящих связок магазин-пользователь')
        setLoading(false)
        return
      }

      // Вызываем callback с данными для каждой связки магазин-пользователь
      onSendMessage({
        storeUserPairs,
        message: allValues.message || ''
      })
      
      form.resetFields()
      setSelectedStores([])
      onClose()
      message.success('Сообщение отправлено!')
    } catch (error) {
      console.error('Validation failed:', error)
      // Если ошибка валидации только для message, показываем сообщение
      if (error.errorFields && error.errorFields.length > 0) {
        const messageError = error.errorFields.find(f => f.name[0] === 'message')
        if (messageError) {
          message.error(messageError.errors[0])
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setSelectedStores([])
    setShowTemplateEditor(false)
    setEditingTemplateId(null)
    setTemplateName('')
    setTemplateText('')
    onClose()
  }

  // Сброс состояния при закрытии модального окна
  useEffect(() => {
    if (!visible) {
      setSelectedStores([])
      setShowTemplateEditor(false)
      setEditingTemplateId(null)
      setTemplateName('')
      setTemplateText('')
    }
  }, [visible])

  return (
    <Modal
      title={t('writeMessageModal')}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t('cancel')}
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          {t('sendMessage')}
        </Button>
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="stores"
          label={t('selectStores')}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectStoresPlaceholder')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            showSearch
            allowClear
            onChange={(value) => {
              setSelectedStores(value || [])
              // Обновляем значения формы
              form.setFieldsValue({ 
                stores: value || [],
                bloggers: [] 
              })
            }}
            filterOption={(input, option) => {
              const searchText = input.toLowerCase()
              const optionText = (option?.label ?? option?.children ?? '').toString().toLowerCase()
              return optionText.includes(searchText)
            }}
            tagRender={({ label, value, closable, onClose }) => (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                background: '#f0f0f0',
                border: '1px solid #d9d9d9',
                borderRadius: '12px',
                padding: '2px 8px',
                margin: '2px',
                fontSize: '12px',
                height: '28px',
                transition: 'all 0.2s ease'
              }}>
                <span>🏪</span>
                <span>{label}</span>
                {closable && (
                  <span 
                    onClick={onClose}
                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                  >
                    ×
                  </span>
                )}
              </div>
            )}
          >
            {stores.map(store => (
              <Select.Option key={`store-${store.id}`} value={store.name}>
                {store.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="bloggers"
          label={t('selectBloggers')}
        >
          <Select 
            mode="multiple" 
            placeholder={
              selectedStores.length === 0 
                ? (t('selectStoresFirst') || 'Сначала выберите магазины')
                : (t('selectBloggersPlaceholder') || 'Выберите участников кампаний')
            }
            style={{ width: '100%' }}
            maxTagCount="responsive"
            showSearch
            allowClear
            disabled={selectedStores.length === 0}
            filterOption={(input, option) => {
              const searchText = input.toLowerCase()
              // Ищем по имени пользователя
              const user = availableUsers.find(u => u.id === option.value)
              const userName = user ? user.name.toLowerCase() : ''
              return userName.includes(searchText)
            }}
            tagRender={({ label, value, closable, onClose }) => (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: '12px',
                padding: '2px 8px',
                margin: '2px',
                fontSize: '12px',
                height: '28px',
                transition: 'all 0.2s ease'
              }}>
                <UserOutlined style={{ fontSize: '12px', color: '#1890ff' }} />
                <span>{label}</span>
                {closable && (
                  <span 
                    onClick={onClose}
                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                  >
                    ×
                  </span>
                )}
              </div>
            )}
          >
            {availableUsers.map(user => (
              <Select.Option key={`user-${user.id}`} value={user.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{user.avatar}</span>
                  <span>{user.name}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="message"
          label={t('messageText') || 'Текст сообщения'}
          rules={[{ required: true, message: t('messageTextRequired') || 'Введите текст сообщения' }]}
        >
          <TextArea 
            placeholder={t('messageTextPlaceholder') || 'Введите текст сообщения для отправки'}
            rows={4}
            showCount
            maxLength={10000}
          />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleCreateTemplate}
            style={{ height: '32px' }}
          >
            {t('createTemplate') || 'Создать шаблон'}
          </Button>
        </div>

        {showTemplateEditor && (
          <Form.Item
            label={editingTemplateId ? (t('editTemplate') || 'Редактировать шаблон') : (t('createTemplate') || 'Создать шаблон')}
            style={{ 
              background: '#f5f5f5', 
              padding: '16px', 
              borderRadius: '4px',
              marginTop: '16px'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Input
                placeholder={t('templateName') || 'Название шаблона'}
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                prefix={<EditOutlined />}
              />
              <TextArea
                placeholder={t('templateText') || 'Текст шаблона'}
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                rows={4}
                showCount
                maxLength={10000}
              />
              <Space>
                <Button
                  type="primary"
                  onClick={handleSaveTemplate}
                >
                  {t('save') || 'Сохранить'}
                </Button>
                <Button onClick={handleCancelTemplateEditor}>
                  {t('cancel') || 'Отмена'}
                </Button>
              </Space>
            </Space>
          </Form.Item>
        )}

        {messageTemplates.length > 0 && !showTemplateEditor && (
          <Form.Item label={t('savedTemplates') || 'Сохранённые шаблоны'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messageTemplates.map(template => (
                <div
                  key={template.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: '#fafafa',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    height: '32px'
                  }}
                >
                  <span style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleSelectTemplate(template.id)}>
                    {template.name}
                  </span>
                  <Space>
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEditTemplate(template)}
                      title={t('editTemplate') || 'Редактировать'}
                    />
                    <Popconfirm
                      title={t('deleteTemplate') || 'Удалить шаблон?'}
                      description={t('confirmDeleteTemplate') || 'Вы уверены, что хотите удалить этот шаблон?'}
                      onConfirm={() => handleDeleteTemplate(template.id)}
                      okText={t('yes') || 'Да'}
                      cancelText={t('no') || 'Нет'}
                      icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        title={t('deleteTemplate') || 'Удалить'}
                      />
                    </Popconfirm>
                  </Space>
                </div>
              ))}
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default WriteMessageModal
