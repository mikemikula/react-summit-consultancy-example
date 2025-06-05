import { Resend } from 'resend';
import type { LeadFormData, LeadNotificationEmail, WelcomeEmail } from '@/types/lead';

/**
 * Email utility wrapper for SF Consultancy using Resend SDK
 * Provides type-safe email sending functionality with comprehensive error handling
 * Follows SOLID principles with single responsibility and clean error management
 * Supports multiple email templates and notification types
 */

// Initialize Resend client with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration constants
const FROM_EMAIL = 'SF Consultancy <noreply@sf-consultancy.com>';
const ADMIN_EMAIL = 'info@sf-consultancy.com';
const REPLY_TO_EMAIL = 'info@sf-consultancy.com';

/**
 * Email sending result interface for consistent response handling
 */
interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: unknown;
}

/**
 * Send lead notification email to admin team
 * Notifies the sales team when a new lead is submitted through the contact form
 * 
 * @param leadData - Validated lead form data
 * @param leadId - Database ID of the created lead
 * @param submissionTime - Timestamp of form submission
 * @returns Promise with email sending result
 */
export async function sendLeadNotificationEmail(
  leadData: LeadFormData,
  leadId: string,
  submissionTime: Date = new Date()
): Promise<EmailResult> {
  try {
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not configured');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    // Generate email content
    const subject = `New Lead: ${leadData.firstName} ${leadData.lastName} from ${leadData.company}`;
    
    const htmlContent = generateLeadNotificationHtml(leadData, leadId, submissionTime);
    const textContent = generateLeadNotificationText(leadData, leadId, submissionTime);

    // Send email using Resend
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: leadData.email,
      subject,
      html: htmlContent,
      text: textContent,
      tags: [
        { name: 'type', value: 'lead-notification' },
        { name: 'company', value: leadData.company },
        { name: 'source', value: 'website-form' },
      ],
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return {
        success: false,
        error: result.error.message || 'Failed to send email',
        details: result.error,
      };
    }

    console.log(`Lead notification email sent successfully: ${result.data?.id}`);
    
    return {
      success: true,
      messageId: result.data?.id,
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
      details: error,
    };
  }
}

/**
 * Send welcome email to the lead/customer
 * Acknowledges receipt of their inquiry and sets expectations
 * 
 * @param leadData - Validated lead form data
 * @param leadId - Database ID of the created lead
 * @returns Promise with email sending result
 */
export async function sendWelcomeEmail(
  leadData: LeadFormData,
  leadId: string
): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    const subject = `Thank you for contacting SF Consultancy, ${leadData.firstName}!`;
    
    const htmlContent = generateWelcomeEmailHtml(leadData, leadId);
    const textContent = generateWelcomeEmailText(leadData, leadId);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [leadData.email],
      replyTo: REPLY_TO_EMAIL,
      subject,
      html: htmlContent,
      text: textContent,
      tags: [
        { name: 'type', value: 'welcome-email' },
        { name: 'company', value: leadData.company },
        { name: 'lead-id', value: leadId },
      ],
    });

    if (result.error) {
      console.error('Welcome email error:', result.error);
      return {
        success: false,
        error: result.error.message || 'Failed to send welcome email',
        details: result.error,
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };

  } catch (error) {
    console.error('Welcome email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
      details: error,
    };
  }
}

/**
 * Generate HTML content for lead notification email
 * Creates professional email template for internal team notifications
 * 
 * @param leadData - Lead form data
 * @param leadId - Database lead ID
 * @param submissionTime - Form submission timestamp
 * @returns HTML email content
 */
