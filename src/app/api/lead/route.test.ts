import { NextRequest } from 'next/server';
import { POST, GET, PUT, DELETE, PATCH } from './route';
import { prisma } from '../../../../lib/prisma';

/**
 * Integration tests for lead API route handler
 * Tests request handling, validation, database operations, and error scenarios
 * Mocks external dependencies (Prisma, email) for reliable testing
 */

// Mock Prisma with manual mock for direct import and use
jest.mock('../../../../lib/prisma', () => ({
  prisma: {
    lead: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock email utility
jest.mock('../../../lib/email', () => ({
  sendLeadNotificationEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}));

// Mock rate limiter
jest.mock('../../../../lib/rateLimiter', () => ({
  getClientIp: jest.fn(() => '192.168.1.1'),
  checkLeadSubmissionRateLimit: jest.fn(() =>
    Promise.resolve({
      allowed: true,
      remainingPoints: 2,
      totalHits: 1,
      resetTime: new Date(),
    })
  ),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn((header: string) => {
      if (header === 'user-agent') return 'test-user-agent';
      if (header === 'x-forwarded-for') return '192.168.1.1';
      return null;
    }),
  })),
}));

describe('/api/lead route handler', () => {
  // Shared test data and utilities
  const validLeadData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corp',
    phone: '+1-555-123-4567',
    message: 'We need help with Salesforce implementation for our team.',
  };

  const createMockRequest = (body: unknown): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body),
      headers: new Map([
        ['user-agent', 'test-user-agent'],
        ['x-forwarded-for', '192.168.1.1'],
      ]),
    } as unknown as NextRequest;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.lead.findUnique as jest.Mock).mockReset();
    (prisma.lead.create as jest.Mock).mockReset();

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/lead', () => {
    test('should successfully create a lead with valid data', async () => {
      const mockCreatedLead = {
        id: 'test-lead-id',
        ...validLeadData,
        email: validLeadData.email.toLowerCase(),
        phone: validLeadData.phone || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.lead.create as jest.Mock).mockResolvedValue(mockCreatedLead);

      const request = createMockRequest(validLeadData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.data.leadId).toBe('test-lead-id');
      expect(responseData.redirectUrl).toBe('/thank-you');

      expect(prisma.lead.findUnique).toHaveBeenCalledWith({
        where: { email: validLeadData.email.toLowerCase() },
      });
      expect(prisma.lead.create).toHaveBeenCalledWith({
        data: {
          firstName: validLeadData.firstName,
          lastName: validLeadData.lastName,
          email: validLeadData.email.toLowerCase(),
          company: validLeadData.company,
          phone: validLeadData.phone,
          message: validLeadData.message,
        },
      });
    });

    test('should handle duplicate email submissions gracefully', async () => {
      const existingLead = {
        id: 'existing-lead-id',
        ...validLeadData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(existingLead);

      const request = createMockRequest(validLeadData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.leadId).toBe('existing-lead-id');
      expect(prisma.lead.create).not.toHaveBeenCalled();
    });

    test('should reject invalid JSON request body', async () => {
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await POST(request);

      expect(response.status).toBe(400);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Invalid JSON in request body');
      expect(responseData.errors.general).toContain(
        'Request body must be valid JSON'
      );
    });

    test('should reject request with validation errors', async () => {
      const invalidData = {
        firstName: '', // Required field empty
        lastName: 'Doe',
        email: 'invalid-email', // Invalid email format
        company: '', // Required field empty
        phone: '123', // Invalid phone format
        message: 'Short', // Too short message
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);

      expect(response.status).toBe(400);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'Validation failed. Please check your input.'
      );
      expect(responseData.errors).toBeDefined();

      // Should not attempt database operations
      expect(prisma.lead.findUnique).not.toHaveBeenCalled();
      expect(prisma.lead.create).not.toHaveBeenCalled();
    });

    test('should handle empty phone field correctly', async () => {
      const dataWithEmptyPhone = {
        ...validLeadData,
        phone: '', // Empty phone should be converted to null
      };

      const mockCreatedLead = {
        id: 'test-lead-id',
        ...dataWithEmptyPhone,
        phone: null, // Should be null in database
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.lead.create as jest.Mock).mockResolvedValue(mockCreatedLead);

      const request = createMockRequest(dataWithEmptyPhone);
      const response = await POST(request);

      expect(response.status).toBe(201);

      // Verify phone is converted to null for database
      expect(prisma.lead.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phone: null,
        }),
      });
    });

    test('should handle database constraint violations (duplicate email)', async () => {
      const dbError = {
        code: 'P2002',
        meta: { target: ['email'] },
      };

      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.lead.create as jest.Mock).mockRejectedValue(dbError);

      const request = createMockRequest(validLeadData);
      const response = await POST(request);

      expect(response.status).toBe(409);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'This email address has already been submitted.'
      );
      expect(responseData.errors.email).toContain(
        'Email address already exists'
      );
    });

    test('should handle database connection errors', async () => {
      const dbError = new Error('Database connection failed');

      (prisma.lead.findUnique as jest.Mock).mockRejectedValue(dbError);

      const request = createMockRequest(validLeadData);
      const response = await POST(request);

      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'An internal server error occurred. Please try again later.'
      );
      expect(responseData.errors.general).toContain('Internal server error');
    });

    test('should handle malformed request data gracefully', async () => {
      const malformedData = {
        firstName: validLeadData.firstName,
        // Missing required fields
        email: validLeadData.email,
        // Extra unexpected fields
        unexpectedField: 'unexpected value',
        nested: {
          object: 'should be rejected by validation',
        },
      };

      const request = createMockRequest(malformedData);
      const response = await POST(request);

      expect(response.status).toBe(400);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'Validation failed. Please check your input.'
      );
    });

    test('should log successful lead creation for analytics', async () => {
      const mockCreatedLead = {
        id: 'test-lead-id',
        ...validLeadData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.lead.create as jest.Mock).mockResolvedValue(mockCreatedLead);

      const request = createMockRequest(validLeadData);
      await POST(request);

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('New lead created: test-lead-id from Acme Corp')
      );
    });

    test('should include proper timestamp in response', async () => {
      const mockCreatedLead = {
        id: 'test-lead-id',
        ...validLeadData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.lead.create as jest.Mock).mockResolvedValue(mockCreatedLead);

      const beforeRequest = new Date();
      const request = createMockRequest(validLeadData);
      const response = await POST(request);
      const afterRequest = new Date();

      const responseData = await response.json();
      const responseTimestamp = new Date(responseData.timestamp);

      expect(responseTimestamp).toBeInstanceOf(Date);
      expect(responseTimestamp.getTime()).toBeGreaterThanOrEqual(
        beforeRequest.getTime()
      );
      expect(responseTimestamp.getTime()).toBeLessThanOrEqual(
        afterRequest.getTime()
      );
    });
  });

  describe('HTTP methods other than POST', () => {
    test('GET should return method not allowed', async () => {
      const response = await GET();

      expect(response.status).toBe(405);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'Method not allowed. This endpoint only accepts POST requests.'
      );
    });

    test('PUT should return method not allowed', async () => {
      const response = await PUT();

      expect(response.status).toBe(405);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'Method not allowed. This endpoint only accepts POST requests.'
      );
    });

    test('DELETE should return method not allowed', async () => {
      const response = await DELETE();

      expect(response.status).toBe(405);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'Method not allowed. This endpoint only accepts POST requests.'
      );
    });

    test('PATCH should return method not allowed', async () => {
      const response = await PATCH();

      expect(response.status).toBe(405);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'Method not allowed. This endpoint only accepts POST requests.'
      );
    });
  });

  describe('Error handling and edge cases', () => {
    test('should handle null request body', async () => {
      const request = createMockRequest(null);
      const response = await POST(request);

      expect(response.status).toBe(400);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        'Validation failed. Please check your input.'
      );
    });

    test('should handle undefined request body', async () => {
      const request = createMockRequest(undefined);
      const response = await POST(request);

      expect(response.status).toBe(400);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
    });

    test('should handle array request body', async () => {
      const request = createMockRequest([validLeadData]);
      const response = await POST(request);

      expect(response.status).toBe(400);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
    });

    test('should handle string request body', async () => {
      const request = createMockRequest('invalid string body');
      const response = await POST(request);

      expect(response.status).toBe(400);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
    });

    test('should sanitize and normalize email addresses', async () => {
      const dataWithMixedCaseEmail = {
        ...validLeadData,
        email: 'JOHN.DOE@EXAMPLE.COM',
      };

      const mockCreatedLead = {
        id: 'test-lead-id',
        ...dataWithMixedCaseEmail,
        email: 'john.doe@example.com', // Should be lowercase
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.lead.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.lead.create as jest.Mock).mockResolvedValue(mockCreatedLead);

      const request = createMockRequest(dataWithMixedCaseEmail);
      const response = await POST(request);

      expect(response.status).toBe(201);

      // Verify email is checked and stored in lowercase
      expect(prisma.lead.findUnique).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
      expect(prisma.lead.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'john.doe@example.com',
        }),
      });
    });
  });
});
