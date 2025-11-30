import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { confirmSubscriber } from '@/lib/subscribers'

const resend = new Resend(process.env.RESEND_API_KEY)

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      console.error('Confirmation attempt without token')
      return NextResponse.redirect(new URL('/?error=invalid_token&reason=missing', request.url))
    }

    // Confirm the subscriber
    const subscriber = confirmSubscriber(token)

    if (!subscriber) {
      console.error('Invalid confirmation token:', token.substring(0, 10) + '...')
      // Check if token exists but subscriber is already confirmed or unsubscribed
      const { loadSubscribers } = await import('@/lib/subscribers')
      const subscribers = loadSubscribers()
      const existingSubscriber = subscribers.find(s => s.confirmToken === token)

      if (existingSubscriber) {
        if (existingSubscriber.status === 'confirmed') {
          return NextResponse.redirect(new URL('/?error=already_confirmed', request.url))
        } else if (existingSubscriber.status === 'unsubscribed') {
          return NextResponse.redirect(new URL('/?error=already_unsubscribed', request.url))
        }
      }

      return NextResponse.redirect(new URL('/?error=invalid_token&reason=not_found', request.url))
    }

    // Add to Resend Contacts if audience ID is configured
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (audienceId) {
      try {
        await resend.contacts.create({
          audienceId: audienceId,
          email: subscriber.email,
        })
      } catch (contactError: any) {
        // If contact already exists, that's okay
        if (!contactError?.message?.includes('already exists') && contactError?.statusCode !== 422) {
          console.error('Error adding contact to Resend:', contactError)
        }
      }
    }

    // Send welcome email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
      'http://localhost:3000'
    const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`

    try {
      await resend.emails.send({
        from: fromEmail,
        to: subscriber.email,
        subject: 'Welcome to the newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a192f; color: #8892b0;">
            <div style="background-color: #112240; padding: 30px; border-radius: 8px; border: 1px solid #64ffda;">
              <h1 style="color: #64ffda; margin-top: 0;">Welcome! 🎉</h1>
              <p style="color: #8892b0; line-height: 1.6;">
                Thank you for confirming your subscription! You're now part of our newsletter community.
              </p>
              <p style="color: #8892b0; line-height: 1.6;">
                You'll receive regular updates about data engineering, analytics, and insights from the data world.
              </p>
              <p style="color: #8892b0; font-size: 12px; margin-top: 30px; border-top: 1px solid #64ffda; padding-top: 20px;">
                <a href="${unsubscribeUrl}" style="color: #8892b0; text-decoration: underline;">
                  Unsubscribe
                </a>
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      // Log error but don't fail the confirmation
      console.error('Error sending welcome email:', emailError)
    }

    // Send notification to admin
    const toEmail = process.env.NEWSLETTER_EMAIL || fromEmail
    try {
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: 'New Newsletter Subscriber Confirmed',
        html: `
          <h2>New Newsletter Subscription Confirmed</h2>
          <p><strong>Email:</strong> ${subscriber.email}</p>
          <p><strong>Confirmed At:</strong> ${new Date().toLocaleString()}</p>
        `,
      })
    } catch (error) {
      console.error('Error sending notification email:', error)
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/?newsletter=confirmed', request.url))
  } catch (error) {
    console.error('Confirmation error:', error)
    return NextResponse.redirect(new URL('/?error=confirmation_failed', request.url))
  }
}

