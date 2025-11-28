'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { useI18n } from '@/contexts/I18nContext'
import { faqs as portfolioFaqs, personalInfo } from '@/lib/portfolioData'
import { useState } from 'react'

interface AccordionItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden hover:border-mint/50 transition-all">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate hover:bg-slate/80 transition-all text-left hover:scale-[1.01]"
      >
        <h3 className="text-lg font-semibold text-slate-light">{question}</h3>
        <svg
          className={`w-5 h-5 text-mint transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-slate/50 border-t border-slate-700 animate-fade-in">
          <p className="text-slate-muted">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function Contact() {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = portfolioFaqs.map((faq) => ({
    question: t(`contact.faqs.${faq.id}.question`),
    answer: t(`contact.faqs.${faq.id}.answer`),
  }))

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="pt-20">
        {/* Contact Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <AnimateOnScroll direction="down" delay={0}>
              <h1 className="section-title text-center mb-4">{t('contact.title')}</h1>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={100}>
              <p className="section-subtitle text-center mb-12">
                {t('contact.subtitle')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll direction="fade" delay={200}>
              <div className="bg-slate rounded-lg p-12 border border-slate-700 mb-12 hover-lift">
                <div className="flex flex-col items-center gap-6">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-2xl font-semibold text-mint hover:text-mint/80 transition-all hover:scale-110"
                  >
                    {personalInfo.email}
                  </a>
                  <a
                    href={`tel:${personalInfo.phone.replace(/\s/g, '')}`}
                    className="text-xl text-slate-muted hover:text-mint transition-all hover:scale-110"
                  >
                    {personalInfo.phone}
                  </a>
                  <a href={`mailto:${personalInfo.email}`} className="btn-primary mt-4 hover-lift">
                    {t('contact.sendEmail')}
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            {/* FAQ Section */}
            <AnimateOnScroll direction="up" delay={300}>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-light mb-8 text-center">
                  {t('contact.faq')}
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AnimateOnScroll key={index} direction="fade" delay={400 + index * 100}>
                      <AccordionItem
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === index}
                        onToggle={() => toggleAccordion(index)}
                      />
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

