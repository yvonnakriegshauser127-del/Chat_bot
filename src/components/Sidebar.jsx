import React, { useState } from 'react'
import { Layout, Input, Button, List, Avatar, Typography, Badge, Collapse, Tooltip, Dropdown, Space, Tag, Modal, Popconfirm } from 'antd'
import { SearchOutlined, PlusOutlined, MessageOutlined, TeamOutlined, StarOutlined, StarFilled, FileZipOutlined, BellOutlined, AmazonOutlined, InstagramOutlined, MailOutlined, TikTokOutlined, DownOutlined, UpOutlined, DeleteOutlined, PushpinOutlined, SettingOutlined, ExclamationCircleOutlined, TagOutlined, MoreOutlined, EditOutlined } from '@ant-design/icons'
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
  getFilteredChatsByGroup,
  userMatchesGroupFilter
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
  const [presetDropdownVisible, setPresetDropdownVisible] = useState(false)
  const [isLabelsSectionCollapsed, setIsLabelsSectionCollapsed] = useState(false)
  const [selectedLabelFilters, setSelectedLabelFilters] = useState([])
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth')
    return saved ? parseInt(saved) : 400
  })
  const { t } = useTranslation(targetLanguage)

  // Функция для получения фильтров из выбранных пресетов
  const getFiltersFromPresets = () => {
    if (selectedPresets.length === 0) return { channels: [], labels: [] }
    
    const presetChannels = []
    const presetLabels = []
    
    selectedPresets.forEach(presetId => {
      const preset = presets.find(p => p.id === presetId)
      if (preset) {
        if (preset.channels && preset.channels.length > 0) {
          presetChannels.push(...preset.channels)
        }
        if (preset.labels && preset.labels.length > 0) {
          presetLabels.push(...preset.labels)
        }
      }
    })
    
    return {
      channels: [...new Set(presetChannels)], // убираем дубликаты
      labels: [...new Set(presetLabels)] // убираем дубликаты
    }
  }

  // Функция для изменения ширины сайдбара
  const handleSidebarResize = (newWidth) => {
    const minWidth = 400
    const clampedWidth = Math.max(minWidth, newWidth)
    setSidebarWidth(clampedWidth)
    // Сохраняем новую ширину в localStorage
    localStorage.setItem('sidebarWidth', clampedWidth.toString())
  }

  // Обработка выбора фильтров
  const handleFilterToggle = (filter) => {
    setActiveFilters(prev => {
      // Если выбран "Все чаты", снимаем все остальные фильтры
      if (filter === 'all') {
        // Также сбрасываем фильтр ярлыков
        if (onGroupFilterSelect) {
          onGroupFilterSelect(null)
        }
        return ['all']
      }
      
      // Если фильтр уже выбран, убираем его
      if (prev.includes(filter)) {
        const newFilters = prev.filter(f => f !== filter)
        // Если остались только 'all' или вообще ничего, возвращаем ['all']
        const nonAllFilters = newFilters.filter(f => f !== 'all')
        return nonAllFilters.length === 0 ? ['all'] : newFilters
      }
      
      // Если "Все чаты" уже выбран и нет других фильтров, заменяем его на новый фильтр
      if (prev.includes('all') && prev.length === 1) {
        return [filter]
      }
      
      // Добавляем новый фильтр (сохраняем 'all' если он есть)
      return [...prev, filter]
    })
  }

  const formatTime = (date) => {
    // Проверяем, что date существует и преобразуем в объект Date
    if (!date) return t('now')
    
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Проверяем, что дата валидна
    if (isNaN(dateObj.getTime())) return t('now')
    
    const now = new Date()
    const diff = now - dateObj
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
      return dateObj.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
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

    // Применяем фильтр пресета, если выбран пресет И есть активные фильтры
    if (selectedPresets.length > 0 && !activeFilters.includes('all')) {
      // Получаем фильтры из пресетов
      const presetFilters = getFiltersFromPresets()
      
      // Собираем все критерии из всех выбранных пресетов (включая stores и emails)
      const allStores = []
      const allEmails = []

      selectedPresets.forEach(presetId => {
        const preset = presets.find(p => p.id === presetId)
        if (preset) {
          if (preset.stores && preset.stores.length > 0) {
            allStores.push(...preset.stores)
          }
          if (preset.emails && preset.emails.length > 0) {
            allEmails.push(...preset.emails)
          }
        }
      })

      // Убираем дубликаты
      const uniqueStores = [...new Set(allStores)]
      const uniqueEmails = [...new Set(allEmails)]

      // Фильтруем чаты по собранным критериям
      filteredChats = filteredChats.filter(chat => {
        const matches = []

        // Проверяем соответствие каналам (используем фильтры из пресетов)
        if (presetFilters.channels.length > 0) {
          matches.push(presetFilters.channels.includes(chat.platform))
        }

        // Проверяем соответствие магазинам
        if (uniqueStores.length > 0) {
          matches.push(chat.brandName && uniqueStores.includes(chat.brandName))
        }

        // Проверяем соответствие email адресам
        if (uniqueEmails.length > 0) {
          matches.push(chat.email && uniqueEmails.includes(chat.email))
        }

        // Проверяем соответствие ярлыкам пользователя (используем фильтры из пресетов)
        if (presetFilters.labels.length > 0) {
          const hasMatchingLabel = chat.participants.some(participantId => {
            const user = users.find(u => u.id === participantId)
            return user && user.labels && presetFilters.labels.some(labelId => 
              user.labels.includes(labelId)
            )
          })
          matches.push(hasMatchingLabel)
        }

        // Если нет критериев в выбранных пресетах, чат не соответствует
        if (matches.length === 0) return false

        // Чат соответствует, если соответствует хотя бы одному критерию
        return matches.some(match => match)
      })
    }

    // Обрабатываем все фильтры
    const filters = activeFilters.filter(f => f !== 'all')
    
    if (filters.length > 0) {
      // Разделяем фильтры на группы
      const platformFilters = filters.filter(filter => 
        ['amazon', 'instagram', 'email', 'tiktok'].includes(filter)
      )
      const statusFilters = filters.filter(filter => 
        ['favorites', 'archive', 'unread'].includes(filter)
      )
      
      filteredChats = filteredChats.filter(chat => {
        const matches = []
        
        // Проверяем соответствие фильтрам платформ
        if (platformFilters.length > 0) {
          const matchesPlatform = platformFilters.some(filter => {
            switch (filter) {
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
          matches.push(matchesPlatform)
        }
        
        // Проверяем соответствие статусным фильтрам
        if (statusFilters.length > 0) {
          const matchesStatus = statusFilters.some(filter => {
            switch (filter) {
              case 'favorites':
                return chat.isFavorite
              case 'archive':
                return chat.isArchived
              case 'unread':
                return chat.unreadCount > 0
              default:
                return false
            }
          })
          matches.push(matchesStatus)
        }
        
        // Проверяем соответствие фильтрам по ярлыкам (если выбраны)
        if (selectedLabelFilters.length > 0) {
          const participantId = chat.participants.find(id => id !== 1) // Исключаем текущего пользователя
          const participant = users.find(u => u.id === participantId)
          if (participant) {
            // Проверяем, соответствует ли пользователь хотя бы одному из выбранных ярлыков
            const matchesAnyLabel = selectedLabelFilters.some(labelFilter => 
              userMatchesGroupFilter(participant, labelFilter)
            )
            matches.push(matchesAnyLabel)
          }
        }
        
        // Если нет активных фильтров, чат не соответствует
        if (matches.length === 0) return false
        
        // Чат соответствует, если соответствует хотя бы одному типу фильтров (логика ИЛИ)
        return matches.some(match => match)
      })
    } else if (activeFilters.includes('all')) {
      // Если только "Все чаты", показываем только неархивные чаты
      filteredChats = filteredChats.filter(chat => !chat.isArchived)
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
    setPresetDropdownVisible(false) // Закрываем дропдаун
  }

  // Функция для сброса к дефолтным настройкам
  const handleResetToDefault = () => {
    // Сбрасываем выбранные пресеты
    setSelectedPresets([])
    if (onPresetSelect) {
      onPresetSelect(null)
    }
    // Сбрасываем все фильтры
    setActiveFilters(['all'])
    setSelectedLabelFilters([])
    if (onGroupFilterSelect) {
      onGroupFilterSelect(null)
    }
  }

  // Функция для переключения выбора пресета
  const handlePresetToggle = (presetId) => {
    const isCurrentlySelected = selectedPresets.includes(presetId)
    
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
    
    // Применяем фильтры на основе нового состояния выбранных пресетов
    const newSelectedPresets = isCurrentlySelected 
      ? selectedPresets.filter(id => id !== presetId) // Убираем текущий пресет
      : [...selectedPresets, presetId] // Добавляем текущий пресет
    
    if (newSelectedPresets.length > 0) {
      // Собираем все каналы из всех выбранных пресетов
      const allPresetChannels = []
      const allPresetLabels = []
      
      // Добавляем каналы и ярлыки из всех выбранных пресетов
      newSelectedPresets.forEach(id => {
        const preset = presets.find(p => p.id === id)
        if (preset) {
          if (preset.channels && preset.channels.length > 0) {
            allPresetChannels.push(...preset.channels)
          }
          if (preset.labels && preset.labels.length > 0) {
            allPresetLabels.push(...preset.labels)
          }
        }
      })
      
      // Убираем дубликаты
      const uniqueChannels = [...new Set(allPresetChannels)]
      const uniqueLabels = [...new Set(allPresetLabels)]
      
      // Устанавливаем фильтры каналов
      // Если есть фильтры из пресета, не добавляем 'all'
      const newActiveFilters = uniqueChannels.length > 0 
        ? uniqueChannels 
        : ['all']
      setActiveFilters(newActiveFilters)
      
      // Устанавливаем фильтр ярлыков из пресета
      if (uniqueLabels.length > 0) {
        // Находим соответствующие групповые фильтры для ярлыков из пресета
        const presetLabelFilters = groups.filter(group => 
          group.conditions && group.conditions.labels && 
          group.conditions.labels.some(labelId => uniqueLabels.includes(labelId))
        )
        
        // Устанавливаем выбранные ярлыки из пресета
        setSelectedLabelFilters(presetLabelFilters)
        
        // Создаем виртуальный групповой фильтр для всех ярлыков из пресета
        const virtualGroupFilter = {
          id: 'preset-labels',
          name: `Пресет (${uniqueLabels.length} ярлыков)`,
          description: `Ярлыки из пресета: ${uniqueLabels.join(', ')}`,
          color: '#1890ff',
          textColor: '#ffffff',
          conditions: {
            labels: uniqueLabels,
            matchType: 'any' // Пользователь должен иметь хотя бы один из ярлыков
          }
        }
        if (onGroupFilterSelect) {
          onGroupFilterSelect(virtualGroupFilter)
        }
      } else {
        // Сбрасываем выбранные ярлыки если в пресете их нет
        setSelectedLabelFilters([])
        if (onGroupFilterSelect) {
          onGroupFilterSelect(null)
        }
      }
    } else {
      // Если нет выбранных пресетов, сбрасываем все фильтры
      setActiveFilters(['all'])
      setSelectedLabelFilters([])
      if (onGroupFilterSelect) {
        onGroupFilterSelect(null)
      }
    }
  }

  return (
    <Sider width={sidebarWidth} className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <MessageOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
          <Text strong style={{ fontSize: '18px' }}>{t('chats')}</Text>
        </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button 
              type="text"
              icon={<SettingOutlined />}
              onClick={onShowProfileSettings}
              size="small"
              title={t('profileSettings')}
            />
          </div>
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
          destroyOnHidden={false}
          open={presetDropdownVisible}
          onOpenChange={setPresetDropdownVisible}
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
                      onCancel={(e) => e?.stopPropagation()}
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
                onClick: () => {
                  setShowPresetModal(true)
                  setPresetDropdownVisible(false)
                }
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
              {groups.map(group => {
                const isSelected = selectedLabelFilters.some(filter => filter.id === group.id)
                
                const handleLabelClick = () => {
                  // Переключение множественного выбора ярлыков
                  setSelectedLabelFilters(prev => {
                    if (prev.some(filter => filter.id === group.id)) {
                      // Убираем ярлык из выбранных
                      const newFilters = prev.filter(filter => filter.id !== group.id)
                      // Если больше нет выбранных ярлыков, сбрасываем в App
                      if (newFilters.length === 0 && onGroupFilterSelect) {
                        onGroupFilterSelect(null)
                      }
                      return newFilters
                    } else {
                      // Добавляем ярлык к выбранным
                      const newFilters = [...prev, group]
                      // Уведомляем App о выборе (передаем виртуальный фильтр для множественных ярлыков)
                      if (onGroupFilterSelect) {
                        const virtualGroupFilter = {
                          id: 'multiple-labels',
                          name: `Ярлыки (${newFilters.length})`,
                          description: `Выбранные ярлыки: ${newFilters.map(f => f.name).join(', ')}`,
                          color: '#1890ff',
                          textColor: '#ffffff',
                          conditions: {
                            labels: newFilters.flatMap(f => f.conditions.labels),
                            matchType: 'any'
                          }
                        }
                        onGroupFilterSelect(virtualGroupFilter)
                      }
                      return newFilters
                    }
                  })
                }
                
                return (
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
                    type={isSelected ? 'primary' : 'default'}
                    size="small"
                    onClick={handleLabelClick}
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
                )
              })}
            </div>
            )}
          </div>
          </div>
        )}

        <div className="section-buttons">
          {/* Первая строка - статусные фильтры */}
          <div style={{ marginBottom: '8px' }}>
            <Button 
              type={activeFilters.includes('all') ? 'primary' : 'text'}
              onClick={() => handleFilterToggle('all')}
              style={{ marginRight: '4px' }}
            >
              {t('allChats')}
            </Button>
            <Tooltip title={t('favorites')}>
              <Button 
                type={activeFilters.includes('favorites') ? 'primary' : 'text'}
                onClick={() => handleFilterToggle('favorites')}
                icon={<StarOutlined />}
                style={{ marginRight: '4px' }}
              />
            </Tooltip>
            <Tooltip title={t('unread')}>
              <Button 
                type={activeFilters.includes('unread') ? 'primary' : 'text'}
                onClick={() => handleFilterToggle('unread')}
                icon={<BellOutlined />}
                style={{ marginRight: '4px' }}
              />
            </Tooltip>
            <Tooltip title={t('archive')}>
              <Button 
                type={activeFilters.includes('archive') ? 'primary' : 'text'}
                onClick={() => handleFilterToggle('archive')}
                icon={<FileZipOutlined />}
                style={{ marginRight: '4px' }}
              />
            </Tooltip>
          </div>
          
          {/* Вторая строка - платформенные фильтры */}
          <div>
            <Button 
              type={activeFilters.includes('amazon') ? 'primary' : 'text'}
              onClick={() => handleFilterToggle('amazon')}
              icon={<AmazonOutlined />}
              style={{ marginRight: '4px' }}
            >
              Amazon
            </Button>
            <Button 
              type={activeFilters.includes('instagram') ? 'primary' : 'text'}
              onClick={() => handleFilterToggle('instagram')}
              icon={<InstagramOutlined />}
              style={{ marginRight: '4px' }}
            >
              Instagram
            </Button>
            <Button 
              type={activeFilters.includes('email') ? 'primary' : 'text'}
              onClick={() => handleFilterToggle('email')}
              icon={<MailOutlined />}
              style={{ marginRight: '4px' }}
            >
              Email
            </Button>
            <Button 
              type={activeFilters.includes('tiktok') ? 'primary' : 'text'}
              onClick={() => handleFilterToggle('tiktok')}
              icon={<TikTokOutlined />}
              style={{ marginRight: '4px' }}
            >
              TikTok
            </Button>
          </div>
      </div>
      
      <div className="chat-list">
          <List
            dataSource={filteredChats}
            renderItem={(chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1]
          const lastMessageTime = lastMessage && lastMessage.timestamp ? formatTime(lastMessage.timestamp) : ''
          const lastMessageText = lastMessage ? lastMessage.content : 'Нет сообщений'
          
          return (
                <List.Item
              key={chat.id}
                  className={`chat-item ${currentChatId === chat.id ? 'active' : ''} ${chat.isArchived ? 'archived' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onChatSelect(chat.id, searchTerm)}
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
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '120px'
                            }}
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
                            {chat.isArchived ? (
                              <Button
                                type="text"
                                size="small"
                                icon={<FileZipOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onToggleArchive(chat.id)
                                }}
                              />
                            ) : (
                              <Popconfirm
                                title={t('confirmArchiveChat')}
                                description={t('confirmArchiveChatMessage')}
                                onConfirm={() => onToggleArchive(chat.id)}
                                onCancel={(e) => e?.stopPropagation()}
                                okText={t('yes')}
                                cancelText={t('no')}
                                icon={<ExclamationCircleOutlined style={{ color: '#ff8c00' }} />}
                              >
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<FileZipOutlined />}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </Popconfirm>
                            )}
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

      {/* Обработчик изменения размера сайдбара */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: -5,
          width: 10,
          height: '100%',
          cursor: 'col-resize',
          zIndex: 1000,
          background: 'transparent'
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          const startX = e.clientX
          const startWidth = sidebarWidth

          const handleMouseMove = (e) => {
            const newWidth = startWidth + (e.clientX - startX)
            handleSidebarResize(newWidth)
          }

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
          }

          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
        }}
      />

    </Sider>
  )
}

export default Sidebar
