import React, { useState } from 'react'
import { Modal, Form, Input, Button, Space, Row, Col } from 'antd'
import { TagOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'
import './LabelFormModal.css'

// Структурированная палитра цветов для ярлыков (оттенки в горизонтальных рядах)
const labelColors = [
  // Серая шкала (первая строка)
  { color: '#000000', name: 'Черный' }, // (0,0,0)
  { color: '#434343', name: 'Темно-серый' }, // (67,67,67)
  { color: '#666666', name: 'Серый' }, // (102,102,102)
  { color: '#999999', name: 'Светло-серый' }, // (153,153,153)
  { color: '#cccccc', name: 'Очень светло-серый' }, // (204,204,204)
  { color: '#efefef', name: 'Бледно-серый' }, // (239,239,239)
  
  // Основные цвета (вторая строка)
  { color: '#f6c5be', name: 'Светло-розовый' }, // (246, 197, 190)
  { color: '#efa093', name: 'Розово-коричневый' }, // (239, 160, 147)
  { color: '#e66550', name: 'Красно-коричневый' }, // (230, 101, 80)
  { color: '#cc3a21', name: 'Темно-красный' }, // (204, 58, 33)
  { color: '#ac2b16', name: 'Коричнево-красный' }, // (172, 43, 22)
  { color: '#822111', name: 'Темно-коричневый' }, // (130, 33, 17)
  
  // Третий ряд
  { color: '#ffe6c7', name: 'Светло-персиковый' }, // (255, 230, 199)
  { color: '#ffd6a2', name: 'Персиковый' }, // (255, 214, 162)
  { color: '#ffbc6b', name: 'Светло-оранжевый' }, // (255, 188, 107)
  { color: '#eaa041', name: 'Оранжевый' }, // (234, 160, 65)
  { color: '#cf8933', name: 'Темно-оранжевый' }, // (207, 137, 51)
  { color: '#a46a21', name: 'Коричнево-оранжевый' }, // (164, 106, 33)
  
  // Четвертый ряд
  { color: '#fef1d1', name: 'Светло-кремовый' }, // (254, 241, 209)
  { color: '#fce8b3', name: 'Кремовый' }, // (252, 232, 179)
  { color: '#fcda83', name: 'Светло-желтый' }, // (252, 218, 131)
  { color: '#f2c960', name: 'Желтый' }, // (242, 201, 96)
  { color: '#d5ae49', name: 'Темно-желтый' }, // (213, 174, 73)
  { color: '#aa8831', name: 'Коричнево-желтый' }, // (170, 136, 49)
  
  // Пятый ряд
  { color: '#b9e4d0', name: 'Светло-зеленый' }, // (185, 228, 208)
  { color: '#89d3b2', name: 'Зеленый' }, // (137, 211, 178)
  { color: '#44b984', name: 'Средне-зеленый' }, // (68, 185, 132)
  { color: '#149e60', name: 'Темно-зеленый' }, // (20, 158, 96)
  { color: '#0b804b', name: 'Очень темно-зеленый' }, // (11, 128, 75)
  { color: '#076239', name: 'Коричнево-зеленый' }, // (7, 98, 57)
  
  // Шестой ряд
  { color: '#c6f3de', name: 'Светло-мятный' }, // (198, 243, 222)
  { color: '#a0eac9', name: 'Мятный' }, // (160, 234, 201)
  { color: '#68dfa9', name: 'Светло-бирюзовый' }, // (104, 223, 169)
  { color: '#3dc789', name: 'Бирюзовый' }, // (61, 199, 137)
  { color: '#2a9c68', name: 'Темно-бирюзовый' }, // (42, 156, 104)
  { color: '#1a764d', name: 'Коричнево-бирюзовый' }, // (26, 118, 77)
  
  // Седьмой ряд
  { color: '#c9daf8', name: 'Светло-синий' }, // (201, 218, 248)
  { color: '#a4c2f4', name: 'Синий' }, // (164, 194, 244)
  { color: '#6d9eeb', name: 'Средне-синий' }, // (109, 158, 235)
  { color: '#3c78d8', name: 'Темно-синий' }, // (60, 120, 216)
  { color: '#285bac', name: 'Очень темно-синий' }, // (40, 91, 172)
  { color: '#1c4587', name: 'Коричнево-синий' }, // (28, 69, 135)
  
  // Восьмой ряд
  { color: '#e4d7f5', name: 'Светло-фиолетовый' }, // (228, 215, 245)
  { color: '#d0bcf1', name: 'Фиолетовый' }, // (208, 188, 241)
  { color: '#b694e8', name: 'Средне-фиолетовый' }, // (182, 148, 232)
  { color: '#8e63ce', name: 'Темно-фиолетовый' }, // (142, 99, 206)
  { color: '#653e9b', name: 'Очень темно-фиолетовый' }, // (101, 62, 155)
  { color: '#41236d', name: 'Коричнево-фиолетовый' }, // (65, 35, 109)
  
  // Девятый ряд
  { color: '#fcdee8', name: 'Светло-розовый' }, // (252, 222, 232)
  { color: '#fbc8d9', name: 'Розовый' }, // (251, 200, 217)
  { color: '#f7a7c0', name: 'Средне-розовый' }, // (247, 167, 192)
  { color: '#e07798', name: 'Темно-розовый' }, // (224, 119, 152)
  { color: '#b65775', name: 'Очень темно-розовый' }, // (182, 87, 117)
  { color: '#83334c', name: 'Коричнево-розовый' } // (131, 51, 76)
]

// Палитра цветов для текста (идентична палитре фона)
const textColors = labelColors

const LabelFormModal = ({ visible, onClose, onSave, targetLanguage, initialValues = null, isEdit = false }) => {
  const { t } = useTranslation(targetLanguage)
  const [form] = Form.useForm()
  const [selectedColor, setSelectedColor] = useState(initialValues?.color || '#1890ff')
  const [selectedTextColor, setSelectedTextColor] = useState(initialValues?.textColor || '#ffffff')
  const [labelName, setLabelName] = useState(initialValues?.name || '')

  // Инициализация формы при открытии модального окна
  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        name: initialValues.name
      })
      setSelectedColor(initialValues.color)
      setSelectedTextColor(initialValues.textColor || '#ffffff')
      setLabelName(initialValues.name)
    } else if (visible && !initialValues) {
      form.resetFields()
      setSelectedColor('#1890ff')
      setSelectedTextColor('#ffffff')
      setLabelName('')
    }
  }, [visible, initialValues, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      const labelData = {
        id: isEdit ? initialValues.id : `label-${Date.now()}`,
        name: values.name,
        color: selectedColor,
        textColor: selectedTextColor
      }
      
      onSave(labelData)
      form.resetFields()
      setSelectedColor('#1890ff')
      setSelectedTextColor('#ffffff')
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setSelectedColor('#1890ff')
    setSelectedTextColor('#ffffff')
    setLabelName('')
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
      width={400}
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
            { min: 1, message: t('labelNameTooShort') },
            { max: 20, message: t('labelNameTooLong') }
          ]}
        >
          <Input 
            placeholder={t('enterLabelName')}
            prefix={<TagOutlined />}
                 onChange={(e) => setLabelName(e.target.value)}
          />
        </Form.Item>

        <Form.Item label={t('selectColor')}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{t('selectColor')}</div>
          <div style={{ 
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: '#fafafa'
          }}>
            {/* Серая шкала (первая строка) */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(0, 6).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Основные цвета (вторая строка) */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(6, 12).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Третий ряд */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(12, 18).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Четвертый ряд */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(18, 24).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Пятый ряд */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(24, 30).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Шестой ряд */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(30, 36).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Седьмой ряд */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(36, 42).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Восьмой ряд */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(42, 48).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Девятый ряд */}
            <Row gutter={[0, 0]}>
              {labelColors.slice(48, 54).map((item, index) => (
                <Col span={4} key={index}>
                    <div
                      style={{
                      width: '100%',
                      height: '25px',
                        backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedColor(item.color)}
                    title={item.name}
                  >
                    {selectedColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{t('selectTextColor')}</div>
              <div style={{ 
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '12px',
                backgroundColor: '#fafafa'
              }}>
            {/* Серая шкала (первая строка) */}
            <Row gutter={[0, 0]}>
              {textColors.slice(0, 6).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Основные цвета (вторая строка) */}
            <Row gutter={[0, 0]}>
              {textColors.slice(6, 12).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Третий ряд */}
            <Row gutter={[0, 0]}>
              {textColors.slice(12, 18).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Четвертый ряд */}
            <Row gutter={[0, 0]}>
              {textColors.slice(18, 24).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Пятый ряд */}
            <Row gutter={[0, 0]}>
              {textColors.slice(24, 30).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Шестой ряд */}
            <Row gutter={[0, 0]}>
              {textColors.slice(30, 36).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Седьмой ряд */}
            <Row gutter={[0, 0]}>
              {textColors.slice(36, 42).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Восьмой ряд */}
            <Row gutter={[0, 0]}>
              {textColors.slice(42, 48).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>

            {/* Девятый ряд */}
            <Row gutter={[0, 0]}>
              {textColors.slice(48, 54).map((item, index) => (
                <Col span={4} key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '25px',
                      backgroundColor: item.color,
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: selectedTextColor === item.color ? '2px solid #1890ff' : 'none',
                      outlineOffset: '-2px',
                      boxSizing: 'border-box'
                    }}
                    onClick={() => setSelectedTextColor(item.color)}
                    title={item.name}
                  >
                    {selectedTextColor === item.color && (
                      <div
                        className="palette-check"
                        style={{
                          color: item.color === '#ffffff' || item.color === '#f8f8f8' ? '#000000' : '#ffffff'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
            </Col>
          </Row>
        </Form.Item>

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
                border: '1px solid #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span
                style={{
                  color: selectedTextColor,
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              >
                {labelName?.charAt(0)?.toUpperCase() || 'Я'}
              </span>
            </div>
              <span style={{ fontWeight: 500 }}>
              {labelName || t('labelName')}
              </span>
            </div>
          </Form.Item>
      </Form>
    </Modal>
  )
}

export default LabelFormModal