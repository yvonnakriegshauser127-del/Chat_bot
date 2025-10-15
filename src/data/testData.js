// Доступные ярлыки для пользователей
export const availableLabels = [
  { id: 'work', name: 'Работа', color: '#1890ff', textColor: '#000000' },
  { id: 'personal', name: 'Личное', color: '#52c41a', textColor: '#000000' },
  { id: 'urgent', name: 'Срочно', color: '#ff4d4f', textColor: '#000000' },
  { id: 'vip', name: 'VIP', color: '#faad14', textColor: '#000000' },
  { id: 'support', name: 'Поддержка', color: '#722ed1', textColor: '#000000' },
  { id: 'marketing', name: 'Маркетинг', color: '#13c2c2', textColor: '#000000' },
  { id: 'sales', name: 'Продажи', color: '#eb2f96', textColor: '#000000' }
]

export const testUsers = [
  { id: 2, name: 'Анна Петрова', avatar: '👩', labels: ['work', 'vip'] },
  { id: 3, name: 'Иван Сидоров', avatar: '👨', labels: ['work'] },
  { id: 4, name: 'Мария Козлова', avatar: '👩‍💼', labels: ['work', 'marketing'] },
  { id: 5, name: 'Алексей Волков', avatar: '👨‍💻', labels: ['work'] },
  { id: 6, name: 'Елена Смирнова', avatar: '👩‍🎓', labels: ['personal'] },
  { id: 7, name: 'Дмитрий Новиков', avatar: '👨‍🔬', labels: ['work', 'urgent'] },
  { id: 8, name: 'Ольга Васильева', avatar: '👩‍🎨', labels: ['personal', 'vip'] },
  { id: 9, name: 'Сергей Морозов', avatar: '👨‍🚀', labels: ['work'] },
  { id: 10, name: 'Татьяна Лебедева', avatar: '👩‍⚕️', labels: ['work', 'support'] },
  { id: 11, name: 'Amazon Support', avatar: '🛒', labels: ['support', 'sales'] },
  { id: 12, name: 'TikTok Creator', avatar: '🎬', labels: ['marketing', 'sales'] },
  { id: 13, name: 'NYCHKA Store', avatar: '🏪', labels: ['sales'] },
  { id: 14, name: 'TechGear Pro', avatar: '⚙️', labels: ['sales'] }
]

// Группы как фильтры (наборы условий для отображения пользователей)
export const groupFilters = [
  {
    id: 'work',
    name: 'Работа',
    description: 'Рабочие контакты',
    color: '#1890ff',
    textColor: '#000000',
    conditions: {
      labels: ['work'],
      matchType: 'any'
    }
  },
  {
    id: 'personal',
    name: 'Личное',
    description: 'Личные контакты',
    color: '#52c41a',
    textColor: '#000000',
    conditions: {
      labels: ['personal'],
      matchType: 'any'
    }
  },
  {
    id: 'urgent',
    name: 'Срочно',
    description: 'Требуют немедленного внимания',
    color: '#ff4d4f',
    textColor: '#000000',
    conditions: {
      labels: ['urgent'],
      matchType: 'any'
    }
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Важные персоны',
    color: '#faad14',
    textColor: '#000000',
    conditions: {
      labels: ['vip'],
      matchType: 'any'
    }
  },
  {
    id: 'support',
    name: 'Поддержка',
    description: 'Служба поддержки',
    color: '#722ed1',
    textColor: '#000000',
    conditions: {
      labels: ['support'],
      matchType: 'any'
    }
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    description: 'Маркетинговые контакты',
    color: '#13c2c2',
    textColor: '#000000',
    conditions: {
      labels: ['marketing'],
      matchType: 'any'
    }
  },
  {
    id: 'sales',
    name: 'Продажи',
    description: 'Клиенты и партнеры',
    color: '#eb2f96',
    textColor: '#000000',
    conditions: {
      labels: ['sales'],
      matchType: 'any'
    }
  }
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
    stores: ['Amazon Electronics'],
    emails: ['support@company.com'],
    labels: ['sales'],
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: 2,
    name: 'Instagram Fashion',
    channels: ['instagram'],
    stores: ['Instagram Fashion'],
    emails: ['marketing@company.com'],
    labels: ['marketing'],
    createdAt: new Date(Date.now() - 172800000)
  },
  {
    id: 3,
    name: 'Multi-Channel Marketing',
    channels: ['amazon', 'instagram', 'email'],
    stores: ['Amazon Electronics', 'Instagram Fashion', 'TikTok Viral Campaign'],
    emails: ['marketing@company.com', 'sales@company.com'],
    labels: ['marketing', 'sales'],
    createdAt: new Date(Date.now() - 259200000)
  },
  {
    id: 4,
    name: 'TikTok Viral Campaign',
    channels: ['tiktok'],
    stores: ['TikTok Viral Campaign'],
    emails: ['marketing@company.com'],
    labels: ['marketing'],
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
    email: 'anna.petrova@company.com',
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
    name: 'Иван Сидоров',
    type: 'private',
    participants: [1, 3],
    isFavorite: false,
    isArchived: true,
    platform: 'amazon',
    brandName: 'TechGear Pro',
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
    id: 3,
    name: 'Amazon Support',
    type: 'private',
    participants: [1, 11],
    isFavorite: false,
    isArchived: false,
    isPinned: false,
    platform: 'amazon',
    brandName: 'Amazon Electronics',
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
    id: 4,
    name: 'TikTok Creator',
    type: 'private',
    participants: [1, 12],
    isFavorite: false,
    isArchived: false,
    isPinned: false,
    platform: 'tiktok',
    brandName: 'TikTok Viral Campaign',
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
    id: 5,
    name: 'NYCHKA Store',
    type: 'private',
    participants: [1, 13],
    isFavorite: false,
    isArchived: false,
    isPinned: false,
    platform: 'amazon',
    brandName: 'NYCHKA Store',
    messages: [
      {
        id: 11,
        senderId: 13,
        senderName: 'NYCHKA Store',
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
    id: 6,
    name: 'TechGear Pro',
    type: 'private',
    participants: [1, 14],
    isFavorite: true,
    isArchived: false,
    isPinned: false,
    platform: 'amazon',
    brandName: 'TechGear Pro',
    messages: [
      {
        id: 13,
        senderId: 14,
        senderName: 'TechGear Pro',
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
