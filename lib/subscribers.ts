import { kv } from '@vercel/kv'
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

// Helper to get KV client (with fallback for local development)
async function getKV() {
  // In production, use Vercel KV
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return kv
  }
  
  // Fallback for local development: use in-memory storage
  // This allows local development without KV setup
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ KV not configured. Using in-memory storage (data will be lost on restart).')
    return getInMemoryKV()
  }
  
  throw new Error('KV is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.')
}

// In-memory KV fallback for local development
let inMemoryStore: Map<string, any> = new Map()

function getInMemoryKV() {
  return {
    get: async (key: string) => {
      const value = inMemoryStore.get(key)
      return value ? JSON.parse(JSON.stringify(value)) : null
    },
    set: async (key: string, value: any) => {
      inMemoryStore.set(key, JSON.parse(JSON.stringify(value)))
    },
    del: async (key: string) => {
      inMemoryStore.delete(key)
      return 1
    },
    keys: async (pattern: string) => {
      const regex = new RegExp(pattern.replace('*', '.*'))
      return Array.from(inMemoryStore.keys()).filter(key => regex.test(key))
    },
  }
}

// Key helpers
function getSubscriberKey(email: string): string {
  return `subscriber:email:${email.toLowerCase()}`
}

function getTokenKey(token: string): string {
  return `subscriber:token:${token}`
}

// Load all subscribers (for backward compatibility)
export async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const kvClient = await getKV()
    const keys = await kvClient.keys('subscriber:email:*')
    const subscribers: Subscriber[] = []
    
    for (const key of keys) {
      const subscriber = await kvClient.get(key)
      if (subscriber) {
        subscribers.push(subscriber as Subscriber)
      }
    }
    
    return subscribers
  } catch (error) {
    console.error('Error loading subscribers:', error)
    return []
  }
}

// Save subscriber to KV
async function saveSubscriber(subscriber: Subscriber) {
  const kvClient = await getKV()
  const emailKey = getSubscriberKey(subscriber.email)
  const tokenKey = getTokenKey(subscriber.unsubscribeToken)
  
  // Save subscriber by email
  await kvClient.set(emailKey, subscriber)
  
  // Index by token for quick lookup
  await kvClient.set(tokenKey, subscriber.email)
}

// Create a new subscriber (directly confirmed, no double opt-in)
export async function createSubscriber(email: string): Promise<Subscriber> {
  const kvClient = await getKV()
  const emailKey = getSubscriberKey(email)
  
  // Check if email already exists
  const existing = await kvClient.get(emailKey) as Subscriber | null
  
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
    await saveSubscriber(existing)
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

  await saveSubscriber(newSubscriber)
  return newSubscriber
}

// Confirm a subscriber by token
export async function confirmSubscriber(token: string): Promise<Subscriber | null> {
  const kvClient = await getKV()
  const subscribers = await loadSubscribers()
  const subscriber = subscribers.find(s => s.confirmToken === token && s.status === 'pending')

  if (subscriber) {
    subscriber.status = 'confirmed'
    subscriber.confirmedAt = new Date().toISOString()
    await saveSubscriber(subscriber)
    return subscriber
  }

  return null
}

// Unsubscribe by token
export async function unsubscribeByToken(token: string): Promise<Subscriber | null> {
  const kvClient = await getKV()
  const tokenKey = getTokenKey(token)
  
  // Get email from token index
  const email = await kvClient.get(tokenKey) as string | null
  if (!email) {
    return null
  }
  
  // Get subscriber
  const emailKey = getSubscriberKey(email)
  const subscriber = await kvClient.get(emailKey) as Subscriber | null
  
  if (subscriber && subscriber.status === 'confirmed') {
    subscriber.status = 'unsubscribed'
    subscriber.unsubscribedAt = new Date().toISOString()
    await saveSubscriber(subscriber)
    return subscriber
  }

  return null
}

// Get subscriber by email
export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  try {
    const kvClient = await getKV()
    const emailKey = getSubscriberKey(email)
    const subscriber = await kvClient.get(emailKey) as Subscriber | null
    return subscriber
  } catch (error) {
    console.error('Error getting subscriber by email:', error)
    return null
  }
}

// Get subscriber by unsubscribe token (for verification before unsubscribe)
export async function getSubscriberByToken(token: string): Promise<Subscriber | null> {
  try {
    const kvClient = await getKV()
    const tokenKey = getTokenKey(token)
    const email = await kvClient.get(tokenKey) as string | null
    
    if (!email) {
      return null
    }
    
    const emailKey = getSubscriberKey(email)
    const subscriber = await kvClient.get(emailKey) as Subscriber | null
    return subscriber
  } catch (error) {
    console.error('Error getting subscriber by token:', error)
    return null
  }
}

// Get all confirmed subscribers
export async function getConfirmedSubscribers(): Promise<Subscriber[]> {
  const subscribers = await loadSubscribers()
  return subscribers.filter(s => s.status === 'confirmed')
}
