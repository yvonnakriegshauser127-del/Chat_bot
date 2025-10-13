export const testUsers = [
  { id: 2, name: 'Анна Петрова', avatar: '👩' },
  { id: 3, name: 'Иван Сидоров', avatar: '👨' },
  { id: 4, name: 'Мария Козлова', avatar: '👩‍💼' },
  { id: 5, name: 'Алексей Волков', avatar: '👨‍💻' },
  { id: 6, name: 'Елена Смирнова', avatar: '👩‍🎓' },
  { id: 7, name: 'Дмитрий Новиков', avatar: '👨‍🔬' },
  { id: 8, name: 'Ольга Васильева', avatar: '👩‍🎨' },
  { id: 9, name: 'Сергей Морозов', avatar: '👨‍🚀' },
  { id: 10, name: 'Татьяна Лебедева', avatar: '👩‍⚕️' },
  { id: 11, name: 'Amazon Support', avatar: '🛒' },
  { id: 12, name: 'TikTok Creator', avatar: '🎬' }
]

export const testTemplates = [
  { id: 1, name: 'Приветствие', content: 'Добро пожаловать в наш чат!' },
  { id: 2, name: 'Встреча', content: 'Давайте назначим встречу на завтра в 14:00' },
  { id: 3, name: 'Вопрос', content: 'У меня есть вопрос по проекту...' },
  { id: 4, name: 'Спасибо', content: 'Спасибо за помощь!' },
  { id: 5, name: 'Отчет', content: 'Отчет готов, можете ознакомиться' }
]

export const testStores = [
  { id: 1, name: 'Electronics Store' },
  { id: 2, name: 'Fashion Boutique' },
  { id: 3, name: 'Home & Garden' },
  { id: 4, name: 'Sports & Outdoors' },
  { id: 5, name: 'Books & Media' }
]

export const testEmails = [
  { id: 1, address: 'support@company.com' },
  { id: 2, address: 'sales@company.com' },
  { id: 3, address: 'marketing@company.com' },
  { id: 4, address: 'admin@company.com' },
  { id: 5, address: 'info@company.com' }
]

export const testPresets = [
  {
    id: 1,
    name: 'Amazon Electronics',
    channels: ['amazon'],
    stores: [1],
    emails: ['support@company.com'],
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: 2,
    name: 'Instagram Fashion',
    channels: ['instagram'],
    stores: [2],
    emails: ['marketing@company.com'],
    createdAt: new Date(Date.now() - 172800000)
  },
  {
    id: 3,
    name: 'Multi-Channel Marketing',
    channels: ['amazon', 'instagram', 'email'],
    stores: [1, 2, 3],
    emails: ['marketing@company.com', 'sales@company.com'],
    createdAt: new Date(Date.now() - 259200000)
  },
  {
    id: 4,
    name: 'TikTok Viral Campaign',
    channels: ['tiktok'],
    stores: [1, 2],
    emails: ['marketing@company.com'],
    createdAt: new Date(Date.now() - 345600000)
  }
]

