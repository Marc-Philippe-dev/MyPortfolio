import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'

export default function Home() {
  const projects = [
    {
      title: 'ETL Pipeline for Sales Data',
      description: 'Built a scalable ETL pipeline using Python and Apache Airflow to process and transform sales data from multiple sources into a data warehouse.',
      tags: ['Python', 'Airflow', 'PostgreSQL', 'ETL'],
      category: 'data-engineering' as const,
    },
    {
      title: 'Customer Churn Analysis',
      description: 'Analyzed customer behavior patterns to predict churn using machine learning models, resulting in 15% reduction in customer attrition.',
      tags: ['Python', 'Pandas', 'Scikit-learn', 'Data Analysis'],
      category: 'data-analysis' as const,
    },
    {
      title: 'Real-time Dashboard',
      description: 'Created an interactive dashboard using Tableau to visualize real-time business metrics and KPIs for executive decision-making.',
      tags: ['Tableau', 'SQL', 'Data Visualization'],
      category: 'visualization' as const,
    },
  ]

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="text-mint text-lg mb-4 font-mono">Hi, my name is</p>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-light mb-4">
              Marc Philippe.
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-muted mb-6">
              I build data solutions.
            </h2>
            <p className="text-lg text-slate-muted mb-8 max-w-2xl">
              I'm a data engineer and analyst specializing in building scalable data pipelines,
              transforming raw data into actionable insights, and creating data-driven solutions
              that help businesses make better decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="btn-primary">
                View My Work
              </a>
              <a href="/contact" className="btn-secondary">
                Get In Touch
              </a>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="container mx-auto px-6 py-20">
          <div className="mb-12">
            <h2 className="section-title">
              Featured <span className="text-mint">Projects</span>
            </h2>
            <p className="section-subtitle">
              A selection of my recent work in data engineering and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/about" className="text-mint hover:text-mint/80 transition-colors inline-flex items-center gap-2">
              View All Projects
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="bg-slate rounded-lg p-12 text-center border border-slate-700">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-light mb-4">
              I'm currently available for freelance work
            </h2>
            <p className="text-lg text-slate-muted mb-8 max-w-2xl mx-auto">
              If you're looking for a data engineer or analyst that likes to get stuff done, let's talk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <a
                href="mailto:contact@marcodev.tech"
                className="text-mint hover:text-mint/80 transition-colors"
              >
                contact@marcodev.tech
              </a>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <a
                href="tel:+21658373582"
                className="text-mint hover:text-mint/80 transition-colors"
              >
                +216 58 373 582
              </a>
            </div>
            <Link href="/contact" className="btn-primary inline-block">
              Got a project in mind? Let's talk!
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

