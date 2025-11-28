import personalData from '@/data/personal.json'
import socialData from '@/data/social.json'
import projectsData from '@/data/projects.json'
import skillsData from '@/data/skills.json'
import servicesData from '@/data/services.json'
import faqsData from '@/data/faqs.json'
import newsletterData from '@/data/newsletter.json'

export interface Project {
  id: string
  tags: string[]
  category: 'data-engineering' | 'data-analysis' | 'visualization'
  link: string | null
  image: string | null
}

export interface Skill {
  name: string
  category: string
}

export interface Service {
  id: string
  icon: string
}

export interface SocialLink {
  url: string
  label: string
}

export const personalInfo = personalData
export const socialLinks = socialData
export const projects = projectsData as Project[]
export const dataSkills = skillsData.data as Skill[]
export const tools = skillsData.tools as Skill[]
export const services = servicesData as Service[]
export const faqs = faqsData
export const newsletter = newsletterData

