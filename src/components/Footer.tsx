import Link from 'next/link';

/**
 * Professional footer component for SF Consultancy website
 * Features comprehensive site navigation, contact information, and legal links
 * Follows SOLID principles with clean separation of concerns and single responsibility
 */
export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="font-bold text-xl">SF Consultancy</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Expert Salesforce consulting services to help businesses maximize
              their CRM investment and drive sustainable growth through
              intelligent automation and optimization.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium">Email:</span>{' '}
                <a
                  href="mailto:info@sf-consultancy.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  info@sf-consultancy.com
                </a>
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Phone:</span>{' '}
                <a
                  href="tel:+1-555-SF-CONSULT"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  +1 (555) SF-CONSULT
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/thank-you"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Thank You
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services#implementation"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Implementation
                </Link>
              </li>
              <li>
                <Link
                  href="/services#development"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Custom Development
                </Link>
              </li>
              <li>
                <Link
                  href="/services#optimization"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  System Optimization
                </Link>
              </li>
              <li>
                <Link
                  href="/services#training"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Training & Support
                </Link>
              </li>
              <li>
                <Link
                  href="/services#migration"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Data Migration
                </Link>
              </li>
              <li>
                <Link
                  href="/services#managed"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Managed Services
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>
                © {currentYear} SF Consultancy. All rights reserved. |{' '}
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
            <div className="flex space-x-6">
              {/* Social Media Links - Placeholder for future implementation */}
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
