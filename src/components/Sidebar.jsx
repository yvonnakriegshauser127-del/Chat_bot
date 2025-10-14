import React, { useState } from 'react'
import { Layout, Input, Button, List, Avatar, Typography, Badge, Collapse, Tooltip, Dropdown, Space, Tag, Modal, Popconfirm } from 'antd'
import { SearchOutlined, PlusOutlined, MessageOutlined, TeamOutlined, StarOutlined, StarFilled, InboxOutlined, FileZipFilled, BellOutlined, AmazonOutlined, InstagramOutlined, MailOutlined, TikTokOutlined, DownOutlined, UpOutlined, DeleteOutlined, PushpinOutlined, SettingOutlined, ExclamationCircleOutlined, TagOutlined, MoreOutlined, EditOutlined } from '@ant-design/icons'
import PresetModal from './PresetModal'
import UserLabelsModal from './UserLabelsModal'
import LabelFormModal from './LabelFormModal'
import { useTranslation } from '../hooks/useTranslation'
import './Sidebar.css'

const { Sider } = Layout
const { Text } = Typography

const Sidebar = ({ 
  chats, 
  currentChatId, 
  searchTerm, 
  onSearchChange, 
  onSearchReset,
  onChatSelect, 
  onNewChat,
  users,
  onToggleFavorite,
  onToggleArchive,
  onTogglePin,
  presets,
  selectedPreset,
  onPresetSelect,
  onCreatePreset,
  onDeletePreset,
  stores,
  emails,
  targetLanguage,
  onShowProfileSettings,
  currentUser,
  labels = [],
  groups = [],
  selectedGroupFilter,
  onGroupFilterSelect,
  onUpdateUserLabels,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
  onSaveLabelToPreset,
  getFilteredChatsByGroup
}) => {
  const [activeFilters, setActiveFilters] = useState(['all'])
  const [selectedPresets, setSelectedPresets] = useState([])
  const [showPresetModal, setShowPresetModal] = useState(false)
  const [showEditPresetModal, setShowEditPresetModal] = useState(false)
  const [editingPreset, setEditingPreset] = useState(null)
  const [showLabelsModal, setShowLabelsModal] = useState(false)
  const [selectedUserForLabels, setSelectedUserForLabels] = useState(null)
  const [showCreateLabelModal, setShowCreateLabelModal] = useState(false)
  const [showEditLabelModal, setShowEditLabelModal] = useState(false)
  const [editingLabel, setEditingLabel] = useState(null)
  const [isLabelsSectionCollapsed, setIsLabelsSectionCollapsed] = useState(false)
  const { t } = useTranslation(targetLanguage)


  // Обработка выбора фильтров
  const handleFilterToggle = (filter) => {
    setActiveFilters(prev => {
      // Если выбран "Все чаты", снимаем все остальные фильтры
      if (filter === 'all') {
        return ['all']
      }
      
      // Если "Все чаты" уже выбран, заменяем его на новый фильтр
      if (prev.includes('all')) {
        return [filter]
      }
      
      // Если фильтр уже выбран, убираем его
      if (prev.includes(filter)) {
        const newFilters = prev.filter(f => f !== filter)
        // Если не осталось фильтров, возвращаем "Все чаты"
        return newFilters.length === 0 ? ['all'] : newFilters
      }
      
      // Добавляем новый фильтр
      return [...prev, filter]
    })
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) {
      return t('now')
    } else if (minutes < 60) {
      return `${minutes}${t('minutesAgo')}`
    } else if (hours < 24) {
      return `${hours}${t('hoursAgo')}`
    } else if (days < 7) {
      return `${days}${t('daysAgo')}`
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    }
  }

  const getChatAvatar = (chat) => {
    // Все чаты теперь личные, находим пользователя-собеседника
      const participantId = chat.participants.find(id => id !== 1) // Исключаем текущего пользователя (id: 1)
      const user = users.find(u => u.id === participantId)
      return <Avatar style={{ backgroundColor: '#87d068' }}>{user?.avatar || '👤'}</Avatar>
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'amazon':
        return <AmazonOutlined style={{ color: '#ff9900', fontSize: '12px' }} />
      case 'instagram':
        return <InstagramOutlined style={{ color: '#e4405f', fontSize: '12px' }} />
      case 'email':
        return <MailOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
      case 'tiktok':
        return <TikTokOutlined style={{ color: '#000000', fontSize: '12px' }} />
      default:
        return null
    }
  }

  // Функция для получения названия бренда из последнего сообщения Amazon
  const getBrandName = (chat) => {
    if (chat.platform === 'amazon' && chat.messages && chat.messages.length > 0) {
      // Ищем последнее сообщение с brandName
      const lastMessageWithBrand = [...chat.messages]
        .reverse()
        .find(message => message.brandName)
      
      return lastMessageWithBrand ? lastMessageWithBrand.brandName : null
    }
    return null
  }

  const getPresetChannelIcon = (channels) => {
    if (!channels || channels.length === 0) return null
    
    if (channels.length === 1) {
      switch (channels[0]) {
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
    
    // Для множественных каналов показываем иконку множественного выбора
    return <span style={{ fontSize: '12px' }}>📱</span>
  }

  // Фильтрация чатов по множественным фильтрам
  const getFilteredChats = () => {
    // Сначала применяем фильтр группы, если выбрана группа
    let filteredChats = selectedGroupFilter && getFilteredChatsByGroup
      ? getFilteredChatsByGroup(selectedGroupFilter)
      : chats

    // Если выбран только "Все чаты", показываем только неархивные
    if (activeFilters.length === 1 && activeFilters.includes('all')) {
      filteredChats = filteredChats.filter(chat => !chat.isArchived)
    } else {
      // Применяем множественные фильтры
      const filters = activeFilters.filter(f => f !== 'all')
      
      if (filters.length > 0) {
        filteredChats = chats.filter(chat => {
          // Проверяем, соответствует ли чат хотя бы одному из активных фильтров
          return filters.some(filter => {
            switch (filter) {
              case 'favorites':
                return chat.isFavorite
              case 'archive':
                return chat.isArchived
              case 'unread':
                return chat.unreadCount > 0
              case 'amazon':
                return chat.platform === 'amazon'
              case 'instagram':
                return chat.platform === 'instagram'
              case 'email':
                return chat.platform === 'email'
              case 'tiktok':
                return chat.platform === 'tiktok'
              default:
                return false
            }
          })
        })
      }
    }

    // Дополнительная фильтрация по поиску
    let finalFiltered = filteredChats
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      finalFiltered = filteredChats.filter(chat => {
        // Поиск по имени чата
        if (chat.name.toLowerCase().includes(searchLower)) {
          return true
        }
        
        // Поиск по именам участников чата
        const participantNames = chat.participants.map(participantId => {
          // Для текущего пользователя используем currentUser
          if (participantId === currentUser?.id) {
            return currentUser.name.toLowerCase()
          }
          // Для других пользователей ищем в массиве users
          const user = users.find(u => u.id === participantId)
          return user?.name?.toLowerCase() || ''
        })
        
        if (participantNames.some(name => name.includes(searchLower))) {
          return true
        }
        
        // Поиск по содержимому всех сообщений в чате
        const hasMatchingMessage = chat.messages.some(message => 
          message.content.toLowerCase().includes(searchLower) ||
          message.senderName?.toLowerCase().includes(searchLower)
        )
        
        return hasMatchingMessage
      })
    }

    // Сортировка: закрепленные чаты сверху, затем обычные
    return finalFiltered.sort((a, b) => {
      // Если оба закреплены или оба не закреплены, сортируем по времени последнего сообщения
      if (a.isPinned === b.isPinned) {
        const aLastMessage = a.messages[a.messages.length - 1]
        const bLastMessage = b.messages[b.messages.length - 1]
        if (aLastMessage && bLastMessage) {
          return new Date(bLastMessage.timestamp) - new Date(aLastMessage.timestamp)
        }
        return 0
      }
      // Закрепленные чаты всегда сверху
      return b.isPinned - a.isPinned
    })
  }

  const filteredChats = getFilteredChats()

  // Функция для создания нового ярлыка
  const handleCreateLabel = (newLabel) => {
    if (onCreateLabel) {
      onCreateLabel(newLabel)
    }
  }

  // Функция для редактирования ярлыка
  const handleEditLabel = (label) => {
    setEditingLabel(label)
    setShowEditLabelModal(true)
  }

  // Функция для сохранения изменений ярлыка
  const handleUpdateLabel = (updatedLabel) => {
    if (onUpdateLabel) {
      onUpdateLabel(updatedLabel)
    }
    setShowEditLabelModal(false)
    setEditingLabel(null)
  }

  // Функция для удаления ярлыка
  const handleDeleteLabel = (labelId) => {
    if (onDeleteLabel) {
      onDeleteLabel(labelId)
    }
  }

  // Функция для сохранения ярлыка в пресет
  const handleSaveLabelToPreset = (labelId, presetId) => {
    if (onSaveLabelToPreset) {
      onSaveLabelToPreset(labelId, presetId)
    }
  }

  // Функция для переключения состояния сворачивания раздела ярлыков
  const toggleLabelsSection = () => {
    setIsLabelsSectionCollapsed(!isLabelsSectionCollapsed)
  }

  // Функция для редактирования пресета
  const handleEditPreset = (preset) => {
    setEditingPreset(preset)
    setShowEditPresetModal(true)
  }

  // Функция для сброса к дефолтным настройкам
  const handleResetToDefault = () => {
    // Сбрасываем выбранные пресеты
    setSelectedPresets([])
    if (onPresetSelect) {
      onPresetSelect(null)
    }
  }

  // Функция для переключения выбора пресета
  const handlePresetToggle = (presetId) => {
    setSelectedPresets(prev => {
      if (prev.includes(presetId)) {
        // Убираем пресет из выбранных
        const newSelected = prev.filter(id => id !== presetId)
        // Если больше нет выбранных пресетов, сбрасываем в App
        if (newSelected.length === 0 && onPresetSelect) {
          onPresetSelect(null)
        }
        return newSelected
      } else {
        // Добавляем пресет к выбранным
        const newSelected = [...prev, presetId]
        // Уведомляем App о выборе (можно передать массив ID или первый выбранный)
        if (onPresetSelect) {
          onPresetSelect(newSelected[0]) // Пока передаем первый для совместимости
        }
        return newSelected
      }
    })
  }

  return (
    <Sider width={400} className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <MessageOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
          <Text strong style={{ fontSize: '18px' }}>{t('chats')}</Text>
        </div>
          <Button 
            type="text"
            icon={<SettingOutlined />}
            onClick={onShowProfileSettings}
            size="small"
          />
      </div>
      
      <div className="search-container">
        <Input
          placeholder={t('searchChats')}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={onSearchReset}
          allowClear
          size="small"
        />
      </div>

      
      <div style={{ padding: '0 16px 16px 16px' }} className="preset-dropdown">
        <Dropdown
          overlayClassName="preset-dropdown-overlay"
          destroyPopupOnHide={false}
          menu={{
            items: [
              {
                key: 'reset',
                label: (
                  <Space style={{ paddingLeft: '12px' }}>
                    <span>{t('resetToDefault')}</span>
                  </Space>
                ),
                onClick: handleResetToDefault
              },
              {
                type: 'divider'
              },
              ...presets.map(preset => ({
                key: preset.id,
                label: (
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      width: '100%', /* stretch to full menu width */
                      backgroundColor: selectedPresets.includes(preset.id) ? '#e6f7ff' : 'transparent',
                      padding: '4px 12px',
                      borderRadius: '0',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePresetToggle(preset.id)
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                      {getPresetChannelIcon(preset.channel)}
                      <span style={{ 
                        color: selectedPresets.includes(preset.id) ? '#1890ff' : 'inherit',
                        fontWeight: selectedPresets.includes(preset.id) ? 'bold' : 'normal'
                      }}>
                        {preset.name}
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2px', 
                      flexShrink: 0,
                      marginLeft: 'auto'
                    }}>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditPreset(preset)
                        }}
                        style={{ 
                          color: '#1890ff',
                          width: '24px',
                          height: '24px',
                          minWidth: '24px',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={t('editPreset')}
                      />
                    <Popconfirm
                      title={t('deletePreset')}
                      description={t('confirmDeletePresetMessage')}
                      onConfirm={() => onDeletePreset(preset.id)}
                      okText={t('yes')}
                      cancelText={t('no')}
                      icon={<ExclamationCircleOutlined style={{ color: '#ff8c00' }} />}
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                          style={{ 
                            color: '#ff4d4f',
                            width: '24px',
                            height: '24px',
                            minWidth: '24px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                      />
                    </Popconfirm>
                    </div>
                  </div>
                )
              })),
              {
                type: 'divider'
              },
              {
                key: 'add',
                  label: (
                    <Space>
                      <PlusOutlined />
                      <span>{t('addPreset')}</span>
                    </Space>
                  ),
                onClick: () => setShowPresetModal(true)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button 
            size="small"
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              justifyContent: 'space-between',
              height: '30px',
              borderRadius: '20px',
              border: '1px solid #d9d9d9',
              padding: '4px 12px',
              position: 'relative'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              flexWrap: 'wrap',
              maxWidth: 'calc(100% - 28px)', /* reserve space for 12px icon + spacing */
              overflow: 'hidden'
            }}>
              {selectedPresets.length > 0 ? (
                <>
                  {selectedPresets.slice(0, 2).map(presetId => {
                    const preset = presets.find(p => p.id === presetId)
                    if (!preset) return null
                    return (
                      <div
                        key={presetId}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#ffffff',
                          border: '1px solid #d9d9d9',
                          borderRadius: '12px',
                          padding: '2px 6px',
                          fontSize: '11px',
                          height: '20px',
                          maxWidth: '120px',
                          overflow: 'hidden'
                        }}
                      >
                        {getPresetChannelIcon(preset.channels)}
                        <span style={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {preset.name}
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePresetToggle(presetId)
                          }}
                          style={{ 
                            cursor: 'pointer', 
                            marginLeft: '2px',
                            fontSize: '12px',
                            color: '#999'
                          }}
                        >
                          ×
                        </span>
                      </div>
                    )
                  })}
                  {selectedPresets.length > 2 && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#f0f0f0',
                        border: '1px solid #d9d9d9',
                        borderRadius: '12px',
                        padding: '2px 6px',
                        fontSize: '11px',
                        height: '20px',
                        color: '#666'
                      }}
                    >
                      +{selectedPresets.length - 2}
                    </div>
                  )}
                </>
              ) : (
                <span style={{ color: '#999' }}>{t('selectPreset')}</span>
              )}
            </div>
            <DownOutlined style={{ fontSize: '12px', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />
          </Button>
        </Dropdown>
      </div>
      
      <div className="chat-sections">


        {/* Секция "Ярлыки" */}
        {groups && groups.length > 0 && (
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div className={`labels-section ${isLabelsSectionCollapsed ? 'collapsed' : ''}`}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: isLabelsSectionCollapsed ? '0' : '10px',
              height: isLabelsSectionCollapsed ? '20px' : 'auto',
              width: '100%',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => setShowCreateLabelModal(true)}
                  style={{
                    color: '#1890ff',
                    fontSize: '12px',
                    height: '20px',
                    padding: '0 4px'
                  }}
                  title={t('createNewLabel')}
                />
                <Text className="labels-section-title" style={{ marginBottom: 0 }}>
                  {t('labels')}
                </Text>
              </div>
              <div style={{ flex: '1', minWidth: '0' }}></div>
              <Button
                type="text"
                size="small"
                icon={isLabelsSectionCollapsed ? <DownOutlined style={{ fontSize: '12px' }} /> : <UpOutlined style={{ fontSize: '12px' }} />}
                onClick={toggleLabelsSection}
                style={{
                  color: '#666',
                  fontSize: '12px',
                  height: '20px',
                  padding: 0,
                  flex: '0 0 auto',
                  position: 'absolute',
                  right: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
                title={isLabelsSectionCollapsed ? t('expandLabels') : t('collapseLabels')}
              />
            </div>
            {!isLabelsSectionCollapsed && (
              <div className="labels-buttons-container">
              {groups.map(group => (
                <div
                  key={group.id}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    marginBottom: '4px'
                  }}
                  className="label-button-wrapper"
                >
                  <Button
                    type={selectedGroupFilter?.id === group.id ? 'primary' : 'default'}
                    size="small"
                    onClick={() => onGroupFilterSelect(selectedGroupFilter?.id === group.id ? null : group)}
                    className="label-button"
                    style={{
                      paddingRight: '24px' // Место для иконки меню
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        backgroundColor: group.color || '#1890ff',
                        marginRight: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span
                        style={{
                          color: group.textColor || '#ffffff',
                          fontSize: '8px',
                          fontWeight: 'bold'
                        }}
                      >
                        {group.name?.charAt(0)?.toUpperCase() || 'Я'}
                      </span>
                    </div>
                    {group.name}
                  </Button>
                  
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'edit',
                          label: (
                            <Space>
                              <EditOutlined />
                              {t('editLabel')}
                            </Space>
                          ),
                          onClick: () => handleEditLabel(group)
                        },
                        {
                          key: 'saveToPreset',
                          label: (
                            <Space>
                              <PlusOutlined />
                              {t('saveToPreset')}
                            </Space>
                          ),
                          children: presets.map(preset => ({
                            key: `preset-${preset.id}`,
                            label: preset.name,
                            onClick: () => handleSaveLabelToPreset(group.id, preset.id)
                          }))
                        },
                        {
                          key: 'delete',
                          label: (
                            <Popconfirm
                              title={t('deleteLabel')}
                              description={t('confirmDeleteLabel')}
                              onConfirm={() => handleDeleteLabel(group.id)}
                              okText={t('yes')}
                              cancelText={t('no')}
                              icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                            >
                              <Space>
                                <DeleteOutlined />
                                {t('deleteLabel')}
                              </Space>
                            </Popconfirm>
                          ),
                          onClick: (e) => e.preventDefault() // Предотвращаем закрытие меню
                        }
                      ]
                    }}
                    trigger={['click']}
                    placement="bottomLeft"
                    align={{ offset: [0, 4] }}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<MoreOutlined />}
                      style={{
                        position: 'absolute',
                        right: '2px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        opacity: 0,
                        transition: 'opacity 0.2s ease'
                      }}
                      className="label-menu-button"
                    />
                  </Dropdown>
                </div>
              ))}
            </div>
            )}
            </div>
          </div>
        )}

        <div className="section-buttons">
          <Button 
            type={activeFilters.includes('all') ? 'primary' : 'text'}
            onClick={() => handleFilterToggle('all')}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            {t('allChats')}
          </Button>
          <Button 
            type={activeFilters.includes('favorites') ? 'primary' : 'text'}
            onClick={() => handleFilterToggle('favorites')}
            icon={<StarOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            {t('favorites')}
          </Button>
          <Button 
            type={activeFilters.includes('unread') ? 'primary' : 'text'}
            onClick={() => handleFilterToggle('unread')}
            icon={<BellOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            {t('unread')}
          </Button>
          <Button 
            type={activeFilters.includes('amazon') ? 'primary' : 'text'}
            onClick={() => handleFilterToggle('amazon')}
            icon={<AmazonOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            Amazon
          </Button>
          <Button 
            type={activeFilters.includes('instagram') ? 'primary' : 'text'}
            onClick={() => handleFilterToggle('instagram')}
            icon={<InstagramOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            Instagram
          </Button>
          <Button 
            type={activeFilters.includes('email') ? 'primary' : 'text'}
            onClick={() => handleFilterToggle('email')}
            icon={<MailOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            Email
          </Button>
          <Button 
            type={activeFilters.includes('tiktok') ? 'primary' : 'text'}
            onClick={() => handleFilterToggle('tiktok')}
            icon={<TikTokOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            TikTok
          </Button>
          <Button 
            type={activeFilters.includes('archive') ? 'primary' : 'text'}
            onClick={() => handleFilterToggle('archive')}
            icon={<InboxOutlined />}
            style={{ marginBottom: '4px' }}
          >
            {t('archive')}
          </Button>
      </div>
      
      <div className="chat-list">
          <List
            dataSource={filteredChats}
            renderItem={(chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1]
          const lastMessageTime = lastMessage ? formatTime(lastMessage.timestamp) : ''
          const lastMessageText = lastMessage ? lastMessage.content : 'Нет сообщений'
          
          return (
                <List.Item
              key={chat.id}
                  className={`chat-item ${currentChatId === chat.id ? 'active' : ''} ${chat.isArchived ? 'archived' : ''}`}
                >
                  <List.Item.Meta
                    avatar={getChatAvatar(chat)}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                          <Text 
                            strong 
                            style={{ 
                              fontSize: '14px', 
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '120px'
                            }}
              onClick={() => onChatSelect(chat.id, searchTerm)}
            >
                            {chat.name}
                          </Text>
                          {getPlatformIcon(chat.platform)}
                          {chat.platform === 'amazon' && getBrandName(chat) && (
                            <Tag 
                              size="small" 
                              color="orange" 
                              style={{ fontSize: '10px', margin: 0, padding: '0 4px' }}
                            >
                              {getBrandName(chat)}
                            </Tag>
                          )}
              </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>{lastMessageTime}</Text>
                {chat.unreadCount > 0 && (
                            <Badge count={chat.unreadCount} size="small" />
                )}
              </div>
            </div>
                    }
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Text
                          type="secondary" 
                          style={{ 
                            fontSize: '12px', 
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginRight: '8px'
                          }}
                          onClick={() => onChatSelect(chat.id, searchTerm)}
                        >
                          {lastMessageText}
                        </Text>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <Tooltip title={chat.isFavorite ? t('removeFromFavorites') : t('addToFavorites')}>
                            <Button
                              type="text"
                              size="small"
                              icon={chat.isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                              onClick={(e) => {
                                e.stopPropagation()
                                onToggleFavorite(chat.id)
                              }}
                            />
                          </Tooltip>
                          <Tooltip title={chat.isPinned ? t('unpinChat') : t('pinChat')}>
                            <Button
                              type="text"
                              size="small"
                              icon={<PushpinOutlined style={{ color: chat.isPinned ? '#1890ff' : undefined }} />}
                              onClick={(e) => {
                                e.stopPropagation()
                                onTogglePin(chat.id)
                              }}
                            />
                          </Tooltip>
                          <Tooltip title={chat.isArchived ? t('returnFromArchive') : t('moveToArchive')}>
                            <Button
                              type="text"
                              size="small"
                              icon={chat.isArchived ? <FileZipFilled style={{ color: '#52c41a' }} /> : <InboxOutlined />}
                              onClick={(e) => {
                                e.stopPropagation()
                                onToggleArchive(chat.id)
                              }}
                            />
                          </Tooltip>
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: 'manageLabels',
                                  label: (
                                    <Space>
                                      <TagOutlined />
                                      {t('manageLabels')}
                                    </Space>
                                  ),
                                  onClick: () => {
                                    const participantId = chat.participants.find(id => id !== currentUser.id)
                                    const participant = users.find(u => u.id === participantId)
                                    if (participant) {
                                      setSelectedUserForLabels(participant)
                                      setShowLabelsModal(true)
                                    }
                                  }
                                },
                                {
                                  key: 'saveToPreset',
                                  label: (
                                    <Space>
                                      <PlusOutlined />
                                      {t('saveToPreset')}
                                    </Space>
                                  ),
                                  children: presets.map(preset => ({
                                    key: `preset-${preset.id}`,
                                    label: preset.name,
                                    onClick: () => {
                                      const participantId = chat.participants.find(id => id !== currentUser.id)
                                      if (participantId) {
                                        handleSaveLabelToPreset(participantId, preset.id)
                                      }
                                    }
                                  }))
                                }
                              ]
                            }}
                            trigger={['click']}
                            placement="bottomLeft"
                            align={{ offset: [0, 4] }}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                color: '#666'
                              }}
                            />
                          </Dropdown>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )
            }}
          />
        </div>
      </div>

      {showPresetModal && (
        <PresetModal
          visible={showPresetModal}
          onClose={() => setShowPresetModal(false)}
          onCreatePreset={onCreatePreset}
          stores={stores}
          emails={emails}
          labels={labels}
          targetLanguage={targetLanguage}
        />
      )}

      {showLabelsModal && selectedUserForLabels && (
        <UserLabelsModal
          visible={showLabelsModal}
          onClose={() => {
            setShowLabelsModal(false)
            setSelectedUserForLabels(null)
          }}
          user={selectedUserForLabels}
          availableLabels={labels}
          onUpdateLabels={onUpdateUserLabels}
          targetLanguage={targetLanguage}
        />
      )}

      {showCreateLabelModal && (
        <LabelFormModal
          visible={showCreateLabelModal}
          onClose={() => setShowCreateLabelModal(false)}
          onSave={handleCreateLabel}
          targetLanguage={targetLanguage}
          isEdit={false}
        />
      )}

      {showEditLabelModal && editingLabel && (
        <LabelFormModal
          visible={showEditLabelModal}
          onClose={() => {
            setShowEditLabelModal(false)
            setEditingLabel(null)
          }}
          onSave={handleUpdateLabel}
          targetLanguage={targetLanguage}
          initialValues={editingLabel}
          isEdit={true}
        />
      )}

      {showEditPresetModal && editingPreset && (
        <PresetModal
          visible={showEditPresetModal}
          onClose={() => {
            setShowEditPresetModal(false)
            setEditingPreset(null)
          }}
          onCreatePreset={onCreatePreset}
          stores={stores}
          emails={emails}
          labels={labels}
          targetLanguage={targetLanguage}
          initialValues={editingPreset}
          isEdit={true}
        />
      )}

    </Sider>
  )
}

export default Sidebar
