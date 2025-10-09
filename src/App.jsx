import React, { useState, useEffect } from 'react'
import { Layout, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import NewChatModal from './components/NewChatModal'
import TemplatesModal from './components/TemplatesModal'
import GroupParticipantsModal from './components/GroupParticipantsModal'
import { testUsers, testTemplates, initialChats, testStores, testEmails, testPresets } from './data/testData'
import './App.css'

function App() {
  const [chats, setChats] = useState(initialChats)
  const [currentChatId, setCurrentChatId] = useState(null)
  const [users] = useState(testUsers)
  const [templates, setTemplates] = useState(testTemplates)
  const [presets, setPresets] = useState(testPresets)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [stores] = useState(testStores)
  const [emails] = useState(testEmails)
  const [searchTerm, setSearchTerm] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('ru')
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentGroupParticipants, setCurrentGroupParticipants] = useState([])

  const currentUser = { id: 1, name: 'Вы', avatar: '👤' }

  // Фильтрация чатов по поиску (будет выполняться в Sidebar)
  // const filteredChats = chats.filter(chat => {
  //   if (chat.isArchived) return false
  //   if (!searchTerm) return true
  //   
  //   const searchLower = searchTerm.toLowerCase()
  //   return chat.name.toLowerCase().includes(searchLower) ||
  //          (chat.messages.length > 0 && 
  //           chat.messages[chat.messages.length - 1].content.toLowerCase().includes(searchLower))
  // })

  const currentChat = chats.find(chat => chat.id === currentChatId)

  // Открытие чата
  const openChat = (chatId) => {
    setCurrentChatId(chatId)
    setIsMinimized(false)
    
    // Сбрасываем счетчик непрочитанных
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    )
  }

  // Отправка сообщения
  const sendMessage = (content) => {
    if (!content.trim() || !currentChatId) return

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: content.trim(),
      timestamp: new Date(),
      read: true
    }

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    )

    // Симулируем ответ
    setTimeout(() => {
      simulateResponse(currentChatId)
    }, 1000 + Math.random() * 2000)
  }

  // Симуляция ответа
  const simulateResponse = (chatId) => {
    const chat = chats.find(c => c.id === chatId)
    if (!chat || chat.type !== 'private') return

    const participant = users.find(u => u.id !== currentUser.id && chat.participants.includes(u.id))
    if (!participant) return

    const responses = [
      'Понял, спасибо!',
      'Хорошо, давай обсудим это позже',
      'Отлично, я займусь этим',
      'Спасибо за информацию',
      'Да, согласен с вами'
    ]

    const response = responses[Math.floor(Math.random() * responses.length)]
    const responseMessage = {
      id: Date.now(),
      senderId: participant.id,
      senderName: participant.name,
      content: response,
      timestamp: new Date(),
      read: false
    }

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { 
              ...chat, 
              messages: [...chat.messages, responseMessage],
              unreadCount: (chat.unreadCount || 0) + 1
            }
          : chat
      )
    )
  }

  // Создание нового чата
  const createChat = (chatData) => {
    const newChat = {
      id: Date.now(),
      name: chatData.name,
      type: chatData.type,
      participants: [currentUser.id, ...chatData.participants],
      avatar: chatData.avatar,
      messages: [],
      isImportant: false,
      isArchived: false,
      unreadCount: 0
    }

    setChats(prevChats => [...prevChats, newChat])
    setShowNewChatModal(false)
    openChat(newChat.id)
  }

  // Переключение важности
  const toggleImportant = () => {
    if (!currentChatId) return

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, isImportant: !chat.isImportant }
          : chat
      )
    )
  }

  // Архивирование чата
  const archiveChat = () => {
    if (!currentChatId) return

    if (window.confirm('Вы уверены, что хотите архивировать этот чат?')) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, isArchived: true }
            : chat
        )
      )
      
      setCurrentChatId(null)
      setIsMinimized(false)
    }
  }

  // Вставка шаблона
  const insertTemplate = (content) => {
    setShowTemplatesModal(false)
    if (insertTemplateCallback) {
      insertTemplateCallback(content)
    }
  }

  const [insertTemplateCallback, setInsertTemplateCallback] = useState(null)

  // Создание нового шаблона
  const createTemplate = (templateData) => {
    const newTemplate = {
      id: Date.now(),
      name: templateData.name,
      content: templateData.content
    }
    setTemplates(prev => [...prev, newTemplate])
  }

  // Удаление шаблона
  const deleteTemplate = (templateId) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId))
  }

  // Обновление шаблона
  const updateTemplate = (templateId, updatedData) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, ...updatedData }
        : template
    ))
  }

  // Функции для работы с избранными и архивом
  const toggleFavorite = (chatId) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isFavorite: !chat.isFavorite }
        : chat
    ))
  }

  const toggleArchive = (chatId) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isArchived: !chat.isArchived }
        : chat
    ))
  }

  // Функции для работы с пресетами
  const createPreset = (presetData) => {
    setPresets(prev => [...prev, presetData])
  }

  const deletePreset = (presetId) => {
    setPresets(prev => prev.filter(preset => preset.id !== presetId))
    if (selectedPreset && selectedPreset.id === presetId) {
      setSelectedPreset(null)
    }
  }

  const selectPreset = (presetId) => {
    const preset = presets.find(p => p.id === presetId)
    setSelectedPreset(preset)
  }

  // Добавление участника в группу
  const handleAddParticipant = (userId) => {
    setCurrentGroupParticipants(prev => [...prev, userId])
  }

  // Удаление участника из группы
  const handleRemoveParticipant = (userId) => {
    setCurrentGroupParticipants(prev => prev.filter(id => id !== userId))
  }


  return (
    <ConfigProvider locale={ruRU}>
      <Layout className="app-container">
        {!isMinimized && (
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onChatSelect={openChat}
            onNewChat={() => setShowNewChatModal(true)}
            users={users}
            onToggleFavorite={toggleFavorite}
            onToggleArchive={toggleArchive}
            presets={presets}
            selectedPreset={selectedPreset}
            onPresetSelect={selectPreset}
            onCreatePreset={createPreset}
            onDeletePreset={deletePreset}
            stores={stores}
            emails={emails}
            targetLanguage={targetLanguage}
            onLanguageChange={setTargetLanguage}
          />
        )}

        <ChatWindow
          chat={currentChat}
          isMinimized={isMinimized}
          onMinimize={() => setIsMinimized(!isMinimized)}
          onSendMessage={sendMessage}
          onShowTemplates={() => setShowTemplatesModal(true)}
          currentUser={currentUser}
          users={users}
          onInsertTemplate={setInsertTemplateCallback}
          onShowParticipants={() => setShowParticipantsModal(true)}
          targetLanguage={targetLanguage}
        />

        <NewChatModal
          visible={showNewChatModal}
          users={users}
          onClose={() => {
            setShowNewChatModal(false)
            setCurrentGroupParticipants([])
          }}
          onCreateChat={createChat}
          currentGroupParticipants={currentGroupParticipants}
          onAddParticipant={handleAddParticipant}
          onRemoveParticipant={handleRemoveParticipant}
        />

        <TemplatesModal
          visible={showTemplatesModal}
          templates={templates}
          onClose={() => setShowTemplatesModal(false)}
          onSelectTemplate={insertTemplate}
          onCreateTemplate={createTemplate}
          onDeleteTemplate={deleteTemplate}
          onUpdateTemplate={updateTemplate}
        />

        <GroupParticipantsModal
          visible={showParticipantsModal}
          chat={currentChat}
          users={users}
          onClose={() => setShowParticipantsModal(false)}
        />

      </Layout>
    </ConfigProvider>
  )
}

export default App
