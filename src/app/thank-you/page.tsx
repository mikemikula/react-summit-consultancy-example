import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank You - SF Consultancy',
  description:
    'Thank you for contacting SF Consultancy. We will get back to you soon to discuss your Salesforce needs.',
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-auto text-center px-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Thank You Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Thank You!
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We&apos;ve received your message and will get back to you within 24
            hours to discuss your Salesforce consulting needs.
          </p>

          {/* What's Next */}
          <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What&apos;s Next?
            </h2>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
              <li>• Our team will review your requirements</li>
              <li>
                • We&apos;ll schedule a discovery call at your convenience
              </li>
              <li>• You&apos;ll receive a customized proposal</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Return to Home
            </Link>

            <Link
              href="/services"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Explore Our Services
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need immediate assistance?
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Call us at{' '}
              <a
                href="tel:+1-555-SF-CONSULT"
                className="underline hover:no-underline"
              >
                +1 (555) SF-CONSULT
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
