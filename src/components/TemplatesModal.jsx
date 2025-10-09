import React, { useState } from 'react'
import { Modal, List, Typography, Card, Button, Input, Form, Space, Popconfirm, Tooltip } from 'antd'
import { FileTextOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'

const { Text } = Typography

const TemplatesModal = ({ visible, templates, onClose, onSelectTemplate, onCreateTemplate, onDeleteTemplate, onUpdateTemplate }) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

  const handleCreateTemplate = async () => {
    try {
      const values = await form.validateFields()
      onCreateTemplate({
        name: values.name,
        content: values.content
      })
      form.resetFields()
      setShowCreateForm(false)
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowViewModal(true)
  }

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template)
    editForm.setFieldsValue({
      name: template.name,
      content: template.content
    })
    setShowEditModal(true)
  }

  const handleUpdateTemplate = async () => {
    try {
      const values = await editForm.validateFields()
      onUpdateTemplate(selectedTemplate.id, {
        name: values.name,
        content: values.content
      })
      editForm.resetFields()
      setShowEditModal(false)
      setSelectedTemplate(null)
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }

  return (
    <Modal
      title="Шаблоны сообщений"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ marginBottom: '16px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setShowCreateForm(true)}
          style={{ width: '100%' }}
        >
          Добавить новый шаблон
        </Button>
      </div>

      {showCreateForm && (
        <Card style={{ marginBottom: '16px', backgroundColor: '#f9f9f9' }}>
          <Form form={form} layout="vertical">
            <Form.Item 
              label="Название шаблона"
              name="name"
              rules={[{ required: true, message: 'Введите название шаблона' }]}
            >
              <Input placeholder="Введите название шаблона" />
            </Form.Item>
            <Form.Item 
              label="Текст шаблона"
              name="content"
              rules={[{ required: true, message: 'Введите текст шаблона' }]}
            >
              <Input.TextArea 
                placeholder="Введите текст шаблона"
                rows={3}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleCreateTemplate}>
                  Создать шаблон
                </Button>
                <Button onClick={() => {
                  setShowCreateForm(false)
                  form.resetFields()
                }}>
                  Отмена
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      <List
        dataSource={templates}
        renderItem={(template) => (
          <List.Item
            key={template.id}
            style={{ padding: '12px 0' }}
          >
            <Card
              size="small"
              hoverable
              style={{ width: '100%' }}
              bodyStyle={{ padding: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                <div 
                  style={{ flex: 1, cursor: 'pointer' }}
                  onClick={() => onSelectTemplate(template.content)}
                >
                  <Text strong style={{ fontSize: '14px' }}>
                    {template.name}
                  </Text>
                  <br />
                  <Tooltip title={template.content} placement="top">
                    <Text 
                      type="secondary" 
                      style={{ 
                        fontSize: '12px',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.4',
                        maxHeight: '16.8px',
                        cursor: 'pointer'
                      }}
                    >
                      {template.content}
                    </Text>
                  </Tooltip>
                </div>
                <Space>
                  <Tooltip title="Просмотреть шаблон">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewTemplate(template)
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Редактировать шаблон">
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditTemplate(template)
                      }}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Удалить шаблон?"
                    description="Вы уверены, что хотите удалить этот шаблон?"
                    onConfirm={() => onDeleteTemplate(template.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Tooltip title="Удалить шаблон">
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Tooltip>
                  </Popconfirm>
                </Space>
              </div>
            </Card>
          </List.Item>
        )}
      />

      {/* Модальное окно для просмотра шаблона */}
      <Modal
        title="Просмотр шаблона"
        open={showViewModal}
        onCancel={() => {
          setShowViewModal(false)
          setSelectedTemplate(null)
        }}
        footer={[
          <Button key="close" onClick={() => {
            setShowViewModal(false)
            setSelectedTemplate(null)
          }}>
            Закрыть
          </Button>
        ]}
        width={600}
      >
        {selectedTemplate && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ fontSize: '16px' }}>
                {selectedTemplate.name}
              </Text>
            </div>
            <div style={{ 
              background: '#f5f5f5', 
              padding: '16px', 
              borderRadius: '6px',
              border: '1px solid #d9d9d9'
            }}>
              <Text style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                {selectedTemplate.content}
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно для редактирования шаблона */}
      <Modal
        title="Редактировать шаблон"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false)
          setSelectedTemplate(null)
          editForm.resetFields()
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setShowEditModal(false)
            setSelectedTemplate(null)
            editForm.resetFields()
          }}>
            Отмена
          </Button>,
          <Button key="save" type="primary" onClick={handleUpdateTemplate}>
            Сохранить изменения
          </Button>
        ]}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item 
            label="Название шаблона"
            name="name"
            rules={[{ required: true, message: 'Введите название шаблона' }]}
          >
            <Input placeholder="Введите название шаблона" />
          </Form.Item>
          <Form.Item 
            label="Текст шаблона"
            name="content"
            rules={[{ required: true, message: 'Введите текст шаблона' }]}
          >
            <Input.TextArea 
              placeholder="Введите текст шаблона"
              rows={6}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  )
}

export default TemplatesModal
