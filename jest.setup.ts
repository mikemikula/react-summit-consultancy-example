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
