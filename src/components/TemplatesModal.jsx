import React, { useState, useEffect } from 'react'
import { Modal, List, Typography, Card, Button, Input, Form, Space, Popconfirm, Tooltip, Select } from 'antd'
import { FileTextOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'

const { Text } = Typography

const TemplatesModal = ({ 
  visible, 
  templates, 
  templateFolders = [], 
  onClose, 
  onSelectTemplate, 
  onCreateTemplate, 
  onDeleteTemplate, 
  onUpdateTemplate, 
  onCreateFolder,
  onDeleteFolder,
  onUpdateFolder,
  targetLanguage = 'ru' 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [currentView, setCurrentView] = useState('folders') // 'folders' or 'templates'
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [editingFolderId, setEditingFolderId] = useState(null)
  const [editingFolderName, setEditingFolderName] = useState('')
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const { t } = useTranslation(targetLanguage)

  // Сброс вида на папки при открытии модального окна
  useEffect(() => {
    if (visible) {
      setCurrentView('folders')
      setSelectedFolder(null)
      setEditingFolderId(null)
      setEditingFolderName('')
    }
  }, [visible])

  const handleCreateTemplate = async () => {
    try {
      const values = await form.validateFields()
      onCreateTemplate({
        name: values.name,
        content: values.content,
        folderId: values.folderId
      })
      form.resetFields()
      setShowCreateForm(false)
    } catch (error) {
      console.log('Validation failed:', error)
    }
  }

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder)
    setCurrentView('templates')
  }

  const handleBackToFolders = () => {
    setCurrentView('folders')
    setSelectedFolder(null)
  }

  const handleEditFolder = (folder) => {
    setEditingFolderId(folder.id)
    setEditingFolderName(folder.name)
  }

  const handleSaveFolderEdit = () => {
    const trimmedName = editingFolderName.trim()
    if (trimmedName && trimmedName.length >= 1 && trimmedName.length <= 50 && onUpdateFolder) {
      onUpdateFolder(editingFolderId, trimmedName)
      setEditingFolderId(null)
      setEditingFolderName('')
    } else if (trimmedName.length > 50) {
      // Показать предупреждение о превышении лимита
      console.warn('Folder name exceeds 50 character limit')
    }
  }

  const handleCancelFolderEdit = () => {
    setEditingFolderId(null)
    setEditingFolderName('')
  }

  const getTemplatesInFolder = () => {
    if (!selectedFolder) return []
    return templates.filter(template => template.folderId === selectedFolder.id)
  }

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowViewModal(true)
  }

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template)
    editForm.setFieldsValue({
      name: template.name,
      content: template.content,
      folderId: template.folderId
    })
    setShowEditModal(true)
  }

  const handleUpdateTemplate = async () => {
    try {
      const values = await editForm.validateFields()
      onUpdateTemplate(selectedTemplate.id, {
        name: values.name,
        content: values.content,
        folderId: values.folderId
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
      title={t('messageTemplates')}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      style={{ maxHeight: '80vh' }}
      styles={{
        body: {
          maxHeight: '60vh',
          overflowY: 'auto',
          padding: '16px 24px'
        }
      }}
    >
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setShowCreateForm(true)}
          style={{ flex: 1 }}
        >
          {t('addNewTemplate')}
        </Button>
        <Button 
          icon={<FolderOutlined />}
          onClick={() => onCreateFolder && onCreateFolder()}
        >
          {t('addNewFolder')}
        </Button>
      </div>

      {showCreateForm && (
        <Card style={{ marginBottom: '16px', backgroundColor: '#f9f9f9' }}>
          <Form form={form} layout="vertical">
            <Form.Item 
              label={t('templateName')}
              name="name"
              rules={[{ required: true, message: t('enterTemplateName') }]}
            >
              <Input placeholder={t('enterTemplateName')} />
            </Form.Item>
            <Form.Item 
              label={t('templateText')}
              name="content"
              rules={[{ required: true, message: t('enterTemplateText') }]}
            >
              <Input.TextArea 
                placeholder={t('enterTemplateText')}
                rows={3}
              />
            </Form.Item>
            <Form.Item 
              label={t('templateFolder')}
              name="folderId"
              rules={[{ required: true, message: t('selectTemplateFolder') }]}
            >
              <Select 
                placeholder={t('selectTemplateFolder')}
                options={templateFolders.map(folder => ({
                  value: folder.id,
                  label: folder.name
                }))}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleCreateTemplate}>
                  {t('createTemplate')}
                </Button>
                <Button onClick={() => {
                  setShowCreateForm(false)
                  form.resetFields()
                }}>
                  {t('cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {currentView === 'folders' ? (
        <>
          {templateFolders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <FolderOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Text type="secondary">{t('noFolders')}</Text>
            </div>
          ) : (
            <List
              dataSource={templateFolders}
              renderItem={(folder) => {
                const templatesInFolder = templates.filter(t => t.folderId === folder.id)
                return (
                  <List.Item
                    key={folder.id}
                    style={{ padding: '12px 0' }}
                  >
                    <Card
                      size="small"
                      hoverable
                      style={{ width: '100%' }}
                      styles={{ body: { padding: '12px' } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {editingFolderId === folder.id ? (
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FolderOpenOutlined style={{ color: '#1890ff' }} />
                            <Input
                              value={editingFolderName}
                              onChange={(e) => setEditingFolderName(e.target.value)}
                              onPressEnter={handleSaveFolderEdit}
                              onBlur={handleSaveFolderEdit}
                              autoFocus
                              size="small"
                              style={{ flex: 1 }}
                              maxLength={50}
                              showCount
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={handleSaveFolderEdit}
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={handleCancelFolderEdit}
                            />
                          </div>
                        ) : (
                          <>
                            <div 
                              style={{ 
                                flex: 1, 
                                cursor: 'pointer',
                                minWidth: 0, // Позволяет flex-элементу сжиматься
                                overflow: 'hidden'
                              }}
                              onClick={() => handleFolderClick(folder)}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FolderOpenOutlined style={{ color: '#1890ff' }} />
                                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                  <Text 
                                    strong 
                                    style={{ 
                                      fontSize: '14px',
                                      display: 'block',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      maxWidth: '100%'
                                    }}
                                    title={folder.name}
                                  >
                                    {folder.name}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {templatesInFolder.length} {t('templates')}
                                  </Text>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {folder.id !== 1 && ( // Не показывать кнопки редактирования/удаления для папки "Общие"
                                <>
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditFolder(folder)
                                    }}
                                  />
                                  <Popconfirm
                                    title={t('deleteFolderConfirm')}
                                    description={t('deleteFolderDescription')}
                                    onConfirm={() => onDeleteFolder && onDeleteFolder(folder.id)}
                                    okText={t('yes')}
                                    cancelText={t('no')}
                                    okButtonProps={{ danger: true }}
                                  >
                                    <Button
                                      type="text"
                                      danger
                                      size="small"
                                      icon={<DeleteOutlined />}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </Popconfirm>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  </List.Item>
                )
              }}
            />
          )}
        </>
      ) : (
        <>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button 
              type="text" 
              icon={<FolderOutlined />}
              onClick={handleBackToFolders}
            >
              {t('backToFolders')}
            </Button>
            <Text strong>{selectedFolder?.name}</Text>
          </div>
          
          {getTemplatesInFolder().length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Text type="secondary">{t('noTemplatesInFolder')}</Text>
            </div>
          ) : (
            <List
              dataSource={getTemplatesInFolder()}
              renderItem={(template) => (
                <List.Item
                  key={template.id}
                  style={{ padding: '12px 0' }}
                >
                  <Card
                    size="small"
                    hoverable
                    style={{ width: '100%' }}
                    styles={{ body: { padding: '12px' } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileTextOutlined style={{ color: '#1890ff' }} />
                      <div 
                        style={{ 
                          flex: 1, 
                          cursor: 'pointer',
                          minWidth: 0, // Позволяет flex-элементу сжиматься
                          overflow: 'hidden'
                        }}
                        onClick={() => onSelectTemplate(template.content)}
                      >
                        <Text 
                          strong 
                          style={{ 
                            fontSize: '14px',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%'
                          }}
                          title={template.name}
                        >
                          {template.name}
                        </Text>
                        <Text 
                          type="secondary" 
                          style={{ 
                            fontSize: '12px',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: '1.4',
                            maxWidth: '100%',
                            cursor: 'pointer'
                          }}
                          title={template.content}
                        >
                          {template.content}
                        </Text>
                      </div>
                      <Space>
                        <Tooltip title={t('viewTemplate')}>
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
                        <Tooltip title={t('editTemplate')}>
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
                          title={t('deleteTemplateConfirm')}
                          description={t('deleteTemplateDescription')}
                          onConfirm={() => onDeleteTemplate(template.id)}
                          okText={t('yes')}
                          cancelText={t('no')}
                        >
                          <Tooltip title={t('deleteTemplate')}>
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
          )}
        </>
      )}

      {/* Модальное окно для просмотра шаблона */}
      <Modal
        title={t('viewTemplateTitle')}
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
{t('close')}
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
        title={t('editTemplateTitle')}
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
            {t('cancel')}
          </Button>,
          <Button key="save" type="primary" onClick={handleUpdateTemplate}>
            {t('saveChanges')}
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
            label={t('templateName')}
            name="name"
            rules={[{ required: true, message: t('enterTemplateName') }]}
          >
            <Input placeholder={t('enterTemplateName')} />
          </Form.Item>
          <Form.Item 
            label={t('templateText')}
            name="content"
            rules={[{ required: true, message: t('enterTemplateText') }]}
          >
            <Input.TextArea 
              placeholder={t('enterTemplateText')}
              rows={6}
            />
          </Form.Item>
          <Form.Item 
            label={t('templateFolder')}
            name="folderId"
            rules={[{ required: true, message: t('selectTemplateFolder') }]}
          >
            <Select 
              placeholder={t('selectTemplateFolder')}
              options={templateFolders.map(folder => ({
                value: folder.id,
                label: folder.name
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  )
}

export default TemplatesModal
