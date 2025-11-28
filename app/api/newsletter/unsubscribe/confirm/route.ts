import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { unsubscribeByToken, getSubscriberByToken } from '@/lib/subscribers'

const resend = new Resend(process.env.RESEND_API_KEY)

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
        console.log(`🔍 Attempting to remove ${unsubscribed.email} from Resend Contacts (audience: ${audienceId})...`)
        
        // Get the contact ID by email (case-insensitive search)
        // Note: Resend Contacts API requires pagination for large audiences
        let contactFound = false
        let page = 1
        const limit = 100 // Resend default limit
        let totalContactsChecked = 0
        
        while (!contactFound && page <= 10) { // Limit to 10 pages to avoid infinite loops
          console.log(`   Checking page ${page}...`)
          const contactsResponse = await resend.contacts.list({ 
            audienceId: audienceId,
            page: page,
            limit: limit,
          })
          
          // Debug: Log the response structure
          console.log(`   Response structure:`, {
            hasData: !!contactsResponse?.data,
            dataType: typeof contactsResponse?.data,
            isArray: Array.isArray(contactsResponse?.data),
            responseKeys: contactsResponse ? Object.keys(contactsResponse) : [],
          })
          
          // Handle different possible response structures from Resend API
          let contacts: any[] = []
          
          // Check the actual structure
          if (contactsResponse && typeof contactsResponse === 'object') {
            if (Array.isArray(contactsResponse.data)) {
              contacts = contactsResponse.data
            } else if (contactsResponse.data && typeof contactsResponse.data === 'object') {
              // Check if it's a nested structure
              if (Array.isArray((contactsResponse.data as any).data)) {
                contacts = (contactsResponse.data as any).data
              } else if (Array.isArray((contactsResponse.data as any).contacts)) {
                contacts = (contactsResponse.data as any).contacts
              } else {
                // Try to access directly if it's the response itself
                console.log(`   Trying to parse response data structure...`)
                console.log(`   contactsResponse.data keys:`, contactsResponse.data ? Object.keys(contactsResponse.data) : [])
              }
            }
          }
          
          // Ensure contacts is an array
          if (!Array.isArray(contacts)) {
            console.error(`   ❌ contacts is not an array. Type: ${typeof contacts}, Value:`, contacts)
            console.error(`   Full response:`, JSON.stringify(contactsResponse, null, 2))
            break
          }
          
          totalContactsChecked += contacts.length
          
          console.log(`   Found ${contacts.length} contacts on page ${page} (total checked: ${totalContactsChecked})`)
          
          if (contacts.length === 0) {
            // No more contacts to check
            console.log(`   No more contacts to check.`)
            break
          }
          
          // Find contact by email (case-insensitive)
          const contact = contacts.find((c: any) => {
            const contactEmail = c?.email?.toLowerCase() || ''
            const searchEmail = unsubscribed.email.toLowerCase()
            return contactEmail === searchEmail
          })
          
          if (contact && contact.id) {
            console.log(`   ✅ Found contact: ID=${contact.id}, Email=${contact.email}`)
            
            // Try to update contact to mark as unsubscribed (preferred method)
            try {
              const updateResult = await resend.contacts.update({
                audienceId: audienceId,
                id: contact.id,
                unsubscribed: true,
              })
              console.log(`✅ Successfully marked ${unsubscribed.email} as unsubscribed in Resend Contacts`, {
                contactId: contact.id,
                email: unsubscribed.email,
                audienceId: audienceId,
                result: updateResult,
              })
              contactFound = true
              break
            } catch (updateError: any) {
              // If update fails, try to remove the contact
              console.log(`   ⚠️ Update failed, trying to remove contact instead...`)
              try {
                const removeResult = await resend.contacts.remove({
                  audienceId: audienceId,
                  id: contact.id,
                })
                console.log(`✅ Successfully removed ${unsubscribed.email} from Resend Contacts audience`, {
                  contactId: contact.id,
                  email: unsubscribed.email,
                  audienceId: audienceId,
                  result: removeResult,
                })
                contactFound = true
                break
              } catch (removeError: any) {
                // If both fail, log detailed error
                console.error('❌ Both update and remove failed:', {
                  updateError: {
                    message: updateError?.message,
                    statusCode: updateError?.statusCode,
                  },
                  removeError: {
                    message: removeError?.message,
                    statusCode: removeError?.statusCode,
                  },
                  contactId: contact.id,
                  email: unsubscribed.email,
                  audienceId: audienceId,
                })
                // Don't throw - we still want to mark as unsubscribed locally
                contactFound = true // Mark as found even if update/removal failed
                break
              }
            }
          }
          
          // Check if there are more pages
          if (contacts.length < limit) {
            // Last page
            console.log(`   Last page reached.`)
            break
          }
          
          page++
        }
        
        if (!contactFound) {
          console.log(`ℹ️ Contact ${unsubscribed.email} not found in Resend Contacts audience ${audienceId}`)
          console.log(`   Total contacts checked: ${totalContactsChecked}`)
          console.log(`   This might be normal if:`)
          console.log(`   - The contact was never added to Resend Contacts`)
          console.log(`   - The contact was already removed`)
          console.log(`   - RESEND_AUDIENCE_ID points to a different audience`)
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

