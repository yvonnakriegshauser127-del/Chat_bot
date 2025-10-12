import React from 'react'

const MessageText = ({ children, style = {}, searchTerm = '' }) => {
  // Проверяем, является ли сообщение коротким (меньше 20 символов)
  const isShortMessage = typeof children === 'string' && children.length < 20
  
  const textStyle = {
    wordBreak: 'normal',
    overflowWrap: 'break-word',
    hyphens: 'none',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    // Применяем nowrap только для коротких сообщений
    whiteSpace: isShortMessage ? 'nowrap' : 'normal',
    display: 'inline',
    ...style
  }

  // Функция для подсветки найденного текста
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark 
            key={index} 
            style={{ 
              backgroundColor: '#fff2e8', 
              padding: '1px 2px',
              borderRadius: '2px'
            }}
          >
            {part}
          </mark>
        )
      }
      return part
    })
  }

  return (
    <span style={textStyle}>
      {searchTerm ? highlightSearchTerm(children, searchTerm) : children}
    </span>
  )
}

export default MessageText
