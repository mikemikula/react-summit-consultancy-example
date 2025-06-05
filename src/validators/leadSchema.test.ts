// Jest globals are available through setup
import {
  leadSchema,
  validateLeadData,
  validateLeadApiData,
  createPartialLeadSchema,
  type LeadFormData,
} from './leadSchema';

/**
 * Unit tests for lead schema validation
 * Tests all validation rules, edge cases, and error scenarios
 * Ensures data integrity and proper error handling throughout the application
 */

describe('leadSchema', () => {
  describe('Valid data validation', () => {
    test('should validate complete valid lead data', () => {
      const validData: LeadFormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'Acme Corp',
        phone: '+1-555-123-4567',
        message:
          'We need help with Salesforce implementation for our growing team.',
      };

      const result = leadSchema.safeParse(validData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    test('should validate lead data without optional phone', () => {
      const validData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.org',
        company: 'Tech Solutions Inc',
        phone: '', // Empty phone should be handled
        message: 'Looking for Salesforce optimization services.',
      };

      const result = leadSchema.safeParse(validData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.phone).toBe('');
      }
    });

    test('should trim whitespace from all string fields', () => {
      const dataWithWhitespace = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  john.doe@example.com  ',
        company: '  Acme Corp  ',
        phone: '  +1-555-123-4567  ',
        message: '  We need Salesforce help.  ',
      };

      const result = leadSchema.safeParse(dataWithWhitespace);
      if (!result.success) {
        // Log the specific Zod errors to understand the failure
        // eslint-disable-next-line no-console
        console.error(
          'Zod validation errors for whitespace test:',
          JSON.stringify(result.error.flatten(), null, 2)
        );
      }
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.firstName).toBe('John');
        expect(result.data.lastName).toBe('Doe');
        expect(result.data.email).toBe('john.doe@example.com');
        expect(result.data.company).toBe('Acme Corp');
        expect(result.data.phone).toBe('+1-555-123-4567');
        expect(result.data.message).toBe('We need Salesforce help.');
      }
    });

    test('should convert email to lowercase', () => {
      const dataWithUppercaseEmail = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'JOHN.DOE@EXAMPLE.COM',
        company: 'Acme Corp',
        phone: '',
        message: 'Test message for validation.',
      };

      const result = leadSchema.safeParse(dataWithUppercaseEmail);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.email).toBe('john.doe@example.com');
      }
    });
  });

  describe('firstName validation', () => {
    test('should reject empty firstName', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name is required');
      }
    });

    test('should reject firstName with less than 2 characters', () => {
      const invalidData = {
        firstName: 'J',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'First name must be at least 2 characters'
        );
      }
    });

    test('should reject firstName with more than 50 characters', () => {
      const invalidData = {
        firstName: 'J'.repeat(51),
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'First name must be less than 50 characters'
        );
      }
    });

    test('should reject firstName with invalid characters', () => {
      const invalidData = {
        firstName: 'John123',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'can only contain letters'
        );
      }
    });

    test('should accept firstName with valid special characters', () => {
      const validNames = ['Mary-Jane', "O'Connor", 'Jean Luc'];

      validNames.forEach(name => {
        const validData = {
          firstName: name,
          lastName: 'Doe',
          email: 'test@example.com',
          company: 'Acme Corp',
          phone: '',
          message: 'Test message',
        };

        const result = leadSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('lastName validation', () => {
    test('should have same validation rules as firstName', () => {
      const invalidData = {
        firstName: 'John',
        lastName: '',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name is required');
      }
    });
  });

  describe('email validation', () => {
    test('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@.com',
        'user@com',
      ];

      invalidEmails.forEach(email => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email,
          company: 'Acme Corp',
          phone: '',
          message: 'Test message',
        };

        const result = leadSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    test('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';

      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: longEmail,
        company: 'Acme Corp',
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'first.last@company.org',
        'user+tag@domain.co.uk',
        'test123@test-domain.com',
      ];

      validEmails.forEach(email => {
        const validData = {
          firstName: 'John',
          lastName: 'Doe',
          email,
          company: 'Acme Corp',
          phone: '',
          message: 'Test message',
        };

        const result = leadSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('company validation', () => {
    test('should reject empty company', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: '',
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Company name is required');
      }
    });

    test('should reject company with more than 100 characters', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'A'.repeat(101),
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('phone validation', () => {
    test('should accept empty phone number', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: 'Test message',
      };

      const result = leadSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should accept valid phone formats', () => {
      const validPhones = [
        '+1-555-123-4567',
        '555-123-4567',
        '5551234567',
        '+44 20 7946 0958',
        '(555) 123-4567',
      ];

      validPhones.forEach(phone => {
        const validData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          company: 'Acme Corp',
          phone,
          message: 'Test message',
        };

        const result = leadSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    test('should reject invalid phone formats', () => {
      const invalidPhones = ['123', 'abc-def-ghij', '+++1234567890', '12345'];

      invalidPhones.forEach(phone => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          company: 'Acme Corp',
          phone,
          message: 'Test message',
        };

        const result = leadSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('message validation', () => {
    test('should reject empty message', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: '',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Message is required');
      }
    });

    test('should reject message with less than 10 characters', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: 'Short',
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Message must be at least 10 characters'
        );
      }
    });

    test('should reject message with more than 2000 characters', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        phone: '',
        message: 'A'.repeat(2001),
      };

      const result = leadSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('validateLeadData helper function', () => {
  test('should return success for valid data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      phone: '',
      message: 'We need help with Salesforce.',
    };

    const result = validateLeadData(validData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validData);
    expect(result.errors).toBeUndefined();
  });

  test('should return formatted errors for invalid data', () => {
    const invalidData = {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
      company: '',
      phone: '123',
      message: '',
    };

    const result = validateLeadData(invalidData);
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.errors).toBeDefined();

    if (result.errors) {
      expect(result.errors['firstName']).toContain('First name is required');
      expect(result.errors['email']).toContain(
        'Please enter a valid email address'
      );
      expect(result.errors['company']).toContain('Company name is required');
      expect(result.errors['message']).toContain('Message is required');
    }
  });

  test('should handle unexpected errors gracefully', () => {
    const result = validateLeadData(null);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});

describe('validateLeadApiData helper function', () => {
  test('should validate data with additional API fields', async () => {
    const validApiData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      phone: '',
      message: 'We need help with Salesforce.',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      source: 'website',
    };

    const result = await validateLeadApiData(validApiData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validApiData);
  });

  test('should reject invalid IP address', async () => {
    const invalidApiData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      phone: '',
      message: 'We need help with Salesforce.',
      ipAddress: 'invalid-ip',
    };

    const result = await validateLeadApiData(invalidApiData);
    expect(result.success).toBe(false);
  });
});

describe('createPartialLeadSchema', () => {
  test('should allow partial validation for real-time form validation', () => {
    const partialSchema = createPartialLeadSchema();

    // Should allow partial data
    const partialData = {
      firstName: 'John',
      email: 'john@example.com',
    };

    const result = partialSchema.safeParse(partialData);
    expect(result.success).toBe(true);
  });

  test('should still validate present fields according to rules', () => {
    const partialSchema = createPartialLeadSchema();

    // Should reject invalid email even in partial validation
    const invalidPartialData = {
      email: 'invalid-email',
    };

    const result = partialSchema.safeParse(invalidPartialData);
    expect(result.success).toBe(false);
  });
});
