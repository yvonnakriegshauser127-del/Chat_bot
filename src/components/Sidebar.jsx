import React, { useState } from 'react'
import { Layout, Input, Button, List, Avatar, Typography, Badge, Collapse, Tooltip, Dropdown, Space, Tag, Modal, Popconfirm } from 'antd'
import { SearchOutlined, PlusOutlined, MessageOutlined, TeamOutlined, StarOutlined, StarFilled, InboxOutlined, FileZipFilled, BellOutlined, AmazonOutlined, InstagramOutlined, MailOutlined, TikTokOutlined, DownOutlined, DeleteOutlined, PushpinOutlined, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import PresetModal from './PresetModal'
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
  currentUser
}) => {
  const [activeFilters, setActiveFilters] = useState(['all'])
  const [showPresetModal, setShowPresetModal] = useState(false)
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
    if (chat.type === 'private') {
      // Находим пользователя для личного чата
      const participantId = chat.participants.find(id => id !== 1) // Исключаем текущего пользователя (id: 1)
      const user = users.find(u => u.id === participantId)
      return <Avatar style={{ backgroundColor: '#87d068' }}>{user?.avatar || '👤'}</Avatar>
    } else {
      // Для групп показываем загруженную аватарку или иконку команды
      return (
        <Avatar 
          src={chat.avatar}
          icon={!chat.avatar && <TeamOutlined />} 
          style={{ backgroundColor: '#52c41a' }} 
        />
      )
    }
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
    let filteredChats = chats

    // Если выбран только "Все чаты", показываем только неархивные
    if (activeFilters.length === 1 && activeFilters.includes('all')) {
      filteredChats = chats.filter(chat => !chat.isArchived)
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

  return (
    <Sider width={300} className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <MessageOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
          <Text strong style={{ fontSize: '18px' }}>{t('chats')}</Text>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={onNewChat}
            size="small"
          />
          <Button 
            type="text"
            icon={<SettingOutlined />}
            onClick={onShowProfileSettings}
            size="small"
          />
        </Space>
      </div>
      
      <div style={{ padding: '0 16px 16px 16px' }}>
        <Input
          placeholder={t('searchChats')}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={onSearchReset}
          allowClear
          size="small"
          style={{ width: '100%', marginBottom: '8px' }}
        />
      </div>

      
      <div style={{ padding: '0 16px 16px 16px' }}>
        <Dropdown
          menu={{
            items: [
              ...presets.map(preset => ({
                key: preset.id,
                label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '200px' }}>
                    <Space>
                      {getPresetChannelIcon(preset.channel)}
                      <span>{preset.name}</span>
                    </Space>
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
                        style={{ color: '#ff4d4f' }}
                      />
                    </Popconfirm>
                  </div>
                ),
                onClick: () => onPresetSelect(preset.id)
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
              height: '24px'
            }}
          >
            <Space>
              {selectedPreset ? (
                <>
                  {getPresetChannelIcon(selectedPreset.channels)}
                  <span>{selectedPreset.name}</span>
                </>
              ) : (
                <span>{t('selectPreset')}</span>
              )}
            </Space>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      
      <div className="chat-sections">

        {/* Отображение активных фильтров */}
        {activeFilters.length > 1 || (activeFilters.length === 1 && !activeFilters.includes('all')) ? (
          <div style={{ marginBottom: '12px', padding: '0 16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {activeFilters.filter(f => f !== 'all').map(filter => (
                <Tag
                  key={filter}
                  closable
                  onClose={() => handleFilterToggle(filter)}
                  color="blue"
                  style={{ marginBottom: '4px' }}
                >
                  {filter === 'favorites' && <><StarOutlined /> {t('favorites')}</>}
                  {filter === 'unread' && <><BellOutlined /> {t('unread')}</>}
                  {filter === 'archive' && <><InboxOutlined /> {t('archive')}</>}
                  {filter === 'amazon' && <><AmazonOutlined /> Amazon</>}
                  {filter === 'instagram' && <><InstagramOutlined /> Instagram</>}
                  {filter === 'email' && <><MailOutlined /> Email</>}
                  {filter === 'tiktok' && <><TikTokOutlined /> TikTok</>}
                </Tag>
              ))}
            </div>
          </div>
        ) : null}

        <div className="section-buttons" style={{ marginBottom: '16px' }}>
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
                  style={{ 
                    padding: '12px 16px'
                  }}
                >
                  <List.Item.Meta
                    avatar={getChatAvatar(chat)}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Text 
                              strong 
                              style={{ fontSize: '14px', cursor: 'pointer' }}
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
              </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>{lastMessageTime}</Text>
                {chat.unreadCount > 0 && (
                            <Badge count={chat.unreadCount} size="small" />
                )}
              </div>
            </div>
                    }
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text
                          type="secondary" 
                          style={{ fontSize: '12px', flex: 1 }}
                          ellipsis={true}
                          onClick={() => onChatSelect(chat.id, searchTerm)}
                        >
                          {lastMessageText}
                        </Text>
                        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
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
          targetLanguage={targetLanguage}
        />
      )}

    </Sider>
  )
}

export default Sidebar
