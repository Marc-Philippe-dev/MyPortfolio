'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { useI18n } from '@/contexts/I18nContext'
import { dataSkills, tools, services as portfolioServices, personalInfo } from '@/lib/portfolioData'
import { useState } from 'react'

export default function About() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'data' | 'tools'>('data')

  const services = portfolioServices.map((service) => ({
    icon: service.icon,
    title: t(`about.services.${service.id}.title`),
    description: t(`about.services.${service.id}.description`),
  }))

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="pt-20">
        {/* About Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <AnimateOnScroll direction="down" delay={0}>
              <h1 className="section-title mb-8">{t('about.title')}</h1>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={100}>
              <div className="space-y-6 text-slate-muted">
                <p className="text-lg">
                  {t('about.intro')}
                </p>
                <p>
                  {t('about.bio1')}
                </p>
                <p>
                  {t('about.bio2')}
                </p>
                <p>
                  {t('about.bio3')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Services Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimateOnScroll direction="down" delay={0}>
            <h2 className="section-title text-center mb-12">{t('about.whatIDo')}</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <AnimateOnScroll key={index} direction="up" delay={index * 100}>
                <div className="card hover-lift h-full flex flex-col">
                  <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-light mb-3">{service.title}</h3>
                  <p className="text-slate-muted flex-grow">{service.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimateOnScroll direction="down" delay={0}>
            <h2 className="section-title text-center mb-12">{t('about.skills')}</h2>
          </AnimateOnScroll>
          
          {/* Tab Buttons */}
          <AnimateOnScroll direction="fade" delay={100}>
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveTab('data')}
                className={`px-6 py-3 rounded font-medium transition-all transform hover:scale-105 ${
                  activeTab === 'data'
                    ? 'bg-mint text-navy scale-105'
                    : 'bg-slate text-slate-muted hover:text-mint border border-slate-700'
                }`}
              >
                {t('about.dataTab')}
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-6 py-3 rounded font-medium transition-all transform hover:scale-105 ${
                  activeTab === 'tools'
                    ? 'bg-mint text-navy scale-105'
                    : 'bg-slate text-slate-muted hover:text-mint border border-slate-700'
                }`}
              >
                {t('about.toolsTab')}
              </button>
            </div>
          </AnimateOnScroll>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(activeTab === 'data' ? dataSkills : tools).map((item, index) => (
              <AnimateOnScroll key={index} direction="fade" delay={index * 50}>
                <div className="bg-slate border border-slate-700 rounded-lg p-4 text-center hover:border-mint/50 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-slate-light font-medium mb-1">{item.name}</div>
                  <div className="text-xs text-slate-muted">{item.category}</div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimateOnScroll direction="fade" delay={0}>
            <div className="bg-slate rounded-lg p-12 text-center border border-slate-700 hover-lift">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-light mb-4">
                {t('about.availableForWork')}
              </h2>
              <p className="text-lg text-slate-muted mb-8 max-w-2xl mx-auto">
                {t('about.availableDescription')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-mint hover:text-mint/80 transition-colors hover:scale-110 inline-block"
                >
                  {personalInfo.email}
                </a>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <a
                  href={`tel:${personalInfo.phone.replace(/\s/g, '')}`}
                  className="text-mint hover:text-mint/80 transition-colors hover:scale-110 inline-block"
                >
                  {personalInfo.phone}
                </a>
              </div>
              <a href="/contact" className="btn-primary inline-block hover-lift">
                {t('about.gotProject')}
              </a>
            </div>
          </AnimateOnScroll>
        </section>
      </main>
      <Footer />
    </div>
  )
}

