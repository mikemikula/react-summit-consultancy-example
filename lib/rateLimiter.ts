import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';

/**
 * Rate limiting utility for SF Consultancy API endpoints
 * Provides protection against abuse, spam, and DDoS attacks
 * Follows security best practices with configurable limits and Redis support
 * Implements fail-fast patterns for performance and reliability
 */

/**
 * Rate limit configuration interface
 */
interface RateLimitConfig {
  keyPrefix: string;
  points: number; // Number of requests
  duration: number; // Per duration in seconds
  blockDuration: number; // Block duration in seconds
  execEvenly: boolean; // Spread requests evenly across duration
}

/**
 * Rate limit result interface
 */
export interface RateLimitResult {
  allowed: boolean;
  remainingPoints: number;
  totalHits: number;
  resetTime: Date;
  retryAfter?: number;
}

/**
 * Default rate limit configurations for different endpoints
 */
const RATE_LIMIT_CONFIGS = {
  // Lead form submissions - strict limits to prevent spam
  leadSubmission: {
    keyPrefix: 'lead_submission',
    points: 3, // 3 submissions
    duration: 3600, // per hour (3600 seconds)
    blockDuration: 7200, // block for 2 hours if exceeded
    execEvenly: true,
  } as RateLimitConfig,

  // General API requests - more lenient for normal usage
  apiGeneral: {
    keyPrefix: 'api_general',
    points: 100, // 100 requests
    duration: 900, // per 15 minutes (900 seconds)
    blockDuration: 900, // block for 15 minutes if exceeded
    execEvenly: true,
  } as RateLimitConfig,

  // Authentication attempts - very strict to prevent brute force
  auth: {
    keyPrefix: 'auth_attempt',
    points: 5, // 5 attempts
    duration: 900, // per 15 minutes
    blockDuration: 3600, // block for 1 hour if exceeded
    execEvenly: false,
  } as RateLimitConfig,
};

/**
 * Rate limiter instances - using memory storage for MVP
 * In production, these should be backed by Redis for distributed rate limiting
 */
const rateLimiters = {
  leadSubmission: new RateLimiterMemory(RATE_LIMIT_CONFIGS.leadSubmission),
  apiGeneral: new RateLimiterMemory(RATE_LIMIT_CONFIGS.apiGeneral),
  auth: new RateLimiterMemory(RATE_LIMIT_CONFIGS.auth),
};

/**
 * Check rate limit for lead form submissions
 * Implements strict limits to prevent spam and abuse
 * 
 * @param clientIp - Client IP address for tracking
 * @param additionalKey - Optional additional identifier (e.g., user ID, email)
 * @returns Promise with rate limit result
 */
export async function checkLeadSubmissionRateLimit(
  clientIp: string,
  additionalKey?: string
): Promise<RateLimitResult> {
  const key = additionalKey ? `${clientIp}:${additionalKey}` : clientIp;
  
  try {
    const resRateLimiter = await rateLimiters.leadSubmission.consume(key);
    
    return {
      allowed: true,
      remainingPoints: resRateLimiter.remainingPoints,
      totalHits: resRateLimiter.totalHits,
      resetTime: new Date(Date.now() + resRateLimiter.msBeforeNext),
    };
  } catch (rateLimiterRes) {
    // Rate limit exceeded
    const resetTime = new Date(Date.now() + (rateLimiterRes as any).msBeforeNext);
    const retryAfter = Math.round((rateLimiterRes as any).msBeforeNext / 1000);
    
    return {
      allowed: false,
      remainingPoints: 0,
      totalHits: (rateLimiterRes as any).totalHits,
      resetTime,
      retryAfter,
    };
  }
}

/**
 * Check rate limit for general API requests
 * More lenient limits for normal API usage
 * 
 * @param clientIp - Client IP address for tracking
 * @param endpoint - Optional endpoint identifier for granular limiting
 * @returns Promise with rate limit result
 */
export async function checkApiRateLimit(
  clientIp: string,
  endpoint?: string
): Promise<RateLimitResult> {
  const key = endpoint ? `${clientIp}:${endpoint}` : clientIp;
  
  try {
    const resRateLimiter = await rateLimiters.apiGeneral.consume(key);
    
    return {
      allowed: true,
      remainingPoints: resRateLimiter.remainingPoints,
      totalHits: resRateLimiter.totalHits,
      resetTime: new Date(Date.now() + resRateLimiter.msBeforeNext),
    };
  } catch (rateLimiterRes) {
    const resetTime = new Date(Date.now() + (rateLimiterRes as any).msBeforeNext);
    const retryAfter = Math.round((rateLimiterRes as any).msBeforeNext / 1000);
    
    return {
      allowed: false,
      remainingPoints: 0,
      totalHits: (rateLimiterRes as any).totalHits,
      resetTime,
      retryAfter,
    };
  }
}

/**
 * Check rate limit for authentication attempts
 * Very strict limits to prevent brute force attacks
 * 
 * @param clientIp - Client IP address for tracking
 * @param identifier - User identifier (email, username, etc.)
 * @returns Promise with rate limit result
 */
