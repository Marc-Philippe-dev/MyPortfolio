import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/newsletter/unsubscribe?token=...
 * Redirects to the unsubscribe confirmation page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      console.error('Unsubscribe attempt without token')
      return NextResponse.redirect(new URL('/?error=invalid_token&reason=missing', request.url))
    }

    // Verify token exists before redirecting
    const { getSubscriberByToken } = await import('@/lib/subscribers')
    const subscriber = getSubscriberByToken(token)

    if (!subscriber) {
      console.error('Invalid unsubscribe token:', token.substring(0, 10) + '...')
      return NextResponse.redirect(new URL('/?error=invalid_token&reason=not_found', request.url))
    }

    if (subscriber.status !== 'confirmed') {
      return NextResponse.redirect(new URL('/?error=already_unsubscribed', request.url))
    }

    // Redirect to confirmation page with token
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    return NextResponse.redirect(new URL(`/unsubscribe?token=${token}`, baseUrl))
  } catch (error) {
    console.error('Unsubscribe redirect error:', error)
    return NextResponse.redirect(new URL('/?error=unsubscribe_failed', request.url))
  }
}

