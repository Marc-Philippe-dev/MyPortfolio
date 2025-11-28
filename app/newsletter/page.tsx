'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Newsletter from '@/components/Newsletter'
import NewsletterNotification from '@/components/NewsletterNotification'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { useI18n } from '@/contexts/I18nContext'
import { newsletter } from '@/lib/portfolioData'
import Link from 'next/link'

export default function NewsletterPage() {
  const { t } = useI18n()

  if (!newsletter.enabled) {
    return (
      <div className="min-h-screen bg-navy">
        <Navbar />
        <main className="pt-20">
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-slate-light mb-4">
                Newsletter Unavailable
              </h1>
              <p className="text-slate-muted">
                The newsletter is currently disabled.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <NewsletterNotification />
      <main className="pt-20">
        {/* Newsletter Form Section - First */}
        <section className="container mx-auto px-6 py-12 md:py-20">
          <AnimateOnScroll direction="fade" delay={0}>
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 text-center">
                <Link 
                  href="/" 
                  className="text-mint hover:text-mint/80 transition-colors inline-flex items-center gap-2 group"
                >
                  <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('newsletter.backToHome')}
                </Link>
              </div>
              <Newsletter variant="default" />
            </div>
          </AnimateOnScroll>
        </section>

        {/* Hero Section - After Form */}
        <section className="container mx-auto px-6 py-12 md:py-20">
          <AnimateOnScroll direction="fade" delay={100}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-light mb-6">
                {t('newsletter.pageTitle')}
              </h2>
              <p className="text-lg md:text-xl text-slate-muted mb-12 max-w-2xl mx-auto">
                {t('newsletter.pageDescription')}
              </p>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimateOnScroll direction="up" delay={0}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-light mb-12 text-center">
                {t('newsletter.whatYoullGet')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AnimateOnScroll direction="up" delay={100} className="text-center">
                  <div className="bg-slate rounded-lg p-6 border border-slate-700 hover-lift">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-xl font-bold text-slate-light mb-2">
                      {t('newsletter.benefits.insights.title')}
                    </h3>
                    <p className="text-slate-muted">
                      {t('newsletter.benefits.insights.description')}
                    </p>
                  </div>
                </AnimateOnScroll>
                <AnimateOnScroll direction="up" delay={200} className="text-center">
                  <div className="bg-slate rounded-lg p-6 border border-slate-700 hover-lift">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold text-slate-light mb-2">
                      {t('newsletter.benefits.practices.title')}
                    </h3>
                    <p className="text-slate-muted">
                      {t('newsletter.benefits.practices.description')}
                    </p>
                  </div>
                </AnimateOnScroll>
                <AnimateOnScroll direction="up" delay={300} className="text-center">
                  <div className="bg-slate rounded-lg p-6 border border-slate-700 hover-lift">
                    <div className="text-4xl mb-4">💡</div>
                    <h3 className="text-xl font-bold text-slate-light mb-2">
                      {t('newsletter.benefits.exclusive.title')}
                    </h3>
                    <p className="text-slate-muted">
                      {t('newsletter.benefits.exclusive.description')}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </AnimateOnScroll>
        </section>
      </main>
      <Footer />
    </div>
  )
}

