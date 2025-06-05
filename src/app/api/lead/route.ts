import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { validateLeadData } from '@/validators/leadSchema';
import { prisma } from '../../../../lib/prisma';
import type { LeadSubmissionResponse } from '@/types/lead';

/**
 * API Route Handler for lead form submissions
 * Handles POST requests to create new leads with comprehensive validation,
 * database insertion, email notifications, and security measures
 * Follows REST API best practices and Next.js App Router conventions
 */

/**
 * Handle POST request for lead form submissions
 * Processes lead data with validation, database insertion, and email sending
 * 
 * @param request - Next.js request object containing lead form data
 * @returns JSON response with success/error status and appropriate data
 */
export async function POST(request: NextRequest): Promise<NextResponse<LeadSubmissionResponse>> {
  try {
    // Rate limiting check - get client IP and headers for tracking
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const forwarded = headersList.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';

    // TODO: Implement rate limiting when rateLimiter is available
    // const rateLimitResult = await checkRateLimit(clientIp);
    // if (!rateLimitResult.allowed) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: 'Too many requests. Please try again later.',
    //       errors: { general: ['Rate limit exceeded'] },
    //       timestamp: new Date().toISOString(),
    //     },
    //     { status: 429 }
    //   );
    // }

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON in request body',
          errors: { general: ['Request body must be valid JSON'] },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate lead data using Zod schema
    const validationResult = validateLeadData(requestBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed. Please check your input.',
          errors: validationResult.errors || {},
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const leadData = validationResult.data!;

    // Check for duplicate email addresses
    const existingLead = await prisma.lead.findUnique({
      where: { email: leadData.email.toLowerCase() },
    });

    if (existingLead) {
      // Return success to prevent email enumeration but log internally
      console.log(`Duplicate submission attempt for email: ${leadData.email}`);
      
      // Still return success to user for security reasons
      return NextResponse.json(
        {
          success: true,
          message: 'Thank you for your submission. We will be in touch soon.',
          data: { leadId: existingLead.id },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Create lead in database
    const newLead = await prisma.lead.create({
      data: {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email.toLowerCase(),
        company: leadData.company,
        phone: leadData.phone || null, // Handle empty string as null
        message: leadData.message,
      },
    });

    // TODO: Send email notifications when email utility is available
    // try {
    //   await sendLeadNotificationEmail({
    //     leadData,
    //     leadId: newLead.id,
    //     submissionTime: newLead.createdAt,
    //   });
    // } catch (emailError) {
    //   console.error('Email sending failed:', emailError);
    //   // Don't fail the request if email fails
    // }

    // Log successful submission for analytics
    console.log(`New lead created: ${newLead.id} from ${leadData.company}`);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your submission. We will be in touch within 24 hours.',
        data: { leadId: newLead.id },
        redirectUrl: '/thank-you',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );

  } catch (error) {
    // Log error for debugging but don't expose internal details
    console.error('Lead submission error:', error);

    // Check if it's a database constraint error
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string; meta?: { target?: string[] } };
      
      if (dbError.code === 'P2002') {
        // Unique constraint violation (likely email)
        return NextResponse.json(
          {
            success: false,
            message: 'This email address has already been submitted.',
            errors: { email: ['Email address already exists'] },
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }
    }

    // Generic server error response
    return NextResponse.json(
      {
        success: false,
        message: 'An internal server error occurred. Please try again later.',
        errors: { general: ['Internal server error'] },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Handle GET request - return method not allowed
 * Provides clear feedback that only POST requests are accepted
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. This endpoint only accepts POST requests.',
      timestamp: new Date().toISOString(),
    },
    { status: 405 }
  );
}

/**
 * Handle other HTTP methods - return method not allowed
 * Ensures API endpoint only responds to intended methods
 */
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. This endpoint only accepts POST requests.',
      timestamp: new Date().toISOString(),
    },
    { status: 405 }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. This endpoint only accepts POST requests.',
      timestamp: new Date().toISOString(),
    },
    { status: 405 }
  );
}

export async function PATCH(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. This endpoint only accepts POST requests.',
      timestamp: new Date().toISOString(),
    },
    { status: 405 }
  );
} 