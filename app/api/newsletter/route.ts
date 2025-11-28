import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createSubscriber, getSubscriberByEmail } from '@/lib/subscribers'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 500 }
      )
    }

    // Check if email is already confirmed
    const existing = getSubscriberByEmail(email)
    if (existing && existing.status === 'confirmed') {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      )
    }

    // Create subscriber with confirmed status (direct subscription, no double opt-in)
    const subscriber = createSubscriber(email)

    // Add to Resend Contacts if audience ID is configured
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (audienceId) {
      try {
        console.log(`Attempting to add ${subscriber.email} to Resend Contacts (audience: ${audienceId})...`)
        const contactResult = await resend.contacts.create({
          audienceId: audienceId,
          email: subscriber.email,
        })
        console.log(`✅ Successfully added ${subscriber.email} to Resend Contacts:`, {
          contactResult: contactResult,
          audienceId: audienceId,
        })
      } catch (contactError: any) {
        // If contact already exists, that's okay - just log it
        if (contactError?.message?.includes('already exists') || contactError?.statusCode === 422) {
          console.log(`ℹ️ Contact ${subscriber.email} already exists in audience ${audienceId}`)
        } else {
          // Log other errors but don't fail the subscription
          console.error('❌ Error adding contact to Resend Contacts:', {
            error: contactError,
            message: contactError?.message,
            statusCode: contactError?.statusCode,
            response: contactError?.response,
            audienceId: audienceId,
            email: subscriber.email,
          })
        }
      }
    } else {
      console.warn('⚠️ RESEND_AUDIENCE_ID is not configured. Subscriber will not be added to Resend Contacts.')
      console.warn('📝 To enable Resend Contacts integration:')
      console.warn('   1. Go to https://resend.com/audiences')
      console.warn('   2. Create an audience')
      console.warn('   3. Copy the Audience ID')
      console.warn('   4. Add RESEND_AUDIENCE_ID=your_audience_id to .env.local')
    }

    // Get base URL for unsubscribe link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    // Send welcome email (no confirmation needed)
    console.log('Attempting to send welcome email:', {
      from: fromEmail,
      to: email,
      baseUrl,
    })

    try {
      const result = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Welcome to the newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a192f; color: #8892b0;">
            <div style="background-color: #112240; padding: 30px; border-radius: 8px; border: 1px solid #64ffda;">
              <h1 style="color: #64ffda; margin-top: 0;">Welcome! 🎉</h1>
              <p style="color: #8892b0; line-height: 1.6;">
                Thank you for subscribing to our newsletter! You're now part of our newsletter community.
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

      console.log('Welcome email sent successfully:', result)
    } catch (emailError: any) {
      console.error('Error sending welcome email:', {
        error: emailError,
        message: emailError?.message,
        statusCode: emailError?.statusCode,
        response: emailError?.response,
      })

      // Return more detailed error message
      const errorMessage = emailError?.message || 'Failed to send welcome email'
      return NextResponse.json(
        {
          error: 'Failed to send welcome email',
          details: errorMessage,
          // Only include details in development
          ...(process.env.NODE_ENV === 'development' && { debug: emailError })
        },
        { status: 500 }
      )
    }

    // Send notification to admin
    const toEmail = process.env.NEWSLETTER_EMAIL || fromEmail
    try {
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: 'New Newsletter Subscriber',
        html: `
          <h2>New Newsletter Subscription</h2>
          <p><strong>Email:</strong> ${subscriber.email}</p>
          <p><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
        `,
      })
    } catch (error) {
      console.error('Error sending notification email:', error)
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)

    if (error.message === 'Email already subscribed') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}

