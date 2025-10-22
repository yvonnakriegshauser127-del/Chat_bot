import React, { useState, useEffect, useRef } from 'react'
import { Modal, Input, Button, Form, message } from 'antd'
import { useTranslation } from '../hooks/useTranslation'

const CreateFolderModal = ({ 
  visible, 
  onClose, 
  onCreateFolder, 
  targetLanguage = 'ru' 
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const { t } = useTranslation(targetLanguage)

  // Автофокус на поле ввода при открытии модального окна
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [visible])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      const newFolder = {
        id: Date.now(),
        name: values.name,
        createdAt: new Date()
      }
      
      onCreateFolder(newFolder)
      form.resetFields()
      onClose()
      message.success(t('folderCreatedSuccess'))
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
      title={t('createNewFolder')}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={t('create')}
      cancelText={t('cancel')}
      width={400}
      zIndex={2000}
      destroyOnHidden={true}
      maskClosable={false}
      keyboard={false}
      focusTriggerAfterClose={false}
      getContainer={false}
      onAfterOpenChange={(open) => {
        if (open && inputRef.current) {
          setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
          }, 0)
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label={t('folderName')}
          rules={[
            { required: true, message: t('folderNameRequired') },
            { min: 1, max: 50, message: t('folderNameLength') }
          ]}
        >
          <Input 
            ref={inputRef}
            placeholder={t('enterFolderName')}
            maxLength={50}
            showCount
            autoFocus
            onKeyDown={(e) => {
              // Предотвращаем всплытие событий клавиатуры
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
            onKeyPress={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
            onKeyUp={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
            onInput={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
            onFocus={(e) => {
              e.stopPropagation()
              e.target.select()
            }}
            onBlur={(e) => {
              // Предотвращаем потерю фокуса
              e.preventDefault()
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateFolderModal
