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
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/stores/page/600E10CE-C8D2-4DF2-91B5-4D7EF7DDC7E0?ingress=2&lp_context_asin=B0DW48QHFY&lp_context_query=gaming&visitId=2d7cd424-748a-4d80-b24c-ce1dad9cc90f&store_ref=bl_ast_dp_brandLogo_sto&ref_=ast_bln YouTube - https://www.youtube.com/@Wylsacom/videos TikTok - https://www.tiktok.com/@fakewylsacom Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Привет, я RJ Martinez, full-time Amazon Influencer с более чем 3 годами опыта в обзорах и более чем 1200 продуктовыми видео, опубликованными на Amazon, YouTube и TikTok. Я создаю практические демонстрации, анбоксинги и лайфстайл-сцены, которые отвечают на вопросы покупателей и мотивируют их нажать «Добавить в корзину».',
        'New product review available for your brand': 'Доступен новый отзыв о продукте для вашего бренда',
        'Thank you for the update!': 'Спасибо за обновление!',
        'Your product has been featured in Amazon\'s recommended section': 'Ваш продукт был добавлен в рекомендуемый раздел Amazon',
        'Your order has been processed successfully': 'Ваш заказ успешно обработан',
        'New product review available': 'Доступен новый отзыв о продукте',
        'Inventory update: Product back in stock': 'Обновление инвентаря: продукт снова в наличии',
        'Customer inquiry received': 'Получен запрос от клиента',
        'Sales report generated': 'Отчет о продажах сформирован',
        'Понял, спасибо!': 'Понял, спасибо!',
        'Хорошо, давай обсудим это позже': 'Хорошо, давай обсудим это позже',
        'Отлично, я займусь этим': 'Отлично, я займусь этим',
        'Спасибо за информацию': 'Спасибо за информацию',
        'Да, согласен с вами': 'Да, согласен с вами',
        'New customer review posted': 'Опубликован новый отзыв клиента',
        'Product performance report ready': 'Отчет о производительности продукта готов',
        'Inventory alert: Low stock detected': 'Предупреждение о запасах: обнаружен низкий остаток',
        'Customer support ticket created': 'Создан тикет службы поддержки',
        'Sales analytics updated': 'Аналитика продаж обновлена',
        'Привет! Как дела?': 'Привет! Как дела?',
        'Можешь помочь с проектом?': 'Можешь помочь с проектом?',
        'Когда сможем встретиться?': 'Когда сможем встретиться?',
        'Отправил файлы, проверь пожалуйста': 'Отправил файлы, проверь пожалуйста',
        'Есть новости по нашему вопросу?': 'Есть новости по нашему вопросу?',
        'Спасибо за помощь!': 'Спасибо за помощь!',
        'Можешь перезвонить?': 'Можешь перезвонить?',
        'Все готово, можно начинать': 'Все готово, можно начинать'
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
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/stores/page/600E10CE-C8D2-4DF2-91B5-4D7EF7DDC7E0?ingress=2&lp_context_asin=B0DW48QHFY&lp_context_query=gaming&visitId=2d7cd424-748a-4d80-b24c-ce1dad9cc90f&store_ref=bl_ast_dp_brandLogo_sto&ref_=ast_bln YouTube - https://www.youtube.com/@Wylsacom/videos TikTok - https://www.tiktok.com/@fakewylsacom Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Привіт, я RJ Martinez, full-time Amazon Influencer з більш ніж 3 роками досвіду в оглядах і більш ніж 1200 продуктовими відео, опублікованими на Amazon, YouTube і TikTok. Я створюю практичні демонстрації, анбоксинги та лайфстайл-сцени, які відповідають на питання покупців і мотивують їх натиснути «Додати в кошик».',
        'New product review available for your brand': 'Доступний новий відгук про продукт для вашого бренду',
        'Thank you for the update!': 'Дякую за оновлення!',
        'Your product has been featured in Amazon\'s recommended section': 'Ваш продукт був доданий до рекомендованого розділу Amazon',
        'Your order has been processed successfully': 'Ваше замовлення успішно оброблено',
        'New product review available': 'Доступний новий відгук про продукт',
        'Inventory update: Product back in stock': 'Оновлення інвентарю: продукт знову в наявності',
        'Customer inquiry received': 'Отримано запит від клієнта',
        'Sales report generated': 'Звіт про продажі сформовано',
        'Понял, спасибо!': 'Зрозумів, дякую!',
        'Хорошо, давай обсудим это позже': 'Добре, давай обговоримо це пізніше',
        'Отлично, я займусь этим': 'Відмінно, я займуся цим',
        'Спасибо за информацию': 'Дякую за інформацію',
        'Да, согласен с вами': 'Так, згоден з вами',
        'New customer review posted': 'Опубліковано новий відгук клієнта',
        'Product performance report ready': 'Звіт про продуктивність продукту готовий',
        'Inventory alert: Low stock detected': 'Попередження про запаси: виявлено низький залишок',
        'Customer support ticket created': 'Створено тікет служби підтримки',
        'Sales analytics updated': 'Аналітика продажів оновлена',
        'Привет! Как дела?': 'Привіт! Як справи?',
        'Можешь помочь с проектом?': 'Можеш допомогти з проектом?',
        'Когда сможем встретиться?': 'Коли зможемо зустрітися?',
        'Отправил файлы, проверь пожалуйста': 'Відправив файли, перевір будь ласка',
        'Есть новости по нашему вопросу?': 'Є новини з нашого питання?',
        'Спасибо за помощь!': 'Дякую за допомогу!',
        'Можешь перезвонить?': 'Можеш перезвонити?',
        'Все готово, можно начинать': 'Все готово, можна починати'
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
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/stores/page/600E10CE-C8D2-4DF2-91B5-4D7EF7DDC7E0?ingress=2&lp_context_asin=B0DW48QHFY&lp_context_query=gaming&visitId=2d7cd424-748a-4d80-b24c-ce1dad9cc90f&store_ref=bl_ast_dp_brandLogo_sto&ref_=ast_bln YouTube - https://www.youtube.com/@Wylsacom/videos TikTok - https://www.tiktok.com/@fakewylsacom Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ': 
        'Hi, I\'m RJ Martinez, full-time Amazon Influencer with 3 + years of review work and 1,200 + product videos live across Amazon, YouTube & TikTok. I create hands-on demos, unboxings, and lifestyle scenes that answer shopper questions and nudge them to click "Add to Cart." What I deliver via Creator Connections. 60-90 s 4K review with voice-over Amazon-compliant captions & disclosures. 5-day turnaround once the sample arrives Recent wins. Pet bed demo. Grill tool review Some examples of products Simple workflow You ship a unit I film, edit, and upload we both track results in on dashboard. See my style Storefront - https://www.amazon.com/stores/page/600E10CE-C8D2-4DF2-91B5-4D7EF7DDC7E0?ingress=2&lp_context_asin=B0DW48QHFY&lp_context_query=gaming&visitId=2d7cd424-748a-4d80-b24c-ce1dad9cc90f&store_ref=bl_ast_dp_brandLogo_sto&ref_=ast_bln YouTube - https://www.youtube.com/@Wylsacom/videos TikTok - https://www.tiktok.com/@fakewylsacom Launching a new SKU or refreshing a best-seller? Reply here and I\'ll reserve the next shoot slot for you. — RJ',
        'New product review available for your brand': 'New product review available for your brand',
        'Thank you for the update!': 'Thank you for the update!',
        'Your product has been featured in Amazon\'s recommended section': 'Your product has been featured in Amazon\'s recommended section',
        'Your order has been processed successfully': 'Your order has been processed successfully',
        'New product review available': 'New product review available',
        'Inventory update: Product back in stock': 'Inventory update: Product back in stock',
        'Customer inquiry received': 'Customer inquiry received',
        'Sales report generated': 'Sales report generated',
        'Понял, спасибо!': 'Got it, thanks!',
        'Хорошо, давай обсудим это позже': 'Okay, let\'s discuss this later',
        'Отлично, я займусь этим': 'Great, I\'ll take care of it',
        'Спасибо за информацию': 'Thanks for the information',
        'Да, согласен с вами': 'Yes, I agree with you',
        'New customer review posted': 'New customer review posted',
        'Product performance report ready': 'Product performance report ready',
        'Inventory alert: Low stock detected': 'Inventory alert: Low stock detected',
        'Customer support ticket created': 'Customer support ticket created',
        'Sales analytics updated': 'Sales analytics updated',
        'Привет! Как дела?': 'Hi! How are you?',
        'Можешь помочь с проектом?': 'Can you help with the project?',
        'Когда сможем встретиться?': 'When can we meet?',
        'Отправил файлы, проверь пожалуйста': 'Sent the files, please check',
        'Есть новости по нашему вопросу?': 'Any news on our issue?',
        'Спасибо за помощь!': 'Thanks for your help!',
        'Можешь перезвонить?': 'Can you call back?',
        'Все готово, можно начинать': 'Everything is ready, we can start'
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
