import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Form, Select, Input, Space, Button, message } from 'antd'
import { EditOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'

const { TextArea } = Input

const DEFAULT_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
  { value: 'gpt-4.1', label: 'GPT-4.1' },
  { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' }
]

const AiSettingsModal = ({
  visible,
  onClose,
  targetLanguage = 'ru',
  models = DEFAULT_MODELS,
  initialSelectedModel,
  initialPrompts = [],
  initialSelectedPromptId,
  onSave
}) => {
  const { t } = useTranslation(targetLanguage)
  const [form] = Form.useForm()

  const [selectedModel, setSelectedModel] = useState(initialSelectedModel || models[0]?.value)
  const [prompts, setPrompts] = useState(initialPrompts)
  const [selectedPromptId, setSelectedPromptId] = useState(initialSelectedPromptId || null)
  const [promptName, setPromptName] = useState('')
  const [promptText, setPromptText] = useState('')
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)

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

  const selectedPrompt = useMemo(() => prompts.find(p => p.id === selectedPromptId) || null, [prompts, selectedPromptId])

  const handleSaveAll = () => {
    if (!selectedModel) {
      message.error('Выберите модель')
      return
    }
    onSave?.({
      selectedModel,
      prompts,
      selectedPromptId
    })
    onClose?.()
  }

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
      // Не выбираем автоматически новый промпт в селекте
      setShowPromptEditor(false)
      setPromptName('')
      setPromptText('')
      message.success(t('promptCreatedSuccessfully') || 'Промпт успешно создан')
    }
  }

  const handleUpdatePrompt = () => {
    if (!selectedPromptId) {
      message.error('Сначала выберите промпт')
      return
    }
    const trimmedName = (promptName || '').trim()
    const trimmedText = (promptText || '').trim()
    if (!trimmedName || !trimmedText) {
      message.error('Укажите название и текст промпта')
      return
    }
    const updated = prompts.map(p => p.id === selectedPromptId ? { ...p, name: trimmedName, text: trimmedText } : p)
    setPrompts(updated)
    message.success('Промпт обновлён')
  }

  const modelOptions = models.map(m => ({ value: m.value, label: m.label }))

  const promptOptions = React.useMemo(() => {
    const items = prompts.map(p => ({
      value: p.id,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{p.name}</span>
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
        </div>
      )
    }))

    return items
  }, [prompts])

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={t('aiModalTitle') || 'AI'}
      width={720}
      onOk={handleSaveAll}
      okText={t('save') || 'Сохранить'}
      cancelText={t('cancel')}
    >
      <Form form={form} layout="vertical">
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
              // Открываем редактор для создания нового промпта, не трогая текущий выбор
              setShowPromptEditor(true)
              setIsEditingPrompt(false)
              setPromptName('')
              setPromptText('')
            }}
            title={t('aiCreatePrompt') || 'Создать промпт'}
          >
            {t('aiCreatePrompt') || 'Создать промпт'}
          </Button>
        </div>
        <Form.Item label={t('aiSavedPrompts') || 'Сохранённые промпты'} style={{ marginBottom: 20 }}>
          <Select
            placeholder={t('aiSelectPromptPlaceholder') || 'Выберите промпт'}
            value={selectedPromptId || undefined}
            onChange={handleSelectPrompt}
            options={promptOptions}
            // убираем крестик очищения
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
    </Modal>
  )
}

export default AiSettingsModal
