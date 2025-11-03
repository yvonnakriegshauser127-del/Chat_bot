import React, { useState, useEffect, useRef } from 'react'
import { Modal, Spin, Button, Typography, Space, Card, Divider } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from '../hooks/useTranslation'
import { aiService } from '../services/aiService'

const { Paragraph, Text, Title } = Typography

const SocialLinksAnalysisModal = ({
  visible,
  onClose,
  socialLinks = [],
  targetLanguage = 'ru',
  onApprove,
  onReject,
  selectedPrompt = null
}) => {
  const { t } = useTranslation(targetLanguage)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const previousVisibleRef = useRef(false)

  useEffect(() => {
    // Запускаем анализ только когда модальное окно открывается впервые
    if (visible && !previousVisibleRef.current && socialLinks.length > 0) {
      console.log('Starting analysis with links:', socialLinks)
      // Сбрасываем состояние при открытии
      setAnalysisResult(null)
      setError(null)
      setIsAnalyzing(true)
      previousVisibleRef.current = true
      
      // Отправляем запрос на анализ с выбранным промптом
      aiService.analyzeSocialLinks(socialLinks, targetLanguage, selectedPrompt)
        .then((result) => {
          console.log('Analysis result received:', result)
          console.log('Setting analysis result, isAnalyzing will be false')
          setAnalysisResult(result)
          setIsAnalyzing(false)
        })
        .catch((err) => {
          console.error('Analysis error:', err)
          setError(t('analysisError') || 'Ошибка при анализе ссылок')
          setIsAnalyzing(false)
        })
    } else if (!visible && previousVisibleRef.current) {
      // Сбрасываем состояние при закрытии
      console.log('Modal closed, resetting state')
      setAnalysisResult(null)
      setError(null)
      setIsAnalyzing(false)
      previousVisibleRef.current = false
    }
  }, [visible, socialLinks, targetLanguage, selectedPrompt, t])

  const handleApprove = () => {
    if (onApprove) {
      onApprove(analysisResult)
    }
    handleClose()
  }

  const handleReject = () => {
    if (onReject) {
      onReject()
    }
    handleClose()
  }

  const handleClose = () => {
    setAnalysisResult(null)
    setError(null)
    setIsAnalyzing(false)
    onClose()
  }

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      title={t('analyzeSocialLinks') || 'Анализ ссылок на соцсети'}
      width={600}
      footer={[
        <Button key="reject" icon={<CloseOutlined />} onClick={handleReject} disabled={isAnalyzing}>
          {t('reject') || 'Отклонить'}
        </Button>,
        <Button 
          key="approve" 
          type="primary" 
          icon={<CheckOutlined />} 
          onClick={handleApprove} 
          disabled={isAnalyzing || !analysisResult}
        >
          {t('invite') || 'Пригласить'}
        </Button>
      ]}
    >
      {(() => {
        console.log('Rendering modal content:', { isAnalyzing, hasResult: !!analysisResult, hasError: !!error })
        
        if (isAnalyzing) {
          return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <Paragraph style={{ marginTop: '16px', color: '#666' }}>
                {t('analyzingLinks') || 'Анализ ссылок на соцсети...'}
              </Paragraph>
            </div>
          )
        }
        
        if (error) {
          return (
            <div style={{ padding: '20px 0' }}>
              <Paragraph type="danger">{error}</Paragraph>
            </div>
          )
        }
        
        if (analysisResult) {
          return (
        <div style={{ padding: '10px 0' }}>
          <Card 
            size="small" 
            style={{ 
              backgroundColor: '#f8f9fa',
              border: '1px solid #e1e4e8',
              borderRadius: '8px'
            }}
          >
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px' }}>
              {analysisResult.split('\n').map((line, index) => {
                // Форматируем заголовки
                if (line.startsWith('📱') || line.startsWith('📘') || line.startsWith('📺')) {
                  return (
                    <div key={index} style={{ marginTop: index > 0 ? '16px' : '0', marginBottom: '8px' }}>
                      <Text strong style={{ fontSize: '15px', color: '#1890ff' }}>
                        {line}
                      </Text>
                    </div>
                  )
                }
                // Форматируем подпункты
                if (line.trim().startsWith('•')) {
                  return (
                    <div key={index} style={{ marginLeft: '20px', marginBottom: '4px', color: '#595959' }}>
                      {line}
                    </div>
                  )
                }
                // Обычный текст
                if (line.trim()) {
                  return (
                    <div key={index} style={{ marginBottom: '8px', color: '#262626' }}>
                      {line}
                    </div>
                  )
                }
                return <div key={index} style={{ marginBottom: '4px' }} />
              })}
            </div>
          </Card>
        </div>
          )
        }
        
        return null
      })()}
    </Modal>
  )
}

export default SocialLinksAnalysisModal

