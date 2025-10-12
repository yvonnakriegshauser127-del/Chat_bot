import React, { useState, useEffect } from 'react'
import { Layout, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import NewChatModal from './components/NewChatModal'
import TemplatesModal from './components/TemplatesModal'
import GroupParticipantsModal from './components/GroupParticipantsModal'
import ForwardMessageModal from './components/ForwardMessageModal'
import ProfileSettingsModal from './components/ProfileSettingsModal'
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
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [forwardedMessage, setForwardedMessage] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentGroupParticipants, setCurrentGroupParticipants] = useState([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeSearchTerm, setActiveSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)

  const [currentUser, setCurrentUser] = useState({ id: 1, name: 'Вы', avatar: '👤' })

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
  const openChat = (chatId, searchTerm = '') => {
    setCurrentChatId(chatId)
    setIsMinimized(false)
    
    // Сбрасываем счетчик непрочитанных
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    )
    
    // Если есть поисковый запрос, находим все сообщения с этим текстом
    if (searchTerm) {
      setActiveSearchTerm(searchTerm)
      const chat = chats.find(c => c.id === chatId)
      if (chat) {
        const searchLower = searchTerm.toLowerCase()
        const matchingMessages = chat.messages.filter(message => 
          message.content.toLowerCase().includes(searchLower)
        )
        
        setSearchResults(matchingMessages)
        setCurrentSearchIndex(0)
        
        if (matchingMessages.length > 0) {
          // Прокручиваем к первому найденному сообщению с небольшой задержкой
          setTimeout(() => {
            scrollToMessage(matchingMessages[0].id)
          }, 100)
        }
      }
    } else {
      setActiveSearchTerm('')
      setSearchResults([])
      setCurrentSearchIndex(0)
    }
  }

  // Отправка сообщения
  const sendMessage = (content, replyTo = null) => {
    if (!content.trim() || !currentChatId) return

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: content.trim(),
      timestamp: new Date(),
      read: true,
      replyTo: replyTo ? {
        messageId: replyTo.id,
        senderName: replyTo.senderName,
        content: replyTo.content
      } : null
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
              // Увеличиваем счетчик непрочитанных только если чат не активен
              unreadCount: chatId === currentChatId ? (chat.unreadCount || 0) : (chat.unreadCount || 0) + 1
            }
          : chat
      )
    )
  }

  // Симуляция случайных входящих сообщений в неактивные чаты
  const simulateRandomMessages = () => {
    const privateChats = chats.filter(chat => 
      chat.type === 'private' && 
      chat.id !== currentChatId && 
      !chat.isArchived
    )
    
    if (privateChats.length === 0) return

    // Случайно выбираем чат для получения сообщения
    const randomChat = privateChats[Math.floor(Math.random() * privateChats.length)]
    const participant = users.find(u => u.id !== currentUser.id && randomChat.participants.includes(u.id))
    
    if (!participant) return

    const randomMessages = [
      'Привет! Как дела?',
      'Можешь помочь с проектом?',
      'Когда сможем встретиться?',
      'Отправил файлы, проверь пожалуйста',
      'Есть новости по нашему вопросу?',
      'Спасибо за помощь!',
      'Можешь перезвонить?',
      'Все готово, можно начинать'
    ]

    const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)]
    const incomingMessage = {
      id: Date.now(),
      senderId: participant.id,
      senderName: participant.name,
      content: randomMessage,
      timestamp: new Date(),
      read: false
    }

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === randomChat.id
          ? { 
              ...chat, 
              messages: [...chat.messages, incomingMessage],
              // Увеличиваем счетчик непрочитанных, так как чат не активен
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

  const togglePin = (chatId) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isPinned: !chat.isPinned }
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

  // Обработка пересылки сообщения
  const handleForwardMessage = (message) => {
    setForwardedMessage(message)
    setShowForwardModal(true)
  }

  // Пересылка сообщения в выбранный чат
  const forwardMessage = (targetChatId, message) => {
    const forwardedMessageData = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `Пересланное сообщение от ${message.senderName}: ${message.content}`,
      timestamp: new Date(),
      read: false,
      forwardedFrom: {
        messageId: message.id,
        senderName: message.senderName,
        originalContent: message.content,
        originalTimestamp: message.timestamp
      }
    }

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === targetChatId
          ? { 
              ...chat, 
              messages: [...chat.messages, forwardedMessageData],
              // Увеличиваем счетчик непрочитанных только если целевой чат не активен
              unreadCount: targetChatId === currentChatId ? (chat.unreadCount || 0) : (chat.unreadCount || 0) + 1
            }
          : chat
      )
    )
  }

  // Прокрутка к сообщению по ID
  const scrollToMessage = (messageId) => {
    const messageElement = document.getElementById(`message-${messageId}`)
    if (messageElement) {
      messageElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      // Добавляем временное выделение
      messageElement.style.backgroundColor = '#fff2e8'
      setTimeout(() => {
        messageElement.style.backgroundColor = ''
      }, 2000)
    }
  }

  // Навигация по найденным сообщениям
  const goToNextSearchResult = () => {
    if (searchResults.length > 0 && currentSearchIndex < searchResults.length - 1) {
      const nextIndex = currentSearchIndex + 1
      setCurrentSearchIndex(nextIndex)
      scrollToMessage(searchResults[nextIndex].id)
    }
  }

  const goToPreviousSearchResult = () => {
    if (searchResults.length > 0 && currentSearchIndex > 0) {
      const prevIndex = currentSearchIndex - 1
      setCurrentSearchIndex(prevIndex)
      scrollToMessage(searchResults[prevIndex].id)
    }
  }

  // Сброс поиска
  const resetSearch = () => {
    setActiveSearchTerm('')
    setSearchResults([])
    setCurrentSearchIndex(0)
  }

  // Обновление профиля пользователя
  const updateUserProfile = (updatedProfile) => {
    setCurrentUser(updatedProfile)
    
    // Обновляем имя пользователя во всех сообщениях
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.messages.some(msg => msg.senderId === currentUser.id)
          ? {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.senderId === currentUser.id
                  ? { ...msg, senderName: updatedProfile.name }
                  : msg
              )
            }
          : chat
      )
    )
  }

  // Добавление участников в группу
  const addParticipantsToGroup = (participantIds) => {
    if (!currentChatId || !participantIds.length) return

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? { 
              ...chat, 
              participants: [...chat.participants, ...participantIds]
            }
          : chat
      )
    )

    // Добавляем системное сообщение о добавлении участников
    const addedUsers = users.filter(user => participantIds.includes(user.id))
    const addedUserNames = addedUsers.map(user => user.name).join(', ')
    
    const systemMessage = {
      id: Date.now(),
      senderId: 'system',
      senderName: 'System',
      content: `Добавлены участники: ${addedUserNames}`,
      timestamp: new Date(),
      read: true,
      isSystemMessage: true
    }

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? { 
              ...chat, 
              messages: [...chat.messages, systemMessage]
            }
          : chat
      )
    )
  }

  // Удаление участника из группы
  const removeParticipantFromGroup = (chatId, participantId) => {
    if (!chatId || !participantId) return

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { 
              ...chat, 
              participants: chat.participants.filter(id => id !== participantId)
            }
          : chat
      )
    )

    // Добавляем системное сообщение об удалении участника
    const removedUser = users.find(user => user.id === participantId)
    const systemMessage = {
      id: Date.now(),
      senderId: 'system',
      senderName: 'System',
      content: `Участник ${removedUser?.name || 'Неизвестный'} покинул группу`,
      timestamp: new Date(),
      read: true,
      isSystemMessage: true
    }

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { 
              ...chat, 
              messages: [...chat.messages, systemMessage]
            }
          : chat
      )
    )
  }

  // Периодическая симуляция случайных сообщений в неактивные чаты
  useEffect(() => {
    const interval = setInterval(() => {
      simulateRandomMessages()
    }, 10000 + Math.random() * 20000) // Каждые 10-30 секунд

    return () => clearInterval(interval)
  }, [chats, currentChatId])

  return (
    <ConfigProvider locale={ruRU}>
      <Layout className="app-container">
        {!isMinimized && (
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchReset={resetSearch}
            onChatSelect={openChat}
            onNewChat={() => setShowNewChatModal(true)}
            users={users}
            onToggleFavorite={toggleFavorite}
            onToggleArchive={toggleArchive}
            onTogglePin={togglePin}
            presets={presets}
            selectedPreset={selectedPreset}
            onPresetSelect={selectPreset}
            onCreatePreset={createPreset}
            onDeletePreset={deletePreset}
            stores={stores}
            emails={emails}
            targetLanguage={targetLanguage}
            onLanguageChange={setTargetLanguage}
            onShowProfileSettings={() => setShowProfileModal(true)}
            currentUser={currentUser}
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
          onForwardMessage={handleForwardMessage}
          onScrollToMessage={scrollToMessage}
          onUpdateProfile={updateUserProfile}
          activeSearchTerm={activeSearchTerm}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          onNextSearchResult={goToNextSearchResult}
          onPreviousSearchResult={goToPreviousSearchResult}
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
          targetLanguage={targetLanguage}
          onAddParticipants={addParticipantsToGroup}
          onRemoveParticipant={removeParticipantFromGroup}
          currentUser={currentUser}
        />

        <ForwardMessageModal
          visible={showForwardModal}
          onClose={() => {
            setShowForwardModal(false)
            setForwardedMessage(null)
          }}
          onForward={forwardMessage}
          chats={chats}
          currentChatId={currentChatId}
          forwardedMessage={forwardedMessage}
          users={users}
        />

        <ProfileSettingsModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={currentUser}
          onUpdateProfile={updateUserProfile}
          targetLanguage={targetLanguage}
        />

      </Layout>
    </ConfigProvider>
  )
}

export default App
