'use client'

import { useState } from 'react'
import { useI18n } from '@/contexts/I18nContext'

interface NewsletterProps {
  variant?: 'default' | 'compact'
}

export default function Newsletter({ variant = 'default' }: NewsletterProps) {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email) {
      setErrorMessage(t('newsletter.invalidEmail'))
      setStatus('error')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage(t('newsletter.invalidEmail'))
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setEmail('')
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        // Handle specific error messages
        if (data.error === 'Email already subscribed') {
          setErrorMessage(t('newsletter.alreadySubscribed'))
        } else {
          // Show detailed error in development, generic in production
          const errorMsg = data.details 
            ? `${data.error}: ${data.details}` 
            : data.error || t('newsletter.errorMessage')
          setErrorMessage(errorMsg)
          // Log full error for debugging
          console.error('Newsletter subscription error:', data)
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      setStatus('error')
      setErrorMessage(t('newsletter.errorMessage'))
    }
  }

  if (variant === 'compact') {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            className="flex-1 px-4 py-2 bg-slate border border-slate-700 rounded text-slate-light placeholder-slate-muted focus:outline-none focus:border-mint transition-colors"
            disabled={status === 'loading' || status === 'success'}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-2 bg-mint text-navy rounded font-medium hover:bg-mint/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === 'loading' ? t('newsletter.subscribing') : t('newsletter.buttonText')}
          </button>
        </form>
        {status === 'success' && (
          <p className="mt-2 text-sm text-mint animate-fade-in">{t('newsletter.successMessage')}</p>
        )}
        {status === 'error' && errorMessage && (
          <p className="mt-2 text-sm text-orange animate-fade-in">{errorMessage}</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-slate rounded-lg p-8 border border-slate-700">
      <h3 className="text-2xl font-bold text-slate-light mb-2">{t('newsletter.title')}</h3>
      <p className="text-slate-muted mb-6">{t('newsletter.description')}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder')}
          className="flex-1 px-4 py-3 bg-navy border border-slate-700 rounded text-slate-light placeholder-slate-muted focus:outline-none focus:border-mint transition-colors"
          disabled={status === 'loading' || status === 'success'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-8 py-3 bg-mint text-navy rounded font-medium hover:bg-mint/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? t('newsletter.subscribing') : t('newsletter.buttonText')}
        </button>
      </form>
      {status === 'success' && (
        <p className="mt-4 text-mint animate-fade-in">{t('newsletter.successMessage')}</p>
      )}
      {status === 'error' && errorMessage && (
        <p className="mt-4 text-orange animate-fade-in">{errorMessage}</p>
      )}
    </div>
  )
}