export async function checkAuthRateLimit(
  clientIp: string,
  identifier?: string
): Promise<RateLimitResult> {
  const key = identifier ? `${clientIp}:${identifier}` : clientIp;
  
  try {
    const resRateLimiter = await rateLimiters.auth.consume(key);
    
    return {
      allowed: true,
      remainingPoints: resRateLimiter.remainingPoints,
      totalHits: resRateLimiter.totalHits,
      resetTime: new Date(Date.now() + resRateLimiter.msBeforeNext),
    };
  } catch (rateLimiterRes) {
    const resetTime = new Date(Date.now() + (rateLimiterRes as any).msBeforeNext);
    const retryAfter = Math.round((rateLimiterRes as any).msBeforeNext / 1000);
    
    return {
      allowed: false,
      remainingPoints: 0,
      totalHits: (rateLimiterRes as any).totalHits,
      resetTime,
      retryAfter,
    };
  }
}

/**
 * Get client IP address from request headers
 * Handles various proxy and CDN scenarios for accurate identification
 * 
 * @param headers - Request headers object
 * @param fallbackIp - Fallback IP if extraction fails
 * @returns Client IP address
 */
export function getClientIp(
  headers: Record<string, string | string[] | undefined>,
  fallbackIp: string = 'unknown'
): string {
  // Check various headers that might contain the real client IP
  const forwardedFor = headers['x-forwarded-for'];
  const realIp = headers['x-real-ip'];
  const cfConnectingIp = headers['cf-connecting-ip']; // Cloudflare
  const xClientIp = headers['x-client-ip'];
  
  // x-forwarded-for can contain multiple IPs, take the first one
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    const firstIp = ips.split(',')[0].trim();
    if (firstIp && firstIp !== 'unknown') {
      return firstIp;
    }
  }
  
  // Check other headers
  if (realIp && realIp !== 'unknown') {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }
  
  if (cfConnectingIp && cfConnectingIp !== 'unknown') {
    return Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;
  }
  
  if (xClientIp && xClientIp !== 'unknown') {
    return Array.isArray(xClientIp) ? xClientIp[0] : xClientIp;
  }
  
  return fallbackIp;
}

/**
 * Reset rate limit for a specific key
 * Useful for administrative purposes or special circumstances
 * 
 * @param type - Rate limiter type
 * @param key - Rate limit key to reset
 * @returns Promise resolving when reset is complete
 */
export async function resetRateLimit(
  type: 'leadSubmission' | 'apiGeneral' | 'auth',
  key: string
): Promise<void> {
  try {
    await rateLimiters[type].delete(key);
  } catch (error) {
    console.error(`Failed to reset rate limit for ${type}:${key}`, error);
    throw error;
  }
}

/**
 * Get remaining points for a specific key
 * Useful for providing users with rate limit status
 * 
 * @param type - Rate limiter type
 * @param key - Rate limit key to check
 * @returns Promise with remaining points info
 */
export async function getRateLimit(
  type: 'leadSubmission' | 'apiGeneral' | 'auth',
  key: string
): Promise<{
  remainingPoints: number;
  totalHits: number;
  resetTime: Date;
} | null> {
  try {
    const res = await rateLimiters[type].get(key);
    
    if (!res) {
      return null;
    }
    
    return {
      remainingPoints: res.remainingPoints,
      totalHits: res.totalHits,
      resetTime: new Date(Date.now() + res.msBeforeNext),
    };
  } catch (error) {
    console.error(`Failed to get rate limit for ${type}:${key}`, error);
    return null;
  }
}

/**
 * Middleware helper to add rate limiting to API routes
 * Provides easy integration with Next.js API routes
 * 
 * @param type - Rate limiter type to use
 * @param options - Additional options for rate limiting
 * @returns Middleware function
 */
export function createRateLimitMiddleware(
  type: 'leadSubmission' | 'apiGeneral' | 'auth',
  options: {
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    additionalKeyExtractor?: (headers: Record<string, string | string[] | undefined>) => string;
  } = {}
) {
  return async (
    headers: Record<string, string | string[] | undefined>,
    options: { skipSuccessfulRequests?: boolean; skipFailedRequests?: boolean } = {}
  ): Promise<RateLimitResult> => {
    const clientIp = getClientIp(headers);
    const additionalKey = options.additionalKeyExtractor?.(headers);
    
    switch (type) {
      case 'leadSubmission':
        return checkLeadSubmissionRateLimit(clientIp, additionalKey);
      case 'apiGeneral':
        return checkApiRateLimit(clientIp, additionalKey);
      case 'auth':
        return checkAuthRateLimit(clientIp, additionalKey);
      default:
        throw new Error(`Unknown rate limiter type: ${type}`);
    }
  };
}

/**
 * Configuration validation and health check
 * Ensures rate limiters are properly configured and operational
 * 
 * @returns Promise with configuration status
 */
export async function validateRateLimiterConfiguration(): Promise<{
  valid: boolean;
  errors: string[];
  config: typeof RATE_LIMIT_CONFIGS;
}> {
  const errors: string[] = [];
  
  // Validate configuration values
  Object.entries(RATE_LIMIT_CONFIGS).forEach(([key, config]) => {
    if (config.points <= 0) {
      errors.push(`${key}: points must be greater than 0`);
    }
    if (config.duration <= 0) {
      errors.push(`${key}: duration must be greater than 0`);
    }
    if (config.blockDuration <= 0) {
      errors.push(`${key}: blockDuration must be greater than 0`);
    }
  });
  
  // Test rate limiters
  try {
    const testKey = 'test_' + Date.now();
    await rateLimiters.leadSubmission.consume(testKey);
    await rateLimiters.leadSubmission.delete(testKey);
  } catch (error) {
    errors.push('Lead submission rate limiter test failed');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    config: RATE_LIMIT_CONFIGS,
  };
} 