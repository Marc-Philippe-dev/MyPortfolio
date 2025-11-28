'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useI18n } from '@/contexts/I18nContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimateOnScroll from '@/components/AnimateOnScroll'

export default function UnsubscribePage() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      router.push('/?error=invalid_token')
      return
    }
    setToken(tokenParam)
  }, [searchParams, router])

  const handleUnsubscribe = async () => {
    if (!token) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/newsletter/unsubscribe/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push('/?newsletter=unsubscribed')
        }, 3000)
      } else {
        setStatus('error')
        setErrorMessage(data.error || t('newsletter.unsubscribeError'))
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      setStatus('error')
      setErrorMessage(t('newsletter.errorMessage'))
    }
  }

  const handleCancel = () => {
    router.push('/')
  }

  if (!token) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="pt-20">
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <AnimateOnScroll direction="fade" delay={0}>
              <div className="bg-slate rounded-lg p-8 md:p-12 border border-slate-700">
                {status === 'idle' && (
                  <>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-light mb-4">
                      {t('newsletter.unsubscribeConfirmTitle')}
                    </h1>
                    <p className="text-lg text-slate-muted mb-6">
                      {t('newsletter.unsubscribeConfirmMessage')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <button
                        onClick={handleUnsubscribe}
                        className="px-6 py-3 bg-orange text-white rounded font-medium hover:bg-orange/90 transition-colors"
                      >
                        {t('newsletter.unsubscribeConfirmButton')}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-slate-700 text-slate-light rounded font-medium hover:bg-slate-600 transition-colors"
                      >
                        {t('newsletter.cancelUnsubscribe')}
                      </button>
                    </div>
                  </>
                )}

                {status === 'loading' && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint mx-auto mb-4"></div>
                    <p className="text-slate-muted">{t('newsletter.unsubscribing')}</p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-mint mb-4">
                      {t('newsletter.unsubscribed')}
                    </h2>
                    <p className="text-slate-muted mb-4">
                      {t('newsletter.unsubscribeSuccessMessage')}
                    </p>
                    <p className="text-sm text-slate-muted">
                      {t('newsletter.redirecting')}
                    </p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="text-center">
                    <div className="text-6xl mb-4 text-orange">✗</div>
                    <h2 className="text-2xl font-bold text-orange mb-4">
                      {t('newsletter.errorTitle')}
                    </h2>
                    <p className="text-slate-muted mb-4">
                      {errorMessage || t('newsletter.errorMessage')}
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className="px-6 py-3 bg-mint text-navy rounded font-medium hover:bg-mint/90 transition-colors"
                    >
                      {t('newsletter.backToHome')}
                    </button>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

