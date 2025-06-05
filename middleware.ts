import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, checkLeadSubmissionRateLimit, checkApiRateLimit } from './lib/rateLimiter';

/**
 * Security middleware for SF Consultancy application
 * Implements comprehensive security hardening including:
 * - Security headers (CSP, HSTS, etc.)
 * - Rate limiting protection
 * - Request validation and sanitization
 * - Bot detection and blocking
 * Follows OWASP security best practices and SOLID principles
 */

/**
 * Main middleware function
 * Processes all requests and applies security measures
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Skip middleware for certain paths to avoid conflicts
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  try {
    // 1. Bot detection and blocking
    const botCheckResult = checkForBots(userAgent, pathname);
    if (botCheckResult.block) {
      return createBlockedResponse(botCheckResult.reason || 'Access denied');
    }

    // 2. Rate limiting for API endpoints
    const rateLimitResult = await applyRateLimit(request, pathname);
    if (rateLimitResult.blocked && rateLimitResult.response) {
      return rateLimitResult.response;
    }

    // 3. Request validation and sanitization
    const validationResult = validateRequest(request);
    if (!validationResult.valid) {
      return createBadRequestResponse(validationResult.reason || 'Invalid request');
    }

    // 4. Create response with security headers
    const response = NextResponse.next();
    
    // Apply security headers manually
    applySecurityHeaders(response);
    return response;

  } catch (error) {
    // Log error but don't expose internal details
    console.error('Middleware error:', error);
    
    // Return a generic error response
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

/**
 * Apply comprehensive security headers to response
 * Implements OWASP recommended security headers
 */
function applySecurityHeaders(response: NextResponse): void {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.resend.com https://vercel.live",
    "frame-src 'none'",
    "object-src 'none'",
    "media-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "child-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // HTTP Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains; preload'
  );

  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
  );

  // X-DNS-Prefetch-Control
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  // X-Download-Options
  response.headers.set('X-Download-Options', 'noopen');

  // X-Permitted-Cross-Domain-Policies
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
}

/**
 * Determine if middleware should be skipped for specific paths
 */
function shouldSkipMiddleware(pathname: string): boolean {
  const skipPaths = [
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    '/__vercel/',
    '/api/health',
  ];
  
  return skipPaths.some(path => pathname.startsWith(path)) ||
         pathname.includes('.') && !pathname.startsWith('/api/');
}

/**
 * Check for bots and malicious user agents
 */
function checkForBots(userAgent: string, pathname: string): {
  block: boolean;
  reason?: string;
} {
  // Allow legitimate crawlers for SEO on public pages
  const seoPages = ['/', '/services', '/privacy'];
  const legitimateBots = [/googlebot/i, /bingbot/i];
  
  if (seoPages.includes(pathname)) {
    const isLegitimate = legitimateBots.some(bot => bot.test(userAgent));
    if (isLegitimate) {
      return { block: false };
    }
  }
  
  // Block malicious bots
  const blockedUserAgents = [/bot/i, /crawler/i, /spider/i, /scraper/i];
  const isBadBot = blockedUserAgents.some(pattern => pattern.test(userAgent));
  if (isBadBot) {
    return {
      block: true,
      reason: 'Blocked user agent',
    };
  }
  
  // Block requests without user agent
  if (!userAgent.trim()) {
    return {
      block: true,
      reason: 'Missing user agent',
    };
  }
  
  return { block: false };
}

/**
 * Apply rate limiting to API endpoints
 */
async function applyRateLimit(request: NextRequest, pathname: string): Promise<{
  blocked: boolean;
  response?: NextResponse;
}> {
  if (!pathname.startsWith('/api/')) {
    return { blocked: false };
  }

  try {
    const clientIp = getClientIp(
      Object.fromEntries(request.headers.entries()),
      'unknown'
    );

    let rateLimitResult;
    
    if (pathname.startsWith('/api/lead')) {
      rateLimitResult = await checkLeadSubmissionRateLimit(clientIp);
    } else {
      rateLimitResult = await checkApiRateLimit(clientIp, pathname);
    }

    if (!rateLimitResult.allowed) {
      return {
        blocked: true,
        response: createRateLimitResponse(rateLimitResult),
      };
    }

    return { blocked: false };

  } catch (error) {
    console.error('Rate limiting error:', error);
    return { blocked: false };
  }
}

/**
 * Validate incoming requests for malicious content
 */
function validateRequest(request: NextRequest): {
  valid: boolean;
  reason?: string;
} {
  const { pathname, search } = request.nextUrl;
  
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /\.\.\//, 
    /\.\.\\/,
    /%2e%2e/,
    /\/etc\/passwd/i,
    /\/proc\//,
    /cmd\.exe/i,
    /powershell/i,
  ];
  
  const fullUrl = pathname + search;
  const hasMaliciousPattern = maliciousPatterns.some(pattern => pattern.test(fullUrl));
  
  if (hasMaliciousPattern) {
    return {
      valid: false,
      reason: 'Malicious pattern detected in URL',
    };
  }
  
  return { valid: true };
}

/**
 * Create response functions
 */
function createBlockedResponse(reason: string): NextResponse {
  return new NextResponse('Access Denied', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain',
      'X-Block-Reason': reason,
    },
  });
}

function createRateLimitResponse(rateLimitResult: {
  retryAfter?: number;
  resetTime: Date;
}): NextResponse {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-RateLimit-Reset': rateLimitResult.resetTime.toISOString(),
  };
  
  if (rateLimitResult.retryAfter) {
    headers['Retry-After'] = rateLimitResult.retryAfter.toString();
  }
  
  return new NextResponse(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Please slow down and try again later.',
      retryAfter: rateLimitResult.retryAfter,
      resetTime: rateLimitResult.resetTime.toISOString(),
    }),
    {
      status: 429,
      headers,
    }
  );
}

function createBadRequestResponse(reason: string): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Bad Request',
      message: 'The request could not be processed.',
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'X-Validation-Error': reason,
      },
    }
  );
}

/**
 * Middleware configuration for Next.js
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 