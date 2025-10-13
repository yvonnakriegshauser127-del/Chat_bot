// Простой сервис для перевода (в реальном приложении здесь был бы API)
export const translationService = {
  // Список поддерживаемых языков
  languages: {
    'ru': 'Русский',
    'uk': 'Українська',
    'en': 'English'
  },

  // Функция для извлечения ссылок на соцсети из сообщения
  extractSocialLinks: (message) => {
    const links = [];

    // Извлекаем ссылки
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundLinks = message.match(urlRegex);
    if (foundLinks) {
      links.push(...foundLinks.map(link => ({
        url: link,
        platform: getPlatformFromUrl(link)
      })));
    }

    return links;
  },

  // Функция для перевода (заглушка - в реальном приложении здесь был бы API)
  translate: async (text, targetLanguage) => {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Переводы для демонстрации
    const translations = {
      'ru': {
        'Привет! Как дела с проектом?': 'Привет! Как дела с проектом?',
        'Отлично! Давай встретимся завтра для обсуждения деталей': 'Отлично! Давай встретимся завтра для обсуждения деталей',
        'Все идет по плану, спасибо!': 'Все идет по плану, спасибо!',
        'Хорошо, в какое время удобно?': 'Хорошо, в какое время удобно?',
        'В 14:00 будет отлично': 'В 14:00 будет отлично',
        'О': 'О',
        'Ребята, кто может помочь с багом в авторизации?': 'Ребята, кто может помочь с багом в авторизации?',
        'Я могу посмотреть, в чем проблема': 'Я могу посмотреть, в чем проблема',
        'Я тоже подключусь, если нужно': 'Я тоже подключусь, если нужно',
        'Иван, пришли пожалуйста отчет за прошлую неделю': 'Иван, пришли пожалуйста отчет за прошлую неделю',
        'Конечно, отправлю сегодня вечером': 'Конечно, отправлю сегодня вечером',
        'Этот чат можно архивировать': 'Этот чат можно архивировать',
        'Hello! How is the project going?': 'Привет! Как дела с проектом?',
        'Great! Let\'s meet tomorrow to discuss details': 'Отлично! Давай встретимся завтра для обсуждения деталей',
        'Everything is going according to plan, thanks!': 'Все идет по плану, спасибо!',
        'Your order has been shipped!': 'Ваш заказ отправлен!',
        'New post is ready for review': 'Новый пост готов к проверке',
        'Hey! Ready to create some viral content?': 'Привет! Готов создать вирусный контент?',
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Привет, я RJ Martinez, full-time Amazon Influencer с более чем 3 годами опыта в обзорах и более чем 1200 продуктовыми видео, опубликованными на Amazon, YouTube и TikTok. Я создаю практические демонстрации, анбоксинги и лайфстайл-сцены, которые отвечают на вопросы покупателей и мотивируют их нажать «Добавить в корзину».'
      },
      'uk': {
        'Привет! Как дела с проектом?': 'Привіт! Як справи з проектом?',
        'Отлично! Давай встретимся завтра для обсуждения деталей': 'Відмінно! Давай зустрінемося завтра для обговорення деталей',
        'Все идет по плану, спасибо!': 'Все йде за планом, дякую!',
        'Хорошо, в какое время удобно?': 'Добре, в який час зручно?',
        'В 14:00 будет отлично': 'О 14:00 буде відмінно',
        'О': 'О',
        'Ребята, кто может помочь с багом в авторизации?': 'Хлопці, хто може допомогти з багом в авторизації?',
        'Я могу посмотреть, в чем проблема': 'Я можу подивитися, в чому проблема',
        'Я тоже подключусь, если нужно': 'Я теж підключуся, якщо потрібно',
        'Иван, пришли пожалуйста отчет за прошлую неделю': 'Іван, пришли будь ласка звіт за минулий тиждень',
        'Конечно, отправлю сегодня вечером': 'Звичайно, відправлю сьогодні ввечері',
        'Этот чат можно архивировать': 'Цей чат можна архівувати',
        'Hello! How is the project going?': 'Привіт! Як справи з проектом?',
        'Great! Let\'s meet tomorrow to discuss details': 'Відмінно! Давай зустрінемося завтра для обговорення деталей',
        'Everything is going according to plan, thanks!': 'Все йде за планом, дякую!',
        'Your order has been shipped!': 'Ваше замовлення відправлено!',
        'New post is ready for review': 'Новий пост готовий до перевірки',
        'Hey! Ready to create some viral content?': 'Привіт! Готовий створити вірусний контент?',
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Привіт, я RJ Martinez, full-time Amazon Influencer з більш ніж 3 роками досвіду в оглядах і більш ніж 1200 продуктовими відео, опублікованими на Amazon, YouTube і TikTok. Я створюю практичні демонстрації, анбоксинги та лайфстайл-сцени, які відповідають на питання покупців і мотивують їх натиснути «Додати в кошик».'
      },
      'en': {
        'Привет! Как дела с проектом?': 'Hello! How is the project going?',
        'Отлично! Давай встретимся завтра для обсуждения деталей': 'Great! Let\'s meet tomorrow to discuss details',
        'Все идет по плану, спасибо!': 'Everything is going according to plan, thanks!',
        'Хорошо, в какое время удобно?': 'Good, what time is convenient?',
        'В 14:00 будет отлично': 'At 14:00 will be great',
        'О': 'Oh',
        'Ребята, кто может помочь с багом в авторизации?': 'Guys, who can help with the authorization bug?',
        'Я могу посмотреть, в чем проблема': 'I can look at what the problem is',
        'Я тоже подключусь, если нужно': 'I\'ll also join if needed',
        'Иван, пришли пожалуйста отчет за прошлую неделю': 'Ivan, please send the report for last week',
        'Конечно, отправлю сегодня вечером': 'Of course, I\'ll send it tonight',
        'Этот чат можно архивировать': 'This chat can be archived',
        'Hello! How is the project going?': 'Hello! How is the project going?',
        'Great! Let\'s meet tomorrow to discuss details': 'Great! Let\'s meet tomorrow to discuss details',
        'Everything is going according to plan, thanks!': 'Everything is going according to plan, thanks!',
        'Your order has been shipped!': 'Your order has been shipped!',
        'New post is ready for review': 'New post is ready for review',
        'Hey! Ready to create some viral content?': 'Hey! Ready to create some viral content?',
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ'
      }
    };

    // Если есть точный перевод, возвращаем его
    if (translations[targetLanguage]?.[text]) {
      return translations[targetLanguage][text];
    }
    
    // Если перевода нет, возвращаем оригинальный текст с пометкой
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }
};

// Вспомогательная функция для определения платформы по URL
function getPlatformFromUrl(url) {
  if (url.includes('amazon.com')) return 'Amazon';
  if (url.includes('youtube.com')) return 'YouTube';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('twitter.com')) return 'Twitter';
  return 'Website';
}
