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
        'Hello! How is the project going?': 'Привет! Как дела с проектом?',
        'Great! Let\'s meet tomorrow to discuss details': 'Отлично! Давай встретимся завтра для обсуждения деталей',
        'Everything is going according to plan, thanks!': 'Все идет по плану, спасибо!',
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Привет, я RJ Martinez, full-time Amazon Influencer с более чем 3 годами опыта в обзорах и более чем 1200 продуктовыми видео, опубликованными на Amazon, YouTube и TikTok. Я создаю практические демонстрации, анбоксинги и лайфстайл-сцены, которые отвечают на вопросы покупателей и мотивируют их нажать «Добавить в корзину».'
      },
      'uk': {
        'Привет! Как дела с проектом?': 'Привіт! Як справи з проектом?',
        'Отлично! Давай встретимся завтра для обсуждения деталей': 'Відмінно! Давай зустрінемося завтра для обговорення деталей',
        'Все идет по плану, спасибо!': 'Все йде за планом, дякую!',
        'Hello! How is the project going?': 'Привіт! Як справи з проектом?',
        'Great! Let\'s meet tomorrow to discuss details': 'Відмінно! Давай зустрінемося завтра для обговорення деталей',
        'Everything is going according to plan, thanks!': 'Все йде за планом, дякую!',
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Привіт, я RJ Martinez, full-time Amazon Influencer з більш ніж 3 роками досвіду в оглядах і більш ніж 1200 продуктовими відео, опублікованими на Amazon, YouTube і TikTok. Я створюю практичні демонстрації, анбоксинги та лайфстайл-сцени, які відповідають на питання покупців і мотивують їх натиснути «Додати в кошик».'
      },
      'en': {
        'Привет! Как дела с проектом?': 'Hello! How is the project going?',
        'Отлично! Давай встретимся завтра для обсуждения деталей': 'Great! Let\'s meet tomorrow to discuss details',
        'Все идет по плану, спасибо!': 'Everything is going according to plan, thanks!',
        'Hello! How is the project going?': 'Hello! How is the project going?',
        'Great! Let\'s meet tomorrow to discuss details': 'Great! Let\'s meet tomorrow to discuss details',
        'Everything is going according to plan, thanks!': 'Everything is going according to plan, thanks!',
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/shop/printondemand-rjmartinez YouTube - https://www.youtube.com/@ltestedit89/videos TikTok - https://www.tiktok.com/@itestedit Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ'
      }
    };

    return translations[targetLanguage]?.[text] || text;
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
