// Сервис для работы с AI (в реальном приложении здесь был бы API)

export const aiService = {
  // Анализ ссылок на соцсети с помощью AI
  analyzeSocialLinks: async (socialLinks, targetLanguage = 'ru', selectedPrompt = null) => {
    // Используем переданный промпт или получаем из localStorage (для обратной совместимости)
    let prompt = null
    
    if (selectedPrompt) {
      // Используем переданный промпт
      prompt = typeof selectedPrompt === 'string' ? selectedPrompt : selectedPrompt.text
    } else {
      // Получаем настройки AI из localStorage (fallback)
      const aiSettings = {
        model: localStorage.getItem('aiSelectedModel') || 'gpt-4o-mini',
        prompts: JSON.parse(localStorage.getItem('aiPrompts') || '[]'),
        selectedPromptId: localStorage.getItem('aiSelectedPromptId')
      }

      // Находим выбранный промпт
      const promptFromStorage = aiSettings.prompts.find(p => p.id === aiSettings.selectedPromptId)
      prompt = promptFromStorage ? promptFromStorage.text : null
    }

    // Формируем промпт для анализа
    const finalPrompt = prompt || `Проанализируй предоставленные ссылки на социальные сети блогера и предоставь информацию о его профилях.`

    // Формируем список ссылок для анализа
    const linksText = socialLinks.map(link => `${link.platform}: ${link.url}`).join('\n')

    // Полный запрос
    const fullPrompt = `${finalPrompt}\n\nСсылки для анализа:\n${linksText}`

    // Здесь будет реальный API вызов в будущем
    // const response = await fetch('/api/analyze-social-links', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt: fullPrompt, links: socialLinks, language: targetLanguage })
    // })
    // const result = await response.json()
    // return result.analysis

    console.log('Отправка промпта на анализ:', {
      prompt: finalPrompt,
      links: socialLinks,
      language: targetLanguage,
      fullPrompt: fullPrompt
    })

    // Имитация запроса к AI API (в реальном приложении здесь был бы реальный API вызов)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Имитация ответа от AI
    const mockAnalysis = `Анализ профилей блогера:

📱 Instagram: @blogger_profile
   • Подписчиков: ~15,000
   • Активность: высокая (5-7 постов в неделю)
   • Ниша: lifestyle, путешествия
   • Вовлеченность: средняя (3-5% лайков)

📘 Facebook: Blogger Name
   • Друзей: ~8,000
   • Группа: путешествия и туризм
   • Активность: регулярная

📺 YouTube: Blogger Channel
   • Подписчиков: ~25,000
   • Видео: 120+
   • Средний просмотр: ~5,000

Общая оценка: Релевантный блогер для сотрудничества с хорошим охватом и активной аудиторией в нише путешествий и lifestyle.`

    return mockAnalysis
  }
}

