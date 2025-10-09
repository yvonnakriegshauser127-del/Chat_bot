import React, { useState } from 'react'
import { Modal, Form, Input, Select, Button, Space, message } from 'antd'
import { PlusOutlined, ShoppingOutlined, InstagramOutlined, MailOutlined } from '@ant-design/icons'

const { Option } = Select

const PresetModal = ({ visible, onClose, onCreatePreset, stores, emails }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

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
      title="Создать новый пресет"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Создать пресет
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
          label="Название пресета"
          rules={[
            { required: true, message: 'Введите название пресета' },
            { min: 2, message: 'Название должно содержать минимум 2 символа' }
          ]}
        >
          <Input placeholder="Например: Amazon Electronics Store" />
        </Form.Item>

        <Form.Item
          name="channels"
          label="Каналы"
          rules={[{ required: true, message: 'Выберите хотя бы один канал' }]}
        >
          <Select 
            mode="multiple" 
            placeholder="Выберите каналы"
            style={{ width: '100%' }}
            maxTagCount="responsive"
            tagRender={({ label, value, closable, onClose }) => {
              const getChannelIcon = (channel) => {
                switch (channel) {
                  case 'amazon':
                    return <ShoppingOutlined style={{ color: '#ff9900' }} />
                  case 'instagram':
                    return <InstagramOutlined style={{ color: '#e4405f' }} />
                  case 'email':
                    return <MailOutlined style={{ color: '#1890ff' }} />
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
            <Option value="amazon">Amazon</Option>
            <Option value="instagram">Instagram</Option>
            <Option value="email">Email</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="stores"
          label="Магазины"
          rules={[{ required: true, message: 'Выберите хотя бы один магазин' }]}
        >
          <Select 
            mode="multiple" 
            placeholder="Выберите магазины"
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
              <Option key={store.id} value={store.id}>
                {store.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="emails"
          label="Email адреса"
          rules={[
            { required: true, message: 'Выберите хотя бы один email' }
          ]}
        >
          <Select 
            mode="multiple" 
            placeholder="Выберите email адреса"
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
              <Option key={email.id} value={email.address}>
                {email.address}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PresetModal
