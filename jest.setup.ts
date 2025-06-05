import '@testing-library/jest-dom';

/**
 * Jest setup file for SF Consultancy application
 * Configures testing environment with React Testing Library matchers
 * Sets up global test utilities and mocks for consistent testing experience
 */

// Extend Jest matchers with React Testing Library custom matchers
// This enables assertions like expect(element).toBeInTheDocument()

// Mock Next.js router for testing components that use useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock next/headers for middleware and API route testing
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn(),
    has: jest.fn(),
    entries: jest.fn(() => []),
  })),
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock environment variables for testing
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
});
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.RESEND_API_KEY = 'test_api_key';

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up fetch mock for API testing
global.fetch = jest.fn();

// Mock Web APIs for Next.js compatibility
Object.defineProperty(global, 'Request', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    json: jest.fn(),
    text: jest.fn(),
    headers: new Map(),
  })),
});

Object.defineProperty(global, 'Response', {
  writable: true,
  value: jest.fn().mockImplementation((body, init) => ({
    json: jest.fn().mockResolvedValue(JSON.parse(body || '{}')),
    text: jest.fn().mockResolvedValue(body || ''),
    status: init?.status || 200,
    statusText: init?.statusText || 'OK',
    headers: new Map(Object.entries(init?.headers || {})),
  })),
});

// Mock intersection observer for components that might use it
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
  root: null,
  rootMargin: '0px',
  thresholds: [],
  takeRecords: jest.fn(() => []),
})) as jest.MockedClass<typeof IntersectionObserver>;

// Mock resize observer for responsive components
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock window.matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo for components that use scrolling
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Setup cleanup after each test
afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();

  // Reset fetch mock
  if (global.fetch) {
    (global.fetch as jest.Mock).mockReset();
  }
});

// Global test timeout for async operations
jest.setTimeout(10000);

// Mock Next.js Server Components and Web APIs
// global.Request = jest.fn(); // Already defined with more detail below
// global.Response = jest.fn(); // Will be refined below

// Mock next/server's NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  class MockNextResponse extends originalModule.NextResponse {
    constructor(body: BodyInit | null, init?: ResponseInit) {
      super(body, init);
    }
    // Ensure .json() method is available on instances if needed by some tests,
    // though static NextResponse.json() is more common.
    // This instance .json() should match what a real Response instance .json() does.
    async json() {
      try {
        const bodyStream = (
          this as unknown as { body?: ReadableStream<Uint8Array> }
        ).body;
        if (!bodyStream) return {};
        const reader = bodyStream.getReader();
        const decoder = new TextDecoder();
        let result = '';
        let chunk = await reader.read();
        while (!chunk.done) {
          result += decoder.decode(chunk.value, { stream: true });
          chunk = await reader.read();
        }
        result += decoder.decode(); // Flush remaining
        return JSON.parse(result || '{}');
      } catch {
        return {}; // Fallback for empty or non-JSON body
      }
    }
  }

  return {
    ...originalModule,
    NextResponse: {
      ...originalModule.NextResponse, // Spread static properties like next()
      // Mock the static NextResponse.json(body, init) method
      json: jest.fn((body, init) => {
        // It should return an object that behaves like a Response
        const responseBody = body ? JSON.stringify(body) : null;
        const responseHeaders = new Headers(init?.headers);
        if (body && !responseHeaders.has('content-type')) {
          responseHeaders.set('content-type', 'application/json');
        }
        // Simulate a Response object directly
        return new MockNextResponse(responseBody, {
          ...init,
          headers: responseHeaders,
        });
      }),
      // Keep other static methods like next(), redirect() mocked if needed
      next: jest.fn(() => {
        const res = new MockNextResponse(null, { status: 200 }) as unknown as {
          headers: Headers;
        } & MockNextResponse;
        res.headers = new Headers(); // ensure headers are available
        return res as unknown as MockNextResponse;
      }),
      redirect: jest.fn((url, init) => {
        const status = init?.status || 307;
        const headers = new Headers(init?.headers);
        headers.set('Location', url.toString());
        return new MockNextResponse(null, { status, headers });
      }),
    },
  };
});

// Restore detailed Request mock if it was overwritten or ensure it's correctly placed
Object.defineProperty(global, 'Request', {
  writable: true,
  value: jest.fn().mockImplementation((input, init) => ({
    url: typeof input === 'string' ? input : input.url,
    method: init?.method || 'GET',
    headers: new Map(Object.entries(init?.headers || {})),
    json: jest
      .fn()
      .mockResolvedValue(init?.body ? JSON.parse(init.body.toString()) : {}),
    text: jest.fn().mockResolvedValue(init?.body ? init.body.toString() : ''),
    // Add other Request properties if needed by tests
  })),
});

// global.Response mock was problematic, NextResponse.json is now mocked directly.
// If Response is directly used and needs mocking, it should be done carefully:
// Object.defineProperty(global, 'Response', {
//   writable: true,
//   value: jest.fn().mockImplementation((body, init) => ({
//     json: () => Promise.resolve(body ? JSON.parse(body as string) : {}),
//     text: () => Promise.resolve(body ? String(body) : ''),
//     status: init?.status || 200,
//     statusText: init?.statusText || 'OK',
//     headers: new Map(Object.entries(init?.headers || {})),
//     ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
//   })),
// });
