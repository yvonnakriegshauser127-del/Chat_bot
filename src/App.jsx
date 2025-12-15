import React, { useState, useEffect } from 'react'
import { Layout, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import NewChatModal from './components/NewChatModal'
import TemplatesModal from './components/TemplatesModal'
import CreateFolderModal from './components/CreateFolderModal'
import GroupParticipantsModal from './components/GroupParticipantsModal'
import ForwardMessageModal from './components/ForwardMessageModal'
import ProfileSettingsModal from './components/ProfileSettingsModal'
import { testUsers, testTemplates, initialChats, testStores, testEmails, testInstagramAccounts, testTikTokAccounts, testPresets, availableLabels, groupFilters, campaignParticipants } from './data/testData'
import { localStorageUtils } from './utils/localStorage'
import './App.css'

function App() {
  const [chats, setChats] = useState(initialChats)
  const [currentChatId, setCurrentChatId] = useState(null)
  const [users, setUsers] = useState(testUsers)
  const [templates, setTemplates] = useState(testTemplates)
  const [templateFolders, setTemplateFolders] = useState([
    { id: 1, name: 'Общие', createdAt: new Date() },
    { id: 2, name: 'Работа', createdAt: new Date() }
  ])
  const [defaultTemplate, setDefaultTemplate] = useState(() => {
    try {
      const raw = localStorage.getItem('defaultTemplate')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [labels, setLabels] = useState(availableLabels)
  const [groups, setGroups] = useState(groupFilters)
  const [selectedGroupFilter, setSelectedGroupFilter] = useState(null)
  const [presets, setPresets] = useState(testPresets)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [stores] = useState(testStores)
  const [emails] = useState(testEmails)
  const [instagramAccounts] = useState(testInstagramAccounts)
  const [tiktokAccounts] = useState(testTikTokAccounts)
  const [searchTerm, setSearchTerm] = useState('')
  const [targetLanguage, setTargetLanguage] = useState(() => localStorageUtils.getLanguage())
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [forwardedMessage, setForwardedMessage] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentGroupParticipants, setCurrentGroupParticipants] = useState([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeTab, setActiveTab] = useState('general') // Для управления активной вкладкой
  const [aiSelectedModel, setAiSelectedModel] = useState(() => localStorage.getItem('aiSelectedModel') || 'gpt-4o-mini')
  const [aiPrompts, setAiPrompts] = useState(() => {
    try {
      const raw = localStorage.getItem('aiPrompts')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [aiSelectedPromptId, setAiSelectedPromptId] = useState(() => localStorage.getItem('aiSelectedPromptId') || null)

  // Messages state (invitations and rejections)
  const [invitationMessages, setInvitationMessages] = useState(() => {
    try {
      const raw = localStorage.getItem('invitationMessages')
      const parsed = raw ? JSON.parse(raw) : []
      // Если в localStorage нет сообщений, добавляем демонстрационное
      if (parsed.length === 0) {
        return [{
          id: 'demo-invitation-1',
          name: 'Приглашение в кампанию',
          text: 'Здравствуйте! Мы хотели бы пригласить вас принять участие в нашей кампании. Ваш контент отлично подходит для нашего бренда. Пожалуйста, дайте знать, если вас это заинтересует.'
        }]
      }
      return parsed
    } catch {
      return [{
        id: 'demo-invitation-1',
        name: 'Приглашение в кампанию',
        text: 'Здравствуйте! Мы хотели бы пригласить вас принять участие в нашей кампании. Ваш контент отлично подходит для нашего бренда. Пожалуйста, дайте знать, если вас это заинтересует.'
      }]
    }
  })
  const [rejectionMessages, setRejectionMessages] = useState(() => {
    try {
      const raw = localStorage.getItem('rejectionMessages')
      const parsed = raw ? JSON.parse(raw) : []
      // Если в localStorage нет сообщений, добавляем демонстрационное
      if (parsed.length === 0) {
        return [{
          id: 'demo-rejection-1',
          name: 'Отказ от участия',
          text: 'Спасибо за предложение. К сожалению, в данный момент мы не можем принять участие в кампании. Надеемся на сотрудничество в будущем.'
        }]
      }
      return parsed
    } catch {
      return [{
        id: 'demo-rejection-1',
        name: 'Отказ от участия',
        text: 'Спасибо за предложение. К сожалению, в данный момент мы не можем принять участие в кампании. Надеемся на сотрудничество в будущем.'
      }]
    }
  })
  const [selectedInvitationId, setSelectedInvitationId] = useState(() => localStorage.getItem('selectedInvitationId') || null)
  const [selectedRejectionId, setSelectedRejectionId] = useState(() => localStorage.getItem('selectedRejectionId') || null)

  // Сохранение AI настроек в localStorage
  useEffect(() => {
    localStorage.setItem('aiSelectedModel', aiSelectedModel)
  }, [aiSelectedModel])

  useEffect(() => {
    try {
      localStorage.setItem('aiPrompts', JSON.stringify(aiPrompts))
    } catch {}
  }, [aiPrompts])

  useEffect(() => {
    if (aiSelectedPromptId) {
      localStorage.setItem('aiSelectedPromptId', aiSelectedPromptId)
    } else {
      localStorage.removeItem('aiSelectedPromptId')
    }
  }, [aiSelectedPromptId])

  // Сохранение сообщений в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('invitationMessages', JSON.stringify(invitationMessages))
    } catch {}
  }, [invitationMessages])

  useEffect(() => {
    try {
      localStorage.setItem('rejectionMessages', JSON.stringify(rejectionMessages))
    } catch {}
  }, [rejectionMessages])

  useEffect(() => {
    if (selectedInvitationId) {
      localStorage.setItem('selectedInvitationId', selectedInvitationId)
    } else {
      localStorage.removeItem('selectedInvitationId')
    }
  }, [selectedInvitationId])

  useEffect(() => {
    if (selectedRejectionId) {
      localStorage.setItem('selectedRejectionId', selectedRejectionId)
    } else {
      localStorage.removeItem('selectedRejectionId')
    }
  }, [selectedRejectionId])
  
  // Обновление brandName в существующих чатах при загрузке (миграция с 'Electronics Store' на 'Amazon Electronics')
  useEffect(() => {
    setChats(prevChats => {
      const hasChanges = prevChats.some(chat => chat.brandName === 'Electronics Store')
      if (!hasChanges) return prevChats
      
      return prevChats.map(chat => {
        if (chat.brandName === 'Electronics Store') {
          return {
            ...chat,
            brandName: 'Amazon Electronics',
            messages: chat.messages.map(msg => ({
              ...msg,
              brandName: msg.brandName === 'Electronics Store' ? 'Amazon Electronics' : msg.brandName
            }))
          }
        }
        return chat
      })
    })
  }, [])
  
  const [activeSearchTerm, setActiveSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)

  const [currentUser, setCurrentUser] = useState({ id: 1, name: 'Вы', avatar: '👤' })

  // Обработка изменения языка
  const handleLanguageChange = (newLanguage) => {
    setTargetLanguage(newLanguage)
    localStorageUtils.setLanguage(newLanguage)
  }

  // Функция для проверки, соответствует ли пользователь условиям фильтра группы
  const userMatchesGroupFilter = (user, groupFilter) => {
    if (!groupFilter || !groupFilter.conditions) return true
    
    const { labels: requiredLabels, matchType } = groupFilter.conditions
    const userLabels = user.labels || []
    
    if (matchType === 'all') {
      // Пользователь должен иметь ВСЕ требуемые ярлыки
      return requiredLabels.every(label => userLabels.includes(label))
    } else {
      // Пользователь должен иметь ХОТЯ БЫ ОДИН требуемый ярлык
      return requiredLabels.some(label => userLabels.includes(label))
    }
  }

  // Функция для получения чатов, отфильтрованных по группе
  const getFilteredChatsByGroup = (groupFilter) => {
    if (!groupFilter) return chats
    
    return chats.filter(chat => {
      // Все чаты теперь личные, проверяем ярлыки собеседника
      const participantId = chat.participants.find(id => id !== currentUser.id)
      const participant = users.find(u => u.id === participantId)
      
      if (participant) {
        return userMatchesGroupFilter(participant, groupFilter)
      }
      
      return false
    })
  }

  // Функция для обновления ярлыков пользователя
  const updateUserLabels = (userId, newLabels) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, labels: newLabels }
          : user
      )
    )
  }

  // Функция для создания нового ярлыка
  const createNewLabel = (newLabel) => {
    // Добавляем ярлык в список доступных ярлыков
    setLabels(prevLabels => [...prevLabels, {
      id: newLabel.id,
      name: newLabel.name,
      color: newLabel.color,
      textColor: newLabel.textColor
    }])
    
    // Добавляем группу-фильтр для этого ярлыка
    setGroups(prevGroups => [...prevGroups, {
      id: newLabel.id,
      name: newLabel.name,
      description: `${newLabel.name} контакты`,
      color: newLabel.color,
      textColor: newLabel.textColor,
      conditions: {
        labels: [newLabel.id],
        matchType: 'any'
      }
    }])
  }

  // Функция для редактирования ярлыка
  const updateLabel = (updatedLabel) => {
    // Обновляем ярлык в списке доступных ярлыков
    setLabels(prevLabels =>
      prevLabels.map(label =>
        label.id === updatedLabel.id
          ? {
              ...label,
              name: updatedLabel.name,
              color: updatedLabel.color,
              textColor: updatedLabel.textColor
            }
          : label
      )
    )
    
    // Обновляем группу-фильтр для этого ярлыка
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === updatedLabel.id
          ? {
              ...group,
              name: updatedLabel.name,
              color: updatedLabel.color,
              textColor: updatedLabel.textColor,
              description: `${updatedLabel.name} контакты`
            }
          : group
      )
    )
  }

  // Функция для удаления ярлыка
  const deleteLabel = (labelId) => {
    // Удаляем ярлык из списка доступных ярлыков
    setLabels(prevLabels => prevLabels.filter(label => label.id !== labelId))
    
    // Удаляем группу-фильтр для этого ярлыка
    setGroups(prevGroups => prevGroups.filter(group => group.id !== labelId))
    
    // Если удаляемый ярлык был выбран, сбрасываем выбор
    if (selectedGroupFilter?.id === labelId) {
      setSelectedGroupFilter(null)
    }
    
    // Удаляем этот ярлык у всех пользователей
    setUsers(prevUsers =>
      prevUsers.map(user => ({
        ...user,
        labels: user.labels ? user.labels.filter(label => label !== labelId) : []
      }))
    )
  }

  // Функция для сохранения ярлыка в пресет
  const saveLabelToPreset = (labelId, presetId) => {
    setPresets(prevPresets =>
      prevPresets.map(preset =>
        preset.id === presetId
          ? {
              ...preset,
              labels: preset.labels 
                ? preset.labels.includes(labelId) 
                  ? preset.labels // Если ярлык уже есть, не добавляем дубликат
                  : [...preset.labels, labelId] // Если ярлыка нет, добавляем
                : [labelId] // Если массив ярлыков пустой, создаем новый
            }
          : preset
      )
    )
  }

  // Функция для закрепления/открепления сообщения
  const togglePinMessage = (chatId, messageId) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map(message =>
                message.id === messageId
                  ? { ...message, isPinned: !message.isPinned }
                  : message
              )
            }
          : chat
      )
    )
  }

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
    
    // НЕ сбрасываем счетчик непрочитанных автоматически
    // Счетчик будет обновляться по мере прочтения сообщений
    
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

  // Пометка сообщения как прочитанного
  const markMessageAsRead = (messageId) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        const updatedMessages = chat.messages.map(message => 
          message.id === messageId ? { ...message, read: true } : message
        )
        
        // Пересчитываем количество непрочитанных сообщений
        const unreadCount = updatedMessages.filter(msg => !msg.read && msg.senderId !== currentUser?.id).length
        
        return {
          ...chat,
          messages: updatedMessages,
          unreadCount: unreadCount
        }
      })
    )
  }

  // Пометка сообщения как непрочитанного
  const markMessageAsUnread = (messageId) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        const updatedMessages = chat.messages.map(message => 
          message.id === messageId ? { ...message, read: false } : message
        )
        
        // Пересчитываем количество непрочитанных сообщений
        const unreadCount = updatedMessages.filter(msg => !msg.read && msg.senderId !== currentUser?.id).length
        
        return {
          ...chat,
          messages: updatedMessages,
          unreadCount: unreadCount
        }
      })
    )
  }

  // Функция для пересчета количества непрочитанных сообщений в чате
  const recalculateUnreadCount = (chatId) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          const unreadCount = chat.messages.filter(msg => !msg.read && msg.senderId !== currentUser?.id).length
          return { ...chat, unreadCount }
        }
        return chat
      })
    )
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

    // Разные ответы для разных платформ
    let responses = []
    let brandName = null

    if (chat.platform === 'amazon') {
      responses = [
        'Your order has been processed successfully',
        'New product review available',
        'Inventory update: Product back in stock',
        'Customer inquiry received',
        'Sales report generated'
      ]
      // Получаем название бренда из существующих сообщений или используем случайное
      const existingBrand = chat.messages.find(msg => msg.brandName)?.brandName
      const amazonBrands = ['Liberhaus', 'NYCHKA', 'TechGear Pro', 'StyleMax', 'EcoHome']
      brandName = existingBrand || amazonBrands[Math.floor(Math.random() * amazonBrands.length)]
    } else {
      responses = [
        'Понял, спасибо!',
        'Хорошо, давай обсудим это позже',
        'Отлично, я займусь этим',
        'Спасибо за информацию',
        'Да, согласен с вами'
      ]
    }

    const response = responses[Math.floor(Math.random() * responses.length)]
    const responseMessage = {
      id: Date.now(),
      senderId: participant.id,
      senderName: participant.name,
      content: response,
      timestamp: new Date(),
      read: false,
      ...(brandName && { brandName })
    }

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { 
              ...chat, 
              messages: [...chat.messages, responseMessage],
              // Пересчитываем количество непрочитанных сообщений
              unreadCount: chatId === currentChatId ? 
                chat.messages.filter(msg => !msg.read && msg.senderId !== currentUser?.id).length :
                (chat.unreadCount || 0) + 1
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

    // Разные сообщения для разных платформ
    let randomMessages = []
    let brandName = null

    if (randomChat.platform === 'amazon') {
      randomMessages = [
        'New customer review posted',
        'Product performance report ready',
        'Inventory alert: Low stock detected',
        'Customer support ticket created',
        'Sales analytics updated'
      ]
      // Получаем название бренда из существующих сообщений или используем случайное
      const existingBrand = randomChat.messages.find(msg => msg.brandName)?.brandName
      const amazonBrands = ['Liberhaus', 'NYCHKA', 'TechGear Pro', 'StyleMax', 'EcoHome']
      brandName = existingBrand || amazonBrands[Math.floor(Math.random() * amazonBrands.length)]
    } else {
      randomMessages = [
        'Привет! Как дела?',
        'Можешь помочь с проектом?',
        'Когда сможем встретиться?',
        'Отправил файлы, проверь пожалуйста',
        'Есть новости по нашему вопросу?',
        'Спасибо за помощь!',
        'Можешь перезвонить?',
        'Все готово, можно начинать'
      ]
    }

    const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)]
    const incomingMessage = {
      id: Date.now(),
      senderId: participant.id,
      senderName: participant.name,
      content: randomMessage,
      timestamp: new Date(),
      read: false,
      ...(brandName && { brandName })
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

  // Обработка отправки сообщения из модального окна "Создать сообщение"
  const handleSendMessageFromModal = (messageData) => {
    const { storeUserPairs, message } = messageData
    if (!storeUserPairs || storeUserPairs.length === 0 || !message) return

    const newChats = []
    const chatUpdates = new Map()

    // Обрабатываем каждую связку магазин-пользователь
    storeUserPairs.forEach(({ storeName, bloggerId }, index) => {
      const blogger = users.find(u => u.id === bloggerId)
      if (!blogger) return
      // Создаем сообщение
      const newMessage = {
        id: Date.now() + Math.random() * 10000 + index * 1000,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: message.trim(),
        timestamp: new Date(),
        read: true,
        // Добавляем brandName для Amazon чатов
        ...(storeName && { brandName: storeName })
      }

      // Ищем существующий чат с этим пользователем, платформой Amazon и тем же магазином
      const existingChat = chats.find(chat => 
        chat.type === 'private' && 
        chat.platform === 'amazon' &&
        chat.participants.includes(bloggerId) &&
        chat.participants.includes(currentUser.id) &&
        chat.participants.length === 2 &&
        // Проверяем соответствие brandName (или оба null)
        (chat.brandName === storeName || (!chat.brandName && !storeName))
      )

      if (existingChat) {
        // Добавляем обновление для существующего чата
        chatUpdates.set(existingChat.id, {
          ...existingChat,
          messages: [...existingChat.messages, newMessage]
        })
      } else {
        // Создаем новый чат с платформой Amazon для каждой связки магазин-пользователь
        const newChat = {
          id: Date.now() + Math.random() * 100000 + index * 10000 + bloggerId * 100,
          name: blogger.name,
          type: 'private',
          participants: [currentUser.id, bloggerId],
          avatar: blogger.avatar,
          messages: [newMessage],
          isFavorite: false,
          isArchived: false,
          isPinned: false,
          platform: 'amazon',
          brandName: storeName,
          unreadCount: 0
        }
        newChats.push(newChat)
      }
    })

    // Применяем все изменения одним обновлением состояния
    setChats(prevChats => {
      let updatedChats = [...prevChats]
      
      // Обновляем существующие чаты
      updatedChats = updatedChats.map(chat => {
        const update = chatUpdates.get(chat.id)
        return update || chat
      })
      
      // Добавляем новые чаты
      return [...updatedChats, ...newChats]
    })
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

  // Создание новой папки для шаблонов
  const createTemplateFolder = (folderData) => {
    const newFolder = {
      id: Date.now(),
      name: folderData.name,
      createdAt: new Date()
    }
    setTemplateFolders(prev => [...prev, newFolder])
  }

  // Удаление папки для шаблонов
  const deleteTemplateFolder = (folderId, action = 'moveToGeneral') => {
    if (action === 'moveToGeneral') {
      // Переместить все шаблоны из удаляемой папки в папку "Общие" (id: 1)
      const generalFolderId = 1
      setTemplates(prev => prev.map(template => 
        template.folderId === folderId ? { ...template, folderId: generalFolderId } : template
      ))
    } else if (action === 'deleteAll') {
      // Удалить все шаблоны из папки
      setTemplates(prev => prev.filter(template => template.folderId !== folderId))
    }
    
    // Удалить папку
    setTemplateFolders(prev => prev.filter(folder => folder.id !== folderId))
  }

  // Редактирование папки для шаблонов
  const updateTemplateFolder = (folderId, newName) => {
    setTemplateFolders(prev => prev.map(folder => 
      folder.id === folderId ? { ...folder, name: newName } : folder
    ))
  }

  // Создание нового шаблона
  const createTemplate = (templateData) => {
    const newTemplate = {
      id: Date.now(),
      name: templateData.name,
      content: templateData.content,
      folderId: templateData.folderId || 1 // По умолчанию в папку "Общие"
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

  // Копирование шаблона
  const copyTemplate = (templateId, targetFolderId) => {
    const originalTemplate = templates.find(template => template.id === templateId)
    
    if (originalTemplate) {
      const newTemplate = {
        id: Date.now() + Math.random(), // Уникальный ID
        name: originalTemplate.name,
        content: originalTemplate.content,
        folderId: targetFolderId
      }
      setTemplates(prev => [...prev, newTemplate])
    }
  }

  // Создание дефолтного шаблона
  const createDefaultTemplate = (templateData) => {
    const newDefaultTemplate = {
      id: 'default-' + Date.now(),
      content: templateData.content,
      isDefault: true
    }
    setDefaultTemplate(newDefaultTemplate)
    try {
      localStorage.setItem('defaultTemplate', JSON.stringify(newDefaultTemplate))
    } catch (error) {
      console.error('Failed to save default template to localStorage:', error)
    }
  }

  // Обновление дефолтного шаблона
  const updateDefaultTemplate = (updatedData) => {
    if (defaultTemplate) {
      const updated = {
        ...defaultTemplate,
        content: updatedData.content
      }
      setDefaultTemplate(updated)
      try {
        localStorage.setItem('defaultTemplate', JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to update default template in localStorage:', error)
      }
    }
  }

  // Удаление дефолтного шаблона
  const deleteDefaultTemplate = () => {
    setDefaultTemplate(null)
    try {
      localStorage.removeItem('defaultTemplate')
    } catch (error) {
      console.error('Failed to remove default template from localStorage:', error)
    }
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
    if (presetData.id && presets.find(p => p.id === presetData.id)) {
      // Редактирование существующего пресета
      setPresets(prev => prev.map(preset => 
        preset.id === presetData.id ? presetData : preset
      ))
    } else {
      // Создание нового пресета
      setPresets(prev => [...prev, presetData])
    }
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
              // Пересчитываем количество непрочитанных сообщений
              unreadCount: targetChatId === currentChatId ? 
                chat.messages.filter(msg => !msg.read && msg.senderId !== currentUser?.id).length :
                (chat.unreadCount || 0) + 1
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

  // Функция для автоматической отправки сообщений в тестовый чат
  const startTestMessageSending = () => {
    const testChatId = 1 // ID чата "Анна Петрова" для тестирования
    const testMessages = [
      "Привет! Как дела?",
      "Что нового?",
      "Как работа?",
      "Встретимся завтра?",
      "Отлично! До встречи!",
      "Спасибо за помощь",
      "Все получилось!",
      "Отправляю документы",
      "Проверь, пожалуйста",
      "Все в порядке?",
      "Нужна твоя помощь",
      "Можешь перезвонить?",
      "Жду ответа",
      "Срочно!",
      "Важная информация",
      "Не забудь про встречу",
      "Время изменилось",
      "Переносим на завтра",
      "Все готово",
      "Можно начинать",
      "Отличная работа!",
      "Спасибо за терпение",
      "До свидания!",
      "Увидимся завтра",
      "Удачи!"
    ]

    let messageCount = 0
    const maxMessages = 25

    const sendTestMessage = () => {
      if (messageCount >= maxMessages) {
        return
      }

      const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)]
      const newMessage = {
        id: Date.now() + Math.random(),
        content: randomMessage,
        senderId: 2, // ID пользователя "Анна Петрова"
        senderName: 'Анна Петрова',
        timestamp: new Date(),
        read: false,
        type: 'text'
      }

      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id === testChatId) {
            const updatedMessages = [...chat.messages, newMessage]
            const unreadCount = updatedMessages.filter(msg => !msg.read && msg.senderId !== currentUser?.id).length
            return {
              ...chat,
              messages: updatedMessages,
              unreadCount: unreadCount,
              lastMessage: randomMessage,
              lastMessageTime: new Date()
            }
          }
          return chat
        })
      )

      messageCount++
    }

    // Отправляем первое сообщение сразу
    sendTestMessage()

    // Затем отправляем сообщения каждые 2 секунды
    const interval = setInterval(() => {
      sendTestMessage()
      
      if (messageCount >= maxMessages) {
        clearInterval(interval)
      }
    }, 2000)

    return interval
  }

  // Запускаем тестовую отправку сообщений при загрузке приложения
  useEffect(() => {
    const testInterval = startTestMessageSending()
    
    return () => {
      if (testInterval) {
        clearInterval(testInterval)
      }
    }
  }, [])

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
            instagramAccounts={instagramAccounts}
            tiktokAccounts={tiktokAccounts}
            targetLanguage={targetLanguage}
            onShowProfileSettings={(tab) => {
              if (tab) {
                setActiveTab(tab)
              }
              setShowProfileModal(true)
            }}
            currentUser={currentUser}
            labels={labels}
            groups={groups}
            selectedGroupFilter={selectedGroupFilter}
            onGroupFilterSelect={setSelectedGroupFilter}
            onUpdateUserLabels={updateUserLabels}
            onCreateLabel={createNewLabel}
            onUpdateLabel={updateLabel}
            onDeleteLabel={deleteLabel}
            onSaveLabelToPreset={saveLabelToPreset}
            getFilteredChatsByGroup={getFilteredChatsByGroup}
            userMatchesGroupFilter={userMatchesGroupFilter}
            onSendMessageFromModal={handleSendMessageFromModal}
            campaignParticipants={campaignParticipants}
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
          onMarkAsRead={markMessageAsRead}
          onMarkAsUnread={markMessageAsUnread}
          onUpdateProfile={updateUserProfile}
          onTogglePinMessage={togglePinMessage}
          activeSearchTerm={activeSearchTerm}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          onNextSearchResult={goToNextSearchResult}
          invitationMessages={invitationMessages}
          rejectionMessages={rejectionMessages}
          selectedInvitationId={selectedInvitationId}
          selectedRejectionId={selectedRejectionId}
          selectedPrompt={(() => {
            if (!aiSelectedPromptId) return null
            const prompt = aiPrompts.find(p => p.id === aiSelectedPromptId)
            return prompt || null
          })()}
          onPreviousSearchResult={goToPreviousSearchResult}
          hasAnyModalOpen={
            showNewChatModal ||
            showTemplatesModal ||
            showCreateFolderModal ||
            showParticipantsModal ||
            showForwardModal ||
            showProfileModal
          }
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
          targetLanguage={targetLanguage}
        />

        <TemplatesModal
          visible={showTemplatesModal}
          templates={templates}
          templateFolders={templateFolders}
          onClose={() => setShowTemplatesModal(false)}
          onSelectTemplate={insertTemplate}
          onCreateTemplate={createTemplate}
          onDeleteTemplate={deleteTemplate}
          onUpdateTemplate={updateTemplate}
          onCreateFolder={() => setShowCreateFolderModal(true)}
          onDeleteFolder={deleteTemplateFolder}
          onUpdateFolder={updateTemplateFolder}
          onCopyTemplate={copyTemplate}
          defaultTemplate={defaultTemplate}
          onCreateDefaultTemplate={createDefaultTemplate}
          onUpdateDefaultTemplate={updateDefaultTemplate}
          onDeleteDefaultTemplate={deleteDefaultTemplate}
          targetLanguage={targetLanguage}
        />

        <CreateFolderModal
          visible={showCreateFolderModal}
          onClose={() => setShowCreateFolderModal(false)}
          onCreateFolder={createTemplateFolder}
          targetLanguage={targetLanguage}
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
          onClose={() => {
            setShowProfileModal(false)
            setActiveTab('general')
          }}
          currentUser={currentUser}
          onUpdateProfile={updateUserProfile}
          targetLanguage={targetLanguage}
          onLanguageChange={handleLanguageChange}
          initialSelectedModel={aiSelectedModel}
          initialPrompts={aiPrompts}
          initialSelectedPromptId={aiSelectedPromptId}
          onSaveAiSettings={({ selectedModel, prompts, selectedPromptId }) => {
            setAiSelectedModel(selectedModel)
            setAiPrompts(prompts)
            setAiSelectedPromptId(selectedPromptId || null)
          }}
          initialInvitationMessages={invitationMessages}
          initialRejectionMessages={rejectionMessages}
          initialSelectedInvitationId={selectedInvitationId}
          initialSelectedRejectionId={selectedRejectionId}
          onSaveMessagesSettings={({ invitations, rejections, selectedInvitationId, selectedRejectionId }) => {
            setInvitationMessages(invitations)
            setRejectionMessages(rejections)
            setSelectedInvitationId(selectedInvitationId || null)
            setSelectedRejectionId(selectedRejectionId || null)
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

      </Layout>
    </ConfigProvider>
  )
}

export default App
