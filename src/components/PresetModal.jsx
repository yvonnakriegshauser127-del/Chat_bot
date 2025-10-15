import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button, Space, message } from 'antd'
import { PlusOutlined, AmazonOutlined, InstagramOutlined, MailOutlined, TikTokOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'


const PresetModal = ({ visible, onClose, onCreatePreset, stores, emails, labels = [], targetLanguage = 'ru', initialValues = null, isEdit = false }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(targetLanguage)

  // Инициализация формы при редактировании
  React.useEffect(() => {
    if (visible && initialValues && isEdit) {
      // Фильтруем ярлыки, оставляя только существующие
      const existingLabelIds = labels.map(label => label.id)
      const validLabels = (initialValues.labels || []).filter(labelId => 
        existingLabelIds.includes(labelId)
      )
      
      form.setFieldsValue({
        name: initialValues.name,
        channels: initialValues.channels || [],
        stores: initialValues.stores || [],
        emails: initialValues.emails || [],
        labels: validLabels
      })
    } else if (visible && !isEdit) {
      form.resetFields()
    }
  }, [visible, initialValues, isEdit, form, labels])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      // Фильтруем ярлыки, оставляя только существующие
      const existingLabelIds = labels.map(label => label.id)
      const validLabels = (values.labels || []).filter(labelId => 
        existingLabelIds.includes(labelId)
      )
      
      const presetData = {
        id: isEdit ? initialValues.id : Date.now(),
        name: values.name,
        channels: values.channels,
        stores: values.stores,
        emails: values.emails,
        labels: validLabels,
        createdAt: isEdit ? initialValues.createdAt : new Date()
      }
      
      onCreatePreset(presetData)
      form.resetFields()
      onClose()
      message.success(isEdit ? 'Пресет успешно обновлен!' : 'Пресет успешно создан!')
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={isEdit ? t('editPreset') : t('createNewPreset')}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t('cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {isEdit ? t('saveChanges') : t('createPreset')}
        </Button>
      ]}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label={t('presetName')}
          rules={[
            { required: true, message: t('enterPresetName') },
            { min: 1, message: t('nameTooShort') }
          ]}
        >
          <Input placeholder={t('enterPresetName')} />
        </Form.Item>

        <Form.Item
          name="channels"
          label={t('channels')}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectChannels')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            showSearch
            filterOption={(input, option) => {
              const searchText = input.toLowerCase()
              const optionText = (option?.label ?? option?.children ?? '').toString().toLowerCase()
              return optionText.includes(searchText)
            }}
            tagRender={({ label, value, closable, onClose }) => {
              const getChannelIcon = (channel) => {
                switch (channel) {
                  case 'amazon':
                    return <AmazonOutlined style={{ color: '#ff9900' }} />
                  case 'instagram':
                    return <InstagramOutlined style={{ color: '#e4405f' }} />
                  case 'email':
                    return <MailOutlined style={{ color: '#1890ff' }} />
                  case 'tiktok':
                    return <TikTokOutlined style={{ color: '#000000' }} />
                  default:
                    return null
                }
              }
              
              return (
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
                  {getChannelIcon(value)}
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
              )
            }}
          >
            <Select.Option value="amazon">Amazon</Select.Option>
            <Select.Option value="instagram">Instagram</Select.Option>
            <Select.Option value="email">Email</Select.Option>
            <Select.Option value="tiktok">TikTok</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="stores"
          label={t('stores')}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectStores')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            showSearch
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
              <Select.Option key={store.id} value={store.id}>
                {store.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="emails"
          label={t('emails')}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectEmails')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            showSearch
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
                <span>📧</span>
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
            {emails.map(email => (
              <Select.Option key={email.id} value={email.address}>
                {email.address}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="labels"
          label={t('labels')}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectLabels')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            showSearch
            filterOption={(input, option) => {
              const searchText = input.toLowerCase()
              const optionText = (option?.label ?? option?.children ?? '').toString().toLowerCase()
              return optionText.includes(searchText)
            }}
            tagRender={({ label, value, closable, onClose }) => {
              // На некоторых данных value может приходить как name. Делаем устойчивый поиск
              const selectedLabel =
                labels.find(l => l.id === value) ||
                labels.find(l => l.name === value) ||
                labels.find(l => l.name === label)
              return (
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  background: '#ffffff', // Белый фон
                  color: selectedLabel?.textColor || '#000000', // Цвет текста из настроек ярлыка
                  border: `1px solid ${selectedLabel?.color || '#d9d9d9'}`, // Цвет бордера из настроек ярлыка
                  borderRadius: '12px',
                  padding: '2px 8px',
                  margin: '2px',
                  fontSize: '12px',
                  height: '28px',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}>
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
              )
            }}
          >
            {labels.map(label => (
              <Select.Option key={label.id} value={label.id}>
                {label.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PresetModal
