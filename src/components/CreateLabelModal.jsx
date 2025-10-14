import React, { useState } from 'react'
import { Modal, Form, Input, Button, Space, Row, Col } from 'antd'
import { TagOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'

// Палитра цветов для ярлыков
const labelColors = [
  { color: '#1890ff', name: 'Синий' },
  { color: '#52c41a', name: 'Зеленый' },
  { color: '#faad14', name: 'Желтый' },
  { color: '#f5222d', name: 'Красный' },
  { color: '#722ed1', name: 'Фиолетовый' },
  { color: '#13c2c2', name: 'Бирюзовый' },
  { color: '#eb2f96', name: 'Розовый' },
  { color: '#fa8c16', name: 'Оранжевый' },
  { color: '#2f54eb', name: 'Темно-синий' },
  { color: '#52c41a', name: 'Лайм' },
  { color: '#fa541c', name: 'Коралловый' },
  { color: '#8c8c8c', name: 'Серый' },
  { color: '#096dd9', name: 'Голубой' },
  { color: '#389e0d', name: 'Темно-зеленый' },
  { color: '#d4b106', name: 'Золотой' },
  { color: '#cf1322', name: 'Темно-красный' },
  { color: '#531dab', name: 'Темно-фиолетовый' },
  { color: '#08979c', name: 'Темно-бирюзовый' },
  { color: '#c41d7f', name: 'Темно-розовый' },
  { color: '#d46b08', name: 'Темно-оранжевый' }
]

const LabelFormModal = ({ visible, onClose, onSave, targetLanguage, initialValues = null, isEdit = false }) => {
  const { t } = useTranslation(targetLanguage)
  const [form] = Form.useForm()
  const [selectedColor, setSelectedColor] = useState(initialValues?.color || '#1890ff')

  // Инициализация формы при открытии модального окна
  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        name: initialValues.name
      })
      setSelectedColor(initialValues.color)
    } else if (visible && !initialValues) {
      form.resetFields()
      setSelectedColor('#1890ff')
    }
  }, [visible, initialValues, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      const labelData = {
        id: isEdit ? initialValues.id : `label-${Date.now()}`,
        name: values.name,
        color: selectedColor
      }
      
      onSave(labelData)
      form.resetFields()
      setSelectedColor('#1890ff')
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setSelectedColor('#1890ff')
    onClose()
  }

  return (
    <Modal
      title={
        <Space>
          <TagOutlined style={{ color: '#722ed1' }} />
          <span>{isEdit ? t('editLabel') : t('createNewLabel')}</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t('cancel')}
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          {isEdit ? t('saveChanges') : t('createLabel')}
        </Button>
      ]}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: '' }}
      >
        <Form.Item
          name="name"
          label={t('labelName')}
          rules={[
            { required: true, message: t('labelNameRequired') },
            { min: 2, message: t('labelNameTooShort') },
            { max: 20, message: t('labelNameTooLong') }
          ]}
        >
          <Input 
            placeholder={t('enterLabelName')}
            prefix={<TagOutlined />}
          />
        </Form.Item>

        <Form.Item label={t('selectColor')}>
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: '#fafafa'
          }}>
            <Row gutter={[8, 8]}>
              {labelColors.map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedColor === item.color ? '#e6f7ff' : 'transparent',
                      border: selectedColor === item.color ? '2px solid #1890ff' : '2px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        backgroundColor: item.color,
                        marginBottom: '4px',
                        border: '1px solid #d9d9d9'
                      }}
                    />
                    <span style={{ 
                      fontSize: '10px', 
                      textAlign: 'center',
                      color: '#666',
                      lineHeight: '1.2'
                    }}>
                      {item.name}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Form.Item>

        {selectedColor && (
          <Form.Item label={t('preview')}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
              border: '1px solid #d9d9d9'
            }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  backgroundColor: selectedColor,
                  border: '1px solid #d9d9d9'
                }}
              />
              <span style={{ fontWeight: 500 }}>
                {form.getFieldValue('name') || t('labelName')}
              </span>
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default LabelFormModal
