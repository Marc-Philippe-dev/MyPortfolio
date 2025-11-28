'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useI18n } from '@/contexts/I18nContext'

export default function NewsletterNotification() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [type, setType] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    const newsletter = searchParams.get('newsletter')
    const error = searchParams.get('error')
    const reason = searchParams.get('reason')

    if (newsletter === 'confirmed') {
      setMessage(t('newsletter.confirmed'))
      setType('success')
    } else if (newsletter === 'unsubscribed') {
      setMessage(t('newsletter.unsubscribed'))
      setType('success')
    } else if (error === 'invalid_token') {
      // Show specific message based on reason
      if (reason === 'missing') {
        setMessage(t('newsletter.invalidToken'))
      } else if (reason === 'not_found') {
        setMessage(t('newsletter.tokenExpired'))
      } else {
        setMessage(t('newsletter.invalidToken'))
      }
      setType('error')
    } else if (error === 'already_confirmed') {
      setMessage(t('newsletter.alreadyConfirmed'))
      setType('error')
    } else if (error === 'already_unsubscribed') {
      setMessage(t('newsletter.alreadyUnsubscribed'))
      setType('error')
    } else if (error === 'confirmation_failed' || error === 'unsubscribe_failed') {
      setMessage(t('newsletter.errorMessage'))
      setType('error')
    }

    // Clear URL parameters after showing message
    if (newsletter || error) {
      const timer = setTimeout(() => {
        router.replace('/', { scroll: false })
        setMessage(null)
        setType(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams, router, t])

  if (!message || !type) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div
        className={`px-6 py-4 rounded-lg shadow-lg border ${
          type === 'success'
            ? 'bg-slate border-mint text-mint'
            : 'bg-slate border-orange text-orange'
        }`}
      >
        <p className="font-medium">{message}</p>
      </div>
    </div>
  )
}

