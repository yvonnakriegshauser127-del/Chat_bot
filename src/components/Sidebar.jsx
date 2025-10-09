import React, { useState } from 'react'
import { Layout, Input, Button, List, Avatar, Typography, Badge, Collapse, Tooltip, Select, Dropdown, Space } from 'antd'
import { SearchOutlined, PlusOutlined, MessageOutlined, TeamOutlined, StarOutlined, StarFilled, InboxOutlined, FileZipFilled, BellOutlined, ShoppingOutlined, InstagramOutlined, MailOutlined, DownOutlined, DeleteOutlined, TranslationOutlined } from '@ant-design/icons'
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
  onChatSelect, 
  onNewChat,
  users,
  onToggleFavorite,
  onToggleArchive,
  presets,
  selectedPreset,
  onPresetSelect,
  onCreatePreset,
  onDeletePreset,
  stores,
  emails,
  targetLanguage,
  onLanguageChange
}) => {
  const [activeSection, setActiveSection] = useState('all')
  const [showPresetModal, setShowPresetModal] = useState(false)
  const { t } = useTranslation(targetLanguage)
  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) {
      return 'сейчас'
    } else if (minutes < 60) {
      return `${minutes}м`
    } else if (hours < 24) {
      return `${hours}ч`
    } else if (days < 7) {
      return `${days}д`
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
        return <ShoppingOutlined style={{ color: '#ff9900', fontSize: '12px' }} />
      case 'instagram':
        return <InstagramOutlined style={{ color: '#e4405f', fontSize: '12px' }} />
      case 'email':
        return <MailOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
      default:
        return null
    }
  }

  const getPresetChannelIcon = (channels) => {
    if (!channels || channels.length === 0) return null
    
    if (channels.length === 1) {
      switch (channels[0]) {
        case 'amazon':
          return <ShoppingOutlined style={{ color: '#ff9900' }} />
        case 'instagram':
          return <InstagramOutlined style={{ color: '#e4405f' }} />
        case 'email':
          return <MailOutlined style={{ color: '#1890ff' }} />
        default:
          return null
      }
    }
    
    // Для множественных каналов показываем иконку множественного выбора
    return <span style={{ fontSize: '12px' }}>📱</span>
  }

  // Фильтрация чатов по секциям и поиску
  const getFilteredChats = () => {
    let filteredBySection = []
    
    switch (activeSection) {
      case 'favorites':
        filteredBySection = chats.filter(chat => chat.isFavorite && !chat.isArchived)
        break
      case 'archive':
        filteredBySection = chats.filter(chat => chat.isArchived)
        break
      case 'unread':
        filteredBySection = chats.filter(chat => !chat.isArchived && chat.unreadCount > 0)
        break
      case 'amazon':
        filteredBySection = chats.filter(chat => !chat.isArchived && chat.platform === 'amazon')
        break
      case 'instagram':
        filteredBySection = chats.filter(chat => !chat.isArchived && chat.platform === 'instagram')
        break
      case 'email':
        filteredBySection = chats.filter(chat => !chat.isArchived && chat.platform === 'email')
        break
      default:
        filteredBySection = chats.filter(chat => !chat.isArchived)
    }

    // Дополнительная фильтрация по поиску
    if (!searchTerm) return filteredBySection
    
    const searchLower = searchTerm.toLowerCase()
    return filteredBySection.filter(chat => 
      chat.name.toLowerCase().includes(searchLower) ||
      (chat.messages.length > 0 && 
       chat.messages[chat.messages.length - 1].content.toLowerCase().includes(searchLower))
    )
  }

  const filteredChats = getFilteredChats()

  return (
    <Sider width={300} className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <MessageOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
          <Text strong style={{ fontSize: '18px' }}>{t('chats')}</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onNewChat}
          size="small"
        />
      </div>
      
      <div className="search-container">
        <Input
          placeholder={t('searchChats')}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
        />
      </div>

      <div className="language-selector" style={{ padding: '0 16px 16px 16px' }}>
        <Tooltip title={t('language')}>
          <Select
            value={targetLanguage}
            onChange={onLanguageChange}
            size="small"
            style={{ width: '100%' }}
            suffixIcon={<TranslationOutlined />}
          >
            <Option value="ru">Русский</Option>
            <Option value="uk">Українська</Option>
            <Option value="en">English</Option>
          </Select>
        </Tooltip>
      </div>
      
      <div className="chat-sections">
        <div className="preset-selector" style={{ marginBottom: '16px' }}>
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
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeletePreset(preset.id)
                        }}
                        style={{ color: '#ff4d4f' }}
                      />
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
                      <span>Добавить пресет</span>
                    </Space>
                  ),
                  onClick: () => setShowPresetModal(true)
                }
              ]
            }}
            trigger={['click']}
          >
            <Button style={{ width: '100%', textAlign: 'left', justifyContent: 'space-between' }}>
              <Space>
                {selectedPreset ? (
                  <>
                    {getPresetChannelIcon(selectedPreset.channels)}
                    <span>{selectedPreset.name}</span>
                  </>
                ) : (
                  <span>Выберите пресет</span>
                )}
              </Space>
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <div className="section-buttons" style={{ marginBottom: '16px' }}>
          <Button 
            type={activeSection === 'all' ? 'primary' : 'text'}
            onClick={() => setActiveSection('all')}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            {t('allChats')}
          </Button>
          <Button 
            type={activeSection === 'favorites' ? 'primary' : 'text'}
            onClick={() => setActiveSection('favorites')}
            icon={<StarOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            {t('favorites')}
          </Button>
          <Button 
            type={activeSection === 'unread' ? 'primary' : 'text'}
            onClick={() => setActiveSection('unread')}
            icon={<BellOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            {t('unread')}
          </Button>
          <Button 
            type={activeSection === 'amazon' ? 'primary' : 'text'}
            onClick={() => setActiveSection('amazon')}
            icon={<ShoppingOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            Amazon
          </Button>
          <Button 
            type={activeSection === 'instagram' ? 'primary' : 'text'}
            onClick={() => setActiveSection('instagram')}
            icon={<InstagramOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            Instagram
          </Button>
          <Button 
            type={activeSection === 'email' ? 'primary' : 'text'}
            onClick={() => setActiveSection('email')}
            icon={<MailOutlined />}
            style={{ marginRight: '4px', marginBottom: '4px' }}
          >
            Email
          </Button>
          <Button 
            type={activeSection === 'archive' ? 'primary' : 'text'}
            onClick={() => setActiveSection('archive')}
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
                          <Text 
                            strong 
                            style={{ fontSize: '14px', cursor: 'pointer' }}
              onClick={() => onChatSelect(chat.id)}
            >
                            {chat.name}
                          </Text>
                          {getPlatformIcon(chat.platform)}
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
                          ellipsis={{ tooltip: lastMessageText }}
                          onClick={() => onChatSelect(chat.id)}
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
        />
      )}
    </Sider>
  )
}

export default Sidebar
