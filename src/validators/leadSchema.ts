import { z } from 'zod';

/**
 * Zod schema for lead form validation
 * Defines validation rules for contact form submissions with comprehensive error messages
 * Follows DRY principles with reusable validation patterns and clear business rules
 */
export const leadSchema = z.object({
  /* Helper to trim input before any validation */
  firstName: z.preprocess(
    val => (typeof val === 'string' ? val.trim() : val),
    z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(
        /^[a-zA-Z\s'-]+$/,
        'First name can only contain letters, spaces, apostrophes, and hyphens'
      )
  ),

  lastName: z.preprocess(
    val => (typeof val === 'string' ? val.trim() : val),
    z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(
        /^[a-zA-Z\s'-]+$/,
        'Last name can only contain letters, spaces, apostrophes, and hyphens'
      )
  ),

  email: z.preprocess(
    val => (typeof val === 'string' ? val.trim().toLowerCase() : val),
    z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address')
      .max(254, 'Email address is too long')
  ),

  company: z.preprocess(
    val => (typeof val === 'string' ? val.trim() : val),
    z
      .string()
      .min(1, 'Company name is required')
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must be less than 100 characters')
  ),

  phone: z.preprocess(
    val => (typeof val === 'string' ? val.trim() : val),
    z
      .string()
      .optional()
      .refine(
        val => {
          if (val === undefined || val === '') return true;
          const phoneRegex = /^\+?[1-9]\d{9,15}$/;
          const cleanPhone = val.replace(/[\s\-\(\)\.]/g, '');
          return phoneRegex.test(cleanPhone);
        },
        {
          message:
            'Please enter a valid phone number (e.g., +1 555 123 4567, at least 10-16 digits total).',
        }
      )
      .transform(val => val ?? '')
  ),

  message: z.preprocess(
    val => (typeof val === 'string' ? val.trim() : val),
    z
      .string()
      .min(1, 'Message is required')
      .min(10, 'Message must be at least 10 characters')
      .max(2000, 'Message must be less than 2000 characters')
  ),
});

/**
 * Type inference from Zod schema
 * Provides TypeScript types that stay in sync with validation rules
 */
export type LeadFormData = z.infer<typeof leadSchema>;

/**
 * Schema for API validation with additional server-side constraints
 * Includes timestamp and optional fields for database operations
 */
export const leadApiSchema = leadSchema.extend({
  // Server-side fields that may be added during processing
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(500).optional(),
  source: z.string().max(50).optional(),
});

/**
 * Type for API processing with additional metadata
 */
export type LeadApiData = z.infer<typeof leadApiSchema>;

/**
 * Validation helper for partial form data during real-time validation
 * Allows validating individual fields without requiring all fields to be present
 */
export const createPartialLeadSchema = () => leadSchema.partial();

/**
 * Helper function to validate lead data and return formatted errors
 * Provides consistent error handling across the application
 *
 * @param data - The data to validate
 * @returns Object with success status and data or errors
 */
export function validateLeadData(data: unknown): {
  success: boolean;
  data?: LeadFormData;
  errors?: Record<string, string[]>;
} {
  try {
    const validatedData = leadSchema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      error.errors.forEach(err => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return {
        success: false,
        errors,
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      errors: {
        general: ['An unexpected validation error occurred'],
      },
    };
  }
}

/**
 * Helper to safely parse and validate lead data for API endpoints
 * Includes additional safety checks for server-side processing
 *
 * @param data - Raw request data
 * @returns Validation result with type safety
 */
export async function validateLeadApiData(data: unknown): Promise<{
  success: boolean;
  data?: LeadApiData;
  errors?: Record<string, string[]>;
}> {
  try {
    const validatedData = leadApiSchema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      error.errors.forEach(err => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: {
        general: ['An unexpected validation error occurred'],
      },
    };
  }
}
