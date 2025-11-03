import React, { useState } from 'react'
import { Modal, Form, Select, Button, message, Input } from 'antd'
import { AmazonOutlined, InstagramOutlined, MailOutlined, TikTokOutlined, UserOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'

const { TextArea } = Input

const WriteMessageModal = ({ 
  visible, 
  onClose, 
  stores = [], 
  users = [], 
  targetLanguage = 'ru',
  onSendMessage 
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(targetLanguage)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      if (!values.stores || values.stores.length === 0) {
        message.error(t('noStoresSelected'))
        return
      }
      
      if (!values.bloggers || values.bloggers.length === 0) {
        message.error(t('noBloggersSelected'))
        return
      }

      // Вызываем callback с выбранными данными
      onSendMessage({
        stores: values.stores,
        bloggers: values.bloggers,
        message: values.message || ''
      })
      
      form.resetFields()
      onClose()
      message.success('Сообщение отправлено!')
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
          rules={[{ required: true, message: t('noStoresSelected') }]}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectStoresPlaceholder')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            showSearch
            allowClear
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
          rules={[{ required: true, message: t('noBloggersSelected') }]}
        >
          <Select 
            mode="multiple" 
            placeholder={t('selectBloggersPlaceholder')}
            style={{ width: '100%' }}
            maxTagCount="responsive"
            showSearch
            allowClear
            filterOption={(input, option) => {
              const searchText = input.toLowerCase()
              // Ищем по имени пользователя
              const user = users.find(u => u.id === option.value)
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
            {users.map(user => (
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
      </Form>
    </Modal>
  )
}

export default WriteMessageModal
