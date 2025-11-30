import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { unsubscribeByToken, getSubscriberByToken } from '@/lib/subscribers'

const resend = new Resend(process.env.RESEND_API_KEY)

// Force dynamic rendering since we use request.json() and external APIs
export const dynamic = 'force-dynamic'

/**
 * POST /api/newsletter/unsubscribe/confirm
 * Finalizes the unsubscribe process after user confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Verify token exists and subscriber is confirmed
    const subscriber = getSubscriberByToken(token)
    if (!subscriber || subscriber.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // Unsubscribe the user
    const unsubscribed = unsubscribeByToken(token)

    if (!unsubscribed) {
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    // Mark as unsubscribed in Resend Contacts if audience ID is configured
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (audienceId) {
      try {
        console.log(`🔍 Attempting to mark ${unsubscribed.email} as unsubscribed in Resend Contacts (audience: ${audienceId})...`)
        const contactsResponse = await resend.contacts.list({ audienceId })
        const contacts = Array.isArray(contactsResponse?.data) ? contactsResponse.data : []
        console.log(`   Retrieved ${contacts.length} contacts from Resend audience`)

        const contact = contacts.find(
          (c: any) => c?.email?.toLowerCase() === unsubscribed.email.toLowerCase()
        )

        if (contact && contact.id) {
          try {
            const updateResult = await resend.contacts.update({
              audienceId,
              id: contact.id,
              unsubscribed: true,
            })
            console.log(`✅ Marked ${unsubscribed.email} as unsubscribed in Resend`, {
              contactId: contact.id,
              result: updateResult,
            })
          } catch (updateError: any) {
            console.log(`   ⚠️ Update failed, trying to remove contact instead...`)
            try {
              const removeResult = await resend.contacts.remove({
                audienceId,
                id: contact.id,
              })
              console.log(`✅ Removed ${unsubscribed.email} from Resend Contacts`, {
                contactId: contact.id,
                result: removeResult,
              })
            } catch (removeError: any) {
              console.error('❌ Both update and remove failed:', {
                updateError: updateError?.message,
                removeError: removeError?.message,
                contactId: contact.id,
                email: unsubscribed.email,
                audienceId,
              })
            }
          }
        } else {
          console.log(`ℹ️ Contact ${unsubscribed.email} not found in Resend audience ${audienceId}`)
          console.log(`   Contacts sample:`, contacts.slice(0, 3))
        }
      } catch (contactError: any) {
        // Log error but don't fail the unsubscribe
        console.error('❌ Error updating/removing contact from Resend Contacts:', {
          error: contactError,
          message: contactError?.message,
          statusCode: contactError?.statusCode,
          response: contactError?.response,
          audienceId: audienceId,
          email: unsubscribed.email,
        })
        // Don't fail the unsubscribe if contact update/removal fails
      }
    } else {
      console.warn('⚠️ RESEND_AUDIENCE_ID is not configured. Contact will not be updated in Resend Contacts.')
    }

    // Send confirmation email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    try {
      await resend.emails.send({
        from: fromEmail,
        to: unsubscribed.email,
        subject: 'You have been unsubscribed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a192f; color: #8892b0;">
            <div style="background-color: #112240; padding: 30px; border-radius: 8px; border: 1px solid #64ffda;">
              <h1 style="color: #64ffda; margin-top: 0;">Unsubscribed</h1>
              <p style="color: #8892b0; line-height: 1.6;">
                You have been successfully unsubscribed from our newsletter.
              </p>
              <p style="color: #8892b0; line-height: 1.6;">
                We're sorry to see you go! If you change your mind, you can always subscribe again.
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Error sending unsubscribe confirmation email:', emailError)
      // Don't fail the unsubscribe if email fails
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unsubscribe confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to process unsubscribe' },
      { status: 500 }
    )
  }
}

