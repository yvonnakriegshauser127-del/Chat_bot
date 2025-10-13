import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button, Space, message } from 'antd'
import { PlusOutlined, AmazonOutlined, InstagramOutlined, MailOutlined, TikTokOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'


const PresetModal = ({ visible, onClose, onCreatePreset, stores, emails, targetLanguage = 'ru' }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(targetLanguage)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      const newPreset = {
        id: Date.now(),
        name: values.name,
        channels: values.channels,
        stores: values.stores,
        emails: values.emails,
        createdAt: new Date()
      }
      
      onCreatePreset(newPreset)
      form.resetFields()
      onClose()
      message.success('Пресет успешно создан!')
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
      title={t('createNewPreset')}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t('cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {t('createPreset')}
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
            { min: 2, message: t('nameTooShort') }
          ]}
        >
          <Input placeholder={t('enterPresetName')} />
        </Form.Item>

        <Form.Item
          name="channels"
          label={t('channels')}
          rules={[{ required: true, message: t('selectChannels') }]}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectChannels')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
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
                  borderRadius: '4px',
                  padding: '2px 8px',
                  margin: '2px'
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
          rules={[{ required: true, message: t('selectStores') }]}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectStores')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            tagRender={({ label, value, closable, onClose }) => (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                background: '#f0f0f0',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '2px 8px',
                margin: '2px'
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
          rules={[
            { required: true, message: t('selectEmails') }
          ]}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectEmails')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            tagRender={({ label, value, closable, onClose }) => (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                background: '#f0f0f0',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '2px 8px',
                margin: '2px'
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
      </Form>
    </Modal>
  )
}

export default PresetModal
