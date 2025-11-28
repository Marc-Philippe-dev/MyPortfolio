import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Test endpoint to verify unsubscribe functionality
 * GET /api/newsletter/test-unsubscribe?email=test@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const testEmail = request.nextUrl.searchParams.get('email')
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    if (!audienceId) {
      return NextResponse.json(
        { error: 'RESEND_AUDIENCE_ID is not configured' },
        { status: 500 }
      )
    }

    const results: any = {
      email: testEmail,
      audienceId: audienceId,
      steps: [],
    }

    // Step 1: Find the contact
    try {
      console.log('Step 1: Searching for contact...')
      let contactFound = null

      const contactsResponse = await resend.contacts.list({ audienceId })
      const contacts = Array.isArray(contactsResponse?.data) ? contactsResponse.data : []
      const contact = contacts.find((c: any) => c?.email?.toLowerCase() === testEmail.toLowerCase())

      if (contact) {
        contactFound = contact
        results.steps.push({
          step: 'Find Contact',
          success: true,
          contactId: contact.id,
          contactEmail: contact.email,
        })
      }

      if (!contactFound) {
        results.steps.push({
          step: 'Find Contact',
          success: false,
          error: 'Contact not found in audience',
        })
        return NextResponse.json(results)
      }

      // Step 2: Try to update contact (mark as unsubscribed)
      try {
        console.log('Step 2: Attempting to update contact...')
        const updateResult = await resend.contacts.update({
          audienceId: audienceId,
          id: contactFound.id,
          unsubscribed: true,
        })
        results.steps.push({
          step: 'Update Contact (unsubscribed: true)',
          success: true,
          result: updateResult,
        })
      } catch (updateError: any) {
        results.steps.push({
          step: 'Update Contact (unsubscribed: true)',
          success: false,
          error: updateError?.message,
          statusCode: updateError?.statusCode,
          details: updateError,
        })

        // Step 3: If update fails, try to remove
        try {
          console.log('Step 3: Update failed, trying to remove contact...')
          const removeResult = await resend.contacts.remove({
            audienceId: audienceId,
            id: contactFound.id,
          })
          results.steps.push({
            step: 'Remove Contact',
            success: true,
            result: removeResult,
          })
        } catch (removeError: any) {
          results.steps.push({
            step: 'Remove Contact',
            success: false,
            error: removeError?.message,
            statusCode: removeError?.statusCode,
            details: removeError,
          })
        }
      }
    } catch (error: any) {
      results.steps.push({
        step: 'Error',
        success: false,
        error: error?.message || 'Unknown error',
        details: error,
      })
    }

    return NextResponse.json({
      success: results.steps.every((s: any) => s.success !== false),
      results,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Test endpoint error',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