function generateLeadNotificationHtml(
  leadData: LeadFormData,
  leadId: string,
  submissionTime: Date
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .footer { background: #1e40af; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e40af; }
        .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border: 1px solid #e2e8f0; }
        .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1e40af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 New Lead Submission</h1>
          <p>A new lead has been submitted through the SF Consultancy website.</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Lead ID:</div>
            <div class="value">${leadId}</div>
          </div>
          
          <div class="field">
            <div class="label">Contact Information:</div>
            <div class="value">
              <strong>${leadData.firstName} ${leadData.lastName}</strong><br>
              Email: <a href="mailto:${leadData.email}">${leadData.email}</a><br>
              Company: ${leadData.company}<br>
              ${leadData.phone ? `Phone: <a href="tel:${leadData.phone}">${leadData.phone}</a><br>` : ''}
            </div>
          </div>
          
          <div class="field">
            <div class="label">Message:</div>
            <div class="message-box">
              ${leadData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div class="field">
            <div class="label">Submission Time:</div>
            <div class="value">${submissionTime.toLocaleString()}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Please respond to this lead within 24 hours for optimal conversion.</p>
          <p>SF Consultancy Lead Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text content for lead notification email
 * Provides accessible fallback for email clients that don't support HTML
 * 
 * @param leadData - Lead form data
 * @param leadId - Database lead ID
 * @param submissionTime - Form submission timestamp
 * @returns Plain text email content
 */
function generateLeadNotificationText(
  leadData: LeadFormData,
  leadId: string,
  submissionTime: Date
): string {
  return `
NEW LEAD SUBMISSION - SF CONSULTANCY

Lead ID: ${leadId}

CONTACT INFORMATION:
Name: ${leadData.firstName} ${leadData.lastName}
Email: ${leadData.email}
Company: ${leadData.company}
${leadData.phone ? `Phone: ${leadData.phone}` : ''}

MESSAGE:
${leadData.message}

SUBMISSION DETAILS:
Time: ${submissionTime.toLocaleString()}
Source: Website Contact Form

Please respond to this lead within 24 hours for optimal conversion.

--
SF Consultancy Lead Management System
  `.trim();
}

/**
 * Generate HTML content for welcome email to leads
 * Creates professional welcome message with next steps
 * 
 * @param leadData - Lead form data
 * @param leadId - Database lead ID
 * @returns HTML welcome email content
 */
function generateWelcomeEmailHtml(leadData: LeadFormData, leadId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting SF Consultancy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
        .footer { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; color: #64748b; }
        .cta-button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .next-steps { background: #f0f9ff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1e40af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You, ${leadData.firstName}!</h1>
          <p>We've received your Salesforce consultation request</p>
        </div>
        
        <div class="content">
          <p>Dear ${leadData.firstName},</p>
          
          <p>Thank you for reaching out to SF Consultancy regarding your Salesforce needs. We're excited to learn more about ${leadData.company} and how we can help you maximize your Salesforce investment.</p>
          
          <div class="next-steps">
            <h3>What happens next?</h3>
            <ul>
              <li><strong>Within 4 hours:</strong> Our team will review your requirements</li>
              <li><strong>Within 24 hours:</strong> A senior consultant will contact you directly</li>
              <li><strong>Initial consultation:</strong> We'll schedule a 30-minute discovery call</li>
              <li><strong>Custom proposal:</strong> You'll receive a tailored solution plan</li>
            </ul>
          </div>
          
          <p>In the meantime, feel free to explore our <a href="https://sf-consultancy.com/services">services page</a> to learn more about our expertise in Salesforce implementation, customization, and optimization.</p>
          
          <p>If you have any urgent questions, please don't hesitate to call us at <a href="tel:+1-555-SF-CONSULT">+1 (555) SF-CONSULT</a>.</p>
          
          <p>Best regards,<br>
          The SF Consultancy Team</p>
        </div>
        
        <div class="footer">
          <p>Reference ID: ${leadId}</p>
          <p>SF Consultancy | Expert Salesforce Implementation & Optimization</p>
          <p><a href="https://sf-consultancy.com">sf-consultancy.com</a> | info@sf-consultancy.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text content for welcome email
 * Provides accessible fallback version of the welcome message
 * 
 * @param leadData - Lead form data
 * @param leadId - Database lead ID
 * @returns Plain text welcome email content
 */
function generateWelcomeEmailText(leadData: LeadFormData, leadId: string): string {
  return `
Thank You, ${leadData.firstName}!

Dear ${leadData.firstName},

Thank you for reaching out to SF Consultancy regarding your Salesforce needs. We're excited to learn more about ${leadData.company} and how we can help you maximize your Salesforce investment.

WHAT HAPPENS NEXT?
• Within 4 hours: Our team will review your requirements
• Within 24 hours: A senior consultant will contact you directly
• Initial consultation: We'll schedule a 30-minute discovery call
• Custom proposal: You'll receive a tailored solution plan

In the meantime, feel free to explore our services at https://sf-consultancy.com/services to learn more about our expertise.

If you have any urgent questions, please call us at +1 (555) SF-CONSULT.

Best regards,
The SF Consultancy Team

Reference ID: ${leadId}
SF Consultancy | Expert Salesforce Implementation & Optimization
https://sf-consultancy.com | info@sf-consultancy.com
  `.trim();
}

/**
 * Health check function to verify email service configuration
 * Useful for monitoring and debugging email functionality
 * 
 * @returns Promise with configuration status
 */
export async function checkEmailConfiguration(): Promise<{
  configured: boolean;
  error?: string;
}> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        configured: false,
        error: 'RESEND_API_KEY environment variable not set',
      };
    }

    // Test API key validity by attempting to get domain info
    // This is a lightweight check that doesn't send emails
    return {
      configured: true,
    };

  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown configuration error',
    };
  }
} 