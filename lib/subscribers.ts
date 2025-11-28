import fs from 'fs'
import path from 'path'
import { generateConfirmationToken, generateUnsubscribeToken } from './tokens'

export interface Subscriber {
  email: string
  confirmToken: string
  unsubscribeToken: string
  status: 'pending' | 'confirmed' | 'unsubscribed'
  subscribedAt: string
  confirmedAt?: string
  unsubscribedAt?: string
}

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load subscribers from file
export function loadSubscribers(): Subscriber[] {
  ensureDataDir()
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    return []
  }
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading subscribers:', error)
    return []
  }
}

// Save subscribers to file
export function saveSubscribers(subscribers: Subscriber[]) {
  ensureDataDir()
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))
  } catch (error) {
    console.error('Error saving subscribers:', error)
    throw error
  }
}

// Create a new subscriber (directly confirmed, no double opt-in)
export function createSubscriber(email: string): Subscriber {
  const subscribers = loadSubscribers()

  // Check if email already exists
  const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    // If already confirmed, throw error
    if (existing.status === 'confirmed') {
      throw new Error('Email already subscribed')
    }
    // If pending or unsubscribed, update to confirmed
    existing.confirmToken = generateConfirmationToken() // Keep for backward compatibility
    existing.unsubscribeToken = generateUnsubscribeToken() // Regenerate unsubscribe token
    existing.status = 'confirmed'
    existing.subscribedAt = new Date().toISOString()
    existing.confirmedAt = new Date().toISOString()
    saveSubscribers(subscribers)
    return existing
  }

  const newSubscriber: Subscriber = {
    email: email.toLowerCase(),
    confirmToken: generateConfirmationToken(), // Keep for backward compatibility
    unsubscribeToken: generateUnsubscribeToken(),
    status: 'confirmed', // Directly confirmed, no double opt-in
    subscribedAt: new Date().toISOString(),
    confirmedAt: new Date().toISOString(),
  }

  subscribers.push(newSubscriber)
  saveSubscribers(subscribers)
  return newSubscriber
}

// Confirm a subscriber by token
export function confirmSubscriber(token: string): Subscriber | null {
  const subscribers = loadSubscribers()
  const subscriber = subscribers.find(s => s.confirmToken === token && s.status === 'pending')

  if (subscriber) {
    subscriber.status = 'confirmed'
    subscriber.confirmedAt = new Date().toISOString()
    saveSubscribers(subscribers)
    return subscriber
  }

  return null
}

// Unsubscribe by token
export function unsubscribeByToken(token: string): Subscriber | null {
  const subscribers = loadSubscribers()
  const subscriber = subscribers.find(s => s.unsubscribeToken === token && s.status === 'confirmed')

  if (subscriber) {
    subscriber.status = 'unsubscribed'
    subscriber.unsubscribedAt = new Date().toISOString()
    saveSubscribers(subscribers)
    return subscriber
  }

  return null
}

// Get subscriber by email
export function getSubscriberByEmail(email: string): Subscriber | null {
  const subscribers = loadSubscribers()
  return subscribers.find(s => s.email.toLowerCase() === email.toLowerCase()) || null
}

// Get subscriber by unsubscribe token (for verification before unsubscribe)
export function getSubscriberByToken(token: string): Subscriber | null {
  const subscribers = loadSubscribers()
  return subscribers.find(s => s.unsubscribeToken === token) || null
}

// Get all confirmed subscribers
export function getConfirmedSubscribers(): Subscriber[] {
  const subscribers = loadSubscribers()
  return subscribers.filter(s => s.status === 'confirmed')
}

