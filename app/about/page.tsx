'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { useState } from 'react'

export default function About() {
  const [activeTab, setActiveTab] = useState<'data' | 'tools'>('data')

  const dataSkills = [
    { name: 'Python', category: 'Programming' },
    { name: 'SQL', category: 'Database' },
    { name: 'Apache Airflow', category: 'Orchestration' },
    { name: 'Apache Spark', category: 'Big Data' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Azure', category: 'Cloud' },
    { name: 'Pandas', category: 'Data Processing' },
    { name: 'NumPy', category: 'Data Processing' },
    { name: 'Apache Kafka', category: 'Streaming' },
    { name: 'dbt', category: 'Transformation' },
    { name: 'Snowflake', category: 'Data Warehouse' },
    { name: 'Tableau', category: 'Visualization' },
    { name: 'Power BI', category: 'Visualization' },
    { name: 'Jupyter', category: 'Notebooks' },
  ]

  const tools = [
    { name: 'Git', category: 'Version Control' },
    { name: 'GitHub', category: 'Version Control' },
    { name: 'VS Code', category: 'IDE' },
    { name: 'PyCharm', category: 'IDE' },
    { name: 'DBeaver', category: 'Database Tools' },
    { name: 'Postman', category: 'API Testing' },
    { name: 'Linux', category: 'OS' },
    { name: 'Bash', category: 'Shell' },
  ]

  const services = [
    {
      icon: '📊',
      title: 'Data Pipeline Development',
      description: 'Design and build scalable ETL/ELT pipelines to process large volumes of data efficiently and reliably.',
    },
    {
      icon: '🔍',
      title: 'Data Analysis & Insights',
      description: 'Transform raw data into actionable insights using statistical analysis and data mining techniques.',
    },
    {
      icon: '📈',
      title: 'Data Visualization',
      description: 'Create interactive dashboards and visualizations that make complex data easy to understand.',
    },
    {
      icon: '☁️',
      title: 'Cloud Data Solutions',
      description: 'Build and deploy data solutions on cloud platforms like AWS and Azure for scalability and reliability.',
    },
  ]

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="pt-20">
        {/* About Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <AnimateOnScroll direction="down" delay={0}>
              <h1 className="section-title mb-8">About Me</h1>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={100}>
              <div className="space-y-6 text-slate-muted">
                <p className="text-lg">
                  I'm <span className="text-mint font-semibold">Marc Philippe GNANCADJA</span>, a data engineer and analyst
                  with a passion for turning data into actionable insights.
                </p>
                <p>
                  I was born in Cotonou, Benin, and developed an early interest in computers that grew into a passion
                  during high school. After studying Computer Science Engineering at university in Tunisia, I discovered
                  my calling in the data industry.
                </p>
                <p>
                  Currently, I help businesses around the world by building robust data pipelines, analyzing complex
                  datasets, and creating data-driven solutions that drive decision-making.
                </p>
                <p>
                  Right now I'm based in <span className="text-mint">Gabès, Tunisia</span>.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Services Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimateOnScroll direction="down" delay={0}>
            <h2 className="section-title text-center mb-12">What I Do</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <AnimateOnScroll key={index} direction="up" delay={index * 100}>
                <div className="card hover-lift">
                  <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-light mb-3">{service.title}</h3>
                  <p className="text-slate-muted">{service.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="container mx-auto px-6 py-20">
          <AnimateOnScroll direction="down" delay={0}>
            <h2 className="section-title text-center mb-12">Skills & Tools</h2>
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
                Data Engineering & Analytics
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-6 py-3 rounded font-medium transition-all transform hover:scale-105 ${
                  activeTab === 'tools'
                    ? 'bg-mint text-navy scale-105'
                    : 'bg-slate text-slate-muted hover:text-mint border border-slate-700'
                }`}
              >
                Development Tools
              </button>
            </div>
          </AnimateOnScroll>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(activeTab === 'data' ? dataSkills : tools).map((item, index) => (
              <AnimateOnScroll key={index} direction="scale-in" delay={index * 50}>
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
          <AnimateOnScroll direction="scale-in" delay={0}>
            <div className="bg-slate rounded-lg p-12 text-center border border-slate-700 hover-lift">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-light mb-4">
                I'm currently available for freelance work
              </h2>
              <p className="text-lg text-slate-muted mb-8 max-w-2xl mx-auto">
                If you're looking for a data engineer or analyst that likes to get stuff done, let's talk.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <a
                  href="mailto:contact@marcodev.tech"
                  className="text-mint hover:text-mint/80 transition-colors hover:scale-110 inline-block"
                >
                  contact@marcodev.tech
                </a>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <a
                  href="tel:+21658373582"
                  className="text-mint hover:text-mint/80 transition-colors hover:scale-110 inline-block"
                >
                  +216 58 373 582
                </a>
              </div>
              <a href="/contact" className="btn-primary inline-block hover-lift">
                Got a project in mind? Let's talk!
              </a>
            </div>
          </AnimateOnScroll>
        </section>
      </main>
      <Footer />
    </div>
  )
}

