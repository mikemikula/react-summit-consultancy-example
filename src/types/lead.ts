import type { LeadFormData } from '@/validators/leadSchema';

/**
 * Core lead types and interfaces for the SF Consultancy application
 * Provides type safety for lead management, form handling, and API responses
 * Follows SOLID principles with clear separation of concerns and single responsibility
 */

/**
 * Database model type that matches Prisma schema
 * Represents the complete lead record as stored in the database
 */
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone?: string | null;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lead data for creation (without auto-generated fields)
 * Used for inserting new leads into the database
 */
export type CreateLeadData = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Lead data for updates (all fields optional except id)
 * Used for partial updates to existing lead records
 */
export type UpdateLeadData = Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: string;
};

/**
 * Public lead data (safe for client-side display)
 * Excludes sensitive information that shouldn't be exposed to the frontend
 */
export type PublicLeadData = Omit<Lead, 'email' | 'phone'>;

/**
 * Form state management types
 * Handles different states of form interaction and validation
 */
export interface FormFieldState {
  value: string;
  error: string | null;
  touched: boolean;
  isValid: boolean;
}

export interface LeadFormState {
  fields: {
    firstName: FormFieldState;
    lastName: FormFieldState;
    email: FormFieldState;
    company: FormFieldState;
    phone: FormFieldState;
    message: FormFieldState;
  };
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
  lastSubmissionTime: Date | null;
}

/**
 * Form validation error types
 * Provides structured error handling for form validation
 */
export interface ValidationError {
  field: keyof LeadFormData;
  message: string;
  code?: string;
}

export interface ValidationResult {
  success: boolean;
  data?: LeadFormData;
  errors?: ValidationError[];
  fieldErrors?: Record<keyof LeadFormData, string[]>;
}

/**
 * API response types for consistent server communication
 * Ensures type safety for all API endpoints and responses
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface LeadSubmissionResponse extends ApiResponse<{ leadId: string }> {
  leadId?: string;
  redirectUrl?: string;
}

export interface LeadListResponse extends ApiResponse<Lead[]> {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * API error types for comprehensive error handling
 * Provides structured error responses with proper HTTP status codes
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

export type ApiErrorCode = 
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_EMAIL'
  | 'RATE_LIMIT_EXCEEDED'
  | 'DATABASE_ERROR'
  | 'EMAIL_SEND_FAILED'
  | 'INTERNAL_SERVER_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND';

/**
 * Email-related types for notification system
 * Handles email templates and sending functionality
 */
export interface EmailTemplate {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  from?: string;
  replyTo?: string;
}

export interface LeadNotificationEmail extends EmailTemplate {
  leadData: LeadFormData;
  submissionId: string;
  submissionTime: Date;
}

export interface WelcomeEmail extends EmailTemplate {
  customerName: string;
  companyName: string;
}

/**
 * Rate limiting types for security and performance
 * Manages request throttling and abuse prevention
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  info: RateLimitInfo;
}

/**
 * Analytics and tracking types for business intelligence
 * Supports lead source tracking and conversion metrics
 */
export interface LeadSource {
  source: string;
  medium: string;
  campaign?: string;
  referrer?: string;
  landingPage?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface LeadAnalytics {
  leadId: string;
  source: LeadSource;
  sessionData?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Configuration types for application settings
 * Manages feature flags and configuration options
 */
export interface LeadFormConfig {
  enablePhoneValidation: boolean;
  enableRateLimiting: boolean;
  maxSubmissionsPerHour: number;
  enableEmailNotifications: boolean;
  requiredFields: (keyof LeadFormData)[];
  enableAnalytics: boolean;
}

/**
 * Utility types for advanced TypeScript patterns
 * Provides helper types for complex operations
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Database query types for type-safe database operations
 * Ensures proper typing for database queries and results
 */
export interface LeadQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof Lead;
  sortOrder?: 'asc' | 'desc';
  filters?: Partial<Pick<Lead, 'company' | 'createdAt'>>;
  search?: string;
}

export interface LeadQueryResult {
  leads: Lead[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

/**
 * Event types for real-time updates and webhooks
 * Supports event-driven architecture for lead management
 */
export type LeadEventType = 
  | 'lead.created'
  | 'lead.updated'
  | 'lead.deleted'
  | 'lead.email_sent'
  | 'lead.email_failed';

export interface LeadEvent {
  type: LeadEventType;
  leadId: string;
  timestamp: Date;
  data: Record<string, unknown>;
  source: string;
}

/**
 * Re-export commonly used types for convenience
 * Provides clean imports for the most frequently used types
 */
export type { LeadFormData } from '@/validators/leadSchema'; 