export const initialChats = [
  {
    id: 1,
    name: 'Анна Петрова',
    type: 'private',
    participants: [1, 2],
    isFavorite: true,
    isArchived: false,
    isPinned: false,
    isPinned: false,
    platform: 'email',
    messages: [
      {
        id: 1,
        senderId: 2,
        senderName: 'Анна Петрова',
        content: 'Привет! Как дела с проектом?',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      },
      {
        id: 2,
        senderId: 1,
        senderName: 'Вы',
        content: 'Все идет по плану, спасибо!',
        timestamp: new Date(Date.now() - 3500000),
        read: true
      },
      {
        id: 3,
        senderId: 2,
        senderName: 'Анна Петрова',
        content: 'Отлично! Давай встретимся завтра для обсуждения деталей',
        timestamp: new Date(Date.now() - 3000000),
        read: false
      },
      {
        id: 5,
        senderId: 1,
        senderName: 'Вы',
        content: 'Хорошо, в какое время удобно?',
        timestamp: new Date(Date.now() - 2500000),
        read: true,
        replyTo: {
          messageId: 3,
          senderName: 'Анна Петрова',
          content: 'Отлично! Давай встретимся завтра для обсуждения деталей'
        }
      },
      {
        id: 6,
        senderId: 2,
        senderName: 'Анна Петрова',
        content: 'В 14:00 будет отлично',
        timestamp: new Date(Date.now() - 2000000),
        read: false,
        replyTo: {
          messageId: 5,
          senderName: 'Вы',
          content: 'Хорошо, в какое время удобно?'
        }
      },
      {
        id: 4,
        senderId: 2,
        senderName: 'RJ Martinez',
        content: 'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ',
        timestamp: new Date(Date.now() - 2000000),
        read: false
      },
      {
        id: 7,
        senderId: 2,
        senderName: 'Анна Петрова',
        content: 'О',
        timestamp: new Date(Date.now() - 1000000),
        read: false
      }
    ],
    isImportant: false,
    isArchived: false,
    isPinned: false,
    isPinned: false,
    unreadCount: 3
  },
  {
    id: 2,
    name: 'Команда разработки',
    type: 'group',
    participants: [1, 3, 4, 5],
    isFavorite: false,
    isArchived: false,
    isPinned: false,
    platform: 'instagram',
    messages: [
      {
        id: 4,
        senderId: 3,
        senderName: 'Иван Сидоров',
        content: 'Ребята, кто может помочь с багом в авторизации?',
        timestamp: new Date(Date.now() - 7200000),
        read: true
      },
      {
        id: 5,
        senderId: 4,
        senderName: 'Мария Козлова',
        content: 'Я могу посмотреть, в чем проблема',
        timestamp: new Date(Date.now() - 7000000),
        read: true
      },
      {
        id: 6,
        senderId: 5,
        senderName: 'Алексей Волков',
        content: 'Я тоже подключусь, если нужно',
        timestamp: new Date(Date.now() - 6800000),
        read: true
      }
    ],
    isImportant: true,
    isArchived: false,
    isPinned: false,
    unreadCount: 0
  },
  {
    id: 3,
    name: 'Иван Сидоров',
    type: 'private',
    participants: [1, 3],
    isFavorite: false,
    isArchived: true,
    platform: 'amazon',
    messages: [
      {
        id: 7,
        senderId: 1,
        senderName: 'Вы',
        content: 'Иван, пришли пожалуйста отчет за прошлую неделю',
        timestamp: new Date(Date.now() - 86400000),
        read: true
      },
      {
        id: 8,
        senderId: 3,
        senderName: 'Иван Сидоров',
        content: 'Конечно, отправлю сегодня вечером',
        timestamp: new Date(Date.now() - 86000000),
        read: true
      }
    ],
    isImportant: false,
    isArchived: false,
    isPinned: false,
    unreadCount: 0
  },
  {
    id: 4,
    name: 'Архивные переговоры',
    type: 'group',
    participants: [1, 2, 6],
    isFavorite: false,
    isArchived: true,
    platform: 'email',
    messages: [
      {
        id: 9,
        senderId: 6,
        senderName: 'Елена Смирнова',
        content: 'Этот чат можно архивировать',
        timestamp: new Date(Date.now() - 172800000),
        read: true
      }
    ],
    isImportant: false,
    isArchived: true,
    unreadCount: 0
  },
  {
    id: 5,
    name: 'Amazon Support',
    type: 'private',
    participants: [1, 11],
    isFavorite: false,
    isArchived: false,
    isPinned: false,
    platform: 'amazon',
    messages: [
      {
        id: 10,
        senderId: 11,
        senderName: 'Amazon Support',
        content: 'Your order has been shipped!',
        timestamp: new Date(Date.now() - 1800000),
        read: false,
        brandName: 'Liberhaus'
      }
    ],
    isImportant: false,
    isArchived: false,
    isPinned: false,
    unreadCount: 1
  },
  {
    id: 6,
    name: 'Instagram Marketing',
    type: 'group',
    participants: [1, 7, 8, 9],
    isFavorite: true,
    isArchived: false,
    isPinned: false,
    platform: 'instagram',
    messages: [
      {
        id: 11,
        senderId: 7,
        senderName: 'Дмитрий Новиков',
        content: 'New post is ready for review',
        timestamp: new Date(Date.now() - 900000),
        read: true
      }
    ],
    isImportant: false,
    isArchived: false,
    isPinned: false,
    unreadCount: 0
  },
  {
    id: 7,
    name: 'TikTok Creator',
    type: 'private',
    participants: [1, 12],
    isFavorite: false,
    isArchived: false,
    isPinned: false,
    platform: 'tiktok',
    messages: [
      {
        id: 12,
        senderId: 12,
        senderName: 'TikTok Creator',
        content: 'Hey! Ready to create some viral content?',
        timestamp: new Date(Date.now() - 600000),
        read: false
      }
    ],
    isImportant: false,
    isArchived: false,
    isPinned: false,
    unreadCount: 1
  },
  {
    id: 8,
    name: 'NYCHKA Store',
    type: 'private',
    participants: [1, 11],
    isFavorite: false,
    isArchived: false,
    isPinned: false,
    platform: 'amazon',
    messages: [
      {
        id: 11,
        senderId: 11,
        senderName: 'Amazon Support',
        content: 'New product review available for your brand',
        timestamp: new Date(Date.now() - 1200000),
        read: false,
        brandName: 'NYCHKA'
      },
      {
        id: 12,
        senderId: 1,
        senderName: 'Вы',
        content: 'Thank you for the update!',
        timestamp: new Date(Date.now() - 1000000),
        read: true
      }
    ],
    isImportant: false,
    isArchived: false,
    isPinned: false,
    unreadCount: 1
  },
  {
    id: 9,
    name: 'TechGear Pro',
    type: 'private',
    participants: [1, 11],
    isFavorite: true,
    isArchived: false,
    isPinned: false,
    platform: 'amazon',
    messages: [
      {
        id: 13,
        senderId: 11,
        senderName: 'Amazon Support',
        content: 'Your product has been featured in Amazon\'s recommended section',
        timestamp: new Date(Date.now() - 800000),
        read: false,
        brandName: 'TechGear Pro'
      }
    ],
    isImportant: false,
    isArchived: false,
    isPinned: false,
    unreadCount: 1
  }
]
