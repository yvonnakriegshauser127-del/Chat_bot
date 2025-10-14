import React, { useState, useEffect } from 'react'
import { Modal, Tag, Space, Typography, Checkbox, Button } from 'antd'
import { TagOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'
import './UserLabelsModal.css'

const { Title, Text } = Typography

const UserLabelsModal = ({ 
  visible, 
  onClose, 
  user,
  availableLabels,
  onUpdateLabels,
  targetLanguage = 'ru'
}) => {
  const { t } = useTranslation(targetLanguage)
  const [selectedLabels, setSelectedLabels] = useState([])

  useEffect(() => {
    if (visible && user) {
      setSelectedLabels(user.labels || [])
    }
  }, [visible, user])

  const handleLabelToggle = (labelId) => {
    setSelectedLabels(prev => {
      if (prev.includes(labelId)) {
        return prev.filter(id => id !== labelId)
      } else {
        return [...prev, labelId]
      }
    })
  }

  const handleSave = () => {
    onUpdateLabels(user.id, selectedLabels)
    onClose()
  }

  const getLabelById = (labelId) => {
    return availableLabels.find(label => label.id === labelId)
  }

  return (
    <Modal
      title={
        <Space>
          <TagOutlined style={{ color: '#1890ff' }} />
          <span>{t('manageLabels')}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('cancel')}
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          {t('save')}
        </Button>
      ]}
      width={500}
    >
      {user && (
        <div>
          <Title level={5} style={{ marginBottom: '8px' }}>
            {t('user')}: {user.name}
          </Title>
          
          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            {t('selectLabelsForUser')} ({availableLabels.length} {t('available')}):
          </Text>

          <div className="labels-scroll-container">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {availableLabels.map(label => (
                <div 
                  key={label.id}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedLabels.includes(label.id) ? '#f0f5ff' : 'transparent',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => handleLabelToggle(label.id)}
                >
                  <Space>
                    <Checkbox 
                      checked={selectedLabels.includes(label.id)}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLabelToggle(label.id)
                      }}
                    />
                    <Tag 
                      color={label.color} 
                      style={{ margin: 0, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLabelToggle(label.id)
                      }}
                    >
                      {label.name}
                    </Tag>
                  </Space>
                </div>
              ))}
            </Space>
          </div>

          {selectedLabels.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <Text strong>{t('selectedLabels')}:</Text>
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {selectedLabels.map(labelId => {
                    const label = getLabelById(labelId)
                    return label ? (
                      <Tag key={labelId} color={label.color}>
                        {label.name}
                      </Tag>
                    ) : null
                  })}
                </Space>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

export default UserLabelsModal

