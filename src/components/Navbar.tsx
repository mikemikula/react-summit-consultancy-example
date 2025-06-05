'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Professional navigation bar component for SF Consultancy website
 * Features responsive design with mobile menu, proper ARIA labels, and smooth animations
 * Follows SOLID principles with single responsibility and clean separation of concerns
 */
export default function Navbar(): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  /**
   * Toggle mobile menu state
   * Handles accessibility and user interaction for mobile navigation
   */
  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Close mobile menu when navigation link is clicked
   * Ensures proper UX on mobile devices
   */
  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center"
              onClick={closeMobileMenu}
            >
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                SF Consultancy
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Services
            </Link>
            <Link
              href="/privacy"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle main menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMobileMenu}
          >
            Services
          </Link>
          <Link
            href="/privacy"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMobileMenu}
          >
            Privacy
          </Link>
          <Link
            href="#contact"
            className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMobileMenu}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
