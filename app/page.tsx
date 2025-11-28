'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import NewsletterNotification from '@/components/NewsletterNotification'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { useI18n } from '@/contexts/I18nContext'
import { projects as portfolioProjects, personalInfo } from '@/lib/portfolioData'
import Link from 'next/link'

export default function Home() {
  const { t } = useI18n()

  const projects = portfolioProjects.map((project) => ({
    title: t(`projects.${project.id}.title`),
    description: t(`projects.${project.id}.description`),
    tags: project.tags,
    category: project.category,
    link: project.link || undefined,
    image: project.image || undefined,
  }))

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <NewsletterNotification />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <AnimateOnScroll direction="fade" delay={0}>
              <p className="text-mint text-lg mb-4 font-mono animate-pulse-slow">{t('home.greeting')}</p>
            </AnimateOnScroll>
            <AnimateOnScroll direction="down" delay={100}>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-light mb-4">
                {t('home.name')}
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={200}>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-muted mb-6">
                {t('home.title')}
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={300}>
              <p className="text-lg text-slate-muted mb-8 max-w-2xl">
                {t('home.description')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={400}>
              <div className="flex flex-wrap gap-4">
                <a href="#projects" className="btn-primary hover-lift">
                  {t('home.viewWork')}
                </a>
                <a href="/contact" className="btn-secondary hover-lift">
                  {t('home.getInTouch')}
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="container mx-auto px-6 py-20">
          <AnimateOnScroll direction="up" delay={0}>
            <div className="mb-12">
              <h2 className="section-title">
                {t('home.featuredProjects')}
              </h2>
              <p className="section-subtitle">
                {t('home.projectsSubtitle')}
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {projects.map((project, index) => (
              <AnimateOnScroll key={index} direction="up" delay={index * 100} className="h-full">
                <ProjectCard {...project} />
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll direction="fade" delay={400}>
            <div className="text-center mt-12">
              <Link href="/about" className="text-mint hover:text-mint/80 transition-colors inline-flex items-center gap-2 group">
                {t('home.viewAllProjects')}
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimateOnScroll>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimateOnScroll direction="fade" delay={0}>
            <div className="bg-slate rounded-lg p-12 text-center border border-slate-700 hover-lift">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-light mb-4">
                {t('home.availableForWork')}
              </h2>
              <p className="text-lg text-slate-muted mb-8 max-w-2xl mx-auto">
                {t('home.availableDescription')}
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
              <Link href="/contact" className="btn-primary inline-block hover-lift mb-8">
                {t('home.gotProject')}
              </Link>
            </div>
          </AnimateOnScroll>
        </section>
      </main>
      <Footer />
    </div>
  )
}

