import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Test endpoint to verify Resend configuration
 * GET /api/newsletter/test?email=test@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const testEmail = request.nextUrl.searchParams.get('email') || process.env.NEWSLETTER_EMAIL || 'test@example.com'
    
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error: 'RESEND_API_KEY is not configured',
          configured: false,
          audienceIdConfigured: false,
        },
        { status: 500 }
      )
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const audienceId = process.env.RESEND_AUDIENCE_ID

    const results: any = {
      apiKeyConfigured: !!process.env.RESEND_API_KEY,
      audienceIdConfigured: !!audienceId,
      audienceId: audienceId || 'Not configured',
      fromEmail,
      testEmail,
    }

    // Test 1: Send email
    try {
      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: testEmail,
        subject: 'Test Email - Newsletter Configuration',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Test Email</h1>
            <p>If you receive this email, your Resend configuration is working correctly!</p>
            <p><strong>From:</strong> ${fromEmail}</p>
            <p><strong>To:</strong> ${testEmail}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      })
      results.emailTest = {
        success: true,
        emailId: emailResult.id,
      }
    } catch (emailError: any) {
      results.emailTest = {
        success: false,
        error: emailError?.message || 'Unknown error',
        statusCode: emailError?.statusCode,
      }
    }

    // Test 2: Add to Contacts (if audience ID is configured)
    if (audienceId) {
      try {
        const contactResult = await resend.contacts.create({
          audienceId: audienceId,
          email: testEmail,
        })
        results.contactTest = {
          success: true,
          contactId: contactResult.id,
          message: 'Contact added successfully',
        }
      } catch (contactError: any) {
        if (contactError?.message?.includes('already exists') || contactError?.statusCode === 422) {
          results.contactTest = {
            success: true,
            message: 'Contact already exists (this is OK)',
            statusCode: contactError?.statusCode,
          }
        } else {
          results.contactTest = {
            success: false,
            error: contactError?.message || 'Unknown error',
            statusCode: contactError?.statusCode,
            details: contactError,
          }
        }
      }
    } else {
      results.contactTest = {
        success: false,
        message: 'RESEND_AUDIENCE_ID not configured. Cannot test contact creation.',
        instructions: '1. Go to https://resend.com/audiences\n2. Create an audience\n3. Copy the Audience ID\n4. Add RESEND_AUDIENCE_ID=your_audience_id to .env.local',
      }
    }

    return NextResponse.json({
      success: results.emailTest?.success && (results.contactTest?.success !== false),
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

