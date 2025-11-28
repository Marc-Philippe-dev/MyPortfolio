import crypto from 'crypto'

/**
 * Generate a secure random token for email confirmation
 */
export function generateConfirmationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generate a secure random token for unsubscribe
 */
export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

