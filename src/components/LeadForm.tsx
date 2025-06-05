'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { leadSchema, type LeadFormData } from '@/validators/leadSchema';
import type { LeadSubmissionResponse } from '@/types/lead';

/**
 * Professional lead capture form component for SF Consultancy
 * Features comprehensive validation, accessibility, loading states, error handling, and local storage
 * Follows SOLID principles with single responsibility and proper separation of concerns
 * Implements modern UX patterns with real-time validation, user feedback, and auto-save functionality
 */

// Local storage key for form data persistence
const FORM_STORAGE_KEY = 'sf_consultancy_lead_form';

// Auto-save delay in milliseconds
const AUTO_SAVE_DELAY = 1000;

// Define a more flexible type for the form state if needed, though LeadFormData should be preferred
// type FormInputType = LeadFormData & { phone?: string }; // Example if phone needs explicit wider type for form state

export default function LeadForm(): JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'idle' | 'saving' | 'saved'
  >('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
    clearErrors,
    watch,
    setValue,
    // Cast resolver to any to bypass strict type checking if errors persist, as a last resort
  } = useForm<LeadFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leadSchema) as any, // Temporarily cast to any to bypass resolver type issue
    mode: 'onBlur', // Validate on blur for better UX
    reValidateMode: 'onChange', // Re-validate on change after first validation
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      phone: '',
      message: '',
    },
  });

  // Watch all form values for auto-save functionality
  const watchedValues = watch();

  /**
   * Utility functions for localStorage operations
   * Handles browser compatibility and error cases gracefully
   */
  const isLocalStorageAvailable = useCallback((): boolean => {
    try {
      return typeof window !== 'undefined' && 'localStorage' in window;
    } catch {
      return false;
    }
  }, []);

  const saveToLocalStorage = useCallback(
    (data: Partial<LeadFormData>): void => {
      if (!isLocalStorageAvailable()) return;

      try {
        const filteredData = Object.entries(data).reduce(
          (acc, [key, value]) => {
            if (value && String(value).trim() !== '') {
              acc[key as keyof LeadFormData] = value;
            }
            return acc;
          },
          {} as Partial<LeadFormData>
        );

        if (Object.keys(filteredData).length > 0) {
          localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(filteredData));
          setAutoSaveStatus('saved');

          // Reset status after 2 seconds
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to save form data to localStorage:', error);
      }
    },
    [isLocalStorageAvailable]
  );

  const loadFromLocalStorage = useCallback((): Partial<LeadFormData> | null => {
    if (!isLocalStorageAvailable()) return null;

    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load form data from localStorage:', error);
      return null;
    }
  }, [isLocalStorageAvailable]);

  const clearLocalStorage = useCallback((): void => {
    if (!isLocalStorageAvailable()) return;

    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to clear form data from localStorage:', error);
    }
  }, [isLocalStorageAvailable]);

  /**
   * Load saved form data on component mount
   * Restores user's previous input for better UX
   */
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      Object.entries(savedData).forEach(([key, value]) => {
        if (value) {
          setValue(key as keyof LeadFormData, value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });
    }
  }, [loadFromLocalStorage, setValue]);

  /**
   * Auto-save form data when values change
   * Debounced to avoid excessive localStorage writes
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      if (Object.keys(touchedFields).length > 0) {
        setAutoSaveStatus('saving');
        saveToLocalStorage(watchedValues);
      }
    }, AUTO_SAVE_DELAY);

    return () => clearTimeout(handler);
  }, [watchedValues, saveToLocalStorage, touchedFields]);

  /**
   * Handle form submission with comprehensive error handling and user feedback
   * Processes lead data, validates, and submits to API endpoint
   *
   * @param data - Validated form data from React Hook Form
   */
  const onSubmitHandler: SubmitHandler<LeadFormData> = async (
    data
  ): Promise<void> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      clearErrors();

      // Submit to API endpoint
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: LeadSubmissionResponse = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (result.errors) {
          // Handle field-specific errors
          const firstError = Object.values(result.errors)[0]?.[0];
          setSubmitError(
            firstError || 'Please check your information and try again.'
          );
        } else {
          setSubmitError(
            result.message || 'An error occurred. Please try again.'
          );
        }
        return;
      }

      // Success handling
      setSubmitSuccess(true);
      clearLocalStorage(); // Clear saved form data after successful submission
      reset(); // Clear form

      // Redirect to thank you page after short delay
      setTimeout(() => {
        router.push('/thank-you');
      }, 1500);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Form submission error:', error);
      setSubmitError(
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Clear submission error when user starts typing
   * Provides immediate feedback and better user experience
   */
  const handleInputFocus = (): void => {
    if (submitError) {
      setSubmitError(null);
    }
  };

  /**
   * Generate CSS classes for form inputs based on validation state
   * Provides visual feedback for validation status with high contrast
   *
   * @param fieldName - Name of the form field
   * @returns CSS class string for styling
   */
  const getInputClasses = (fieldName: keyof LeadFormData): string => {
    const baseClasses =
      'mt-2 block w-full rounded-md border-0 px-3.5 py-2 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors duration-200';

    if (errors[fieldName]) {
      return `${baseClasses} ring-red-400 focus:ring-red-600 bg-red-50`;
    }

    if (touchedFields[fieldName] && !errors[fieldName]) {
      return `${baseClasses} ring-green-400 focus:ring-green-600 bg-green-50`;
    }

    return baseClasses;
  };

  // Show success state
  if (submitSuccess) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Thank you for your submission!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  We&apos;ll get back to you within 24 hours. Redirecting...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Auto-save Status Indicator */}
      {autoSaveStatus !== 'idle' && (
        <div className="mb-4 flex items-center justify-center text-sm text-gray-600">
          {autoSaveStatus === 'saving' && (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving draft...
            </>
          )}
          {autoSaveStatus === 'saved' && (
            <>
              <svg
                className="h-4 w-4 mr-2 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-green-600">Draft saved</span>
            </>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="space-y-6"
        noValidate
      >
        {/* First Name and Last Name Row */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              First name *
            </label>
            <div className="mt-2.5">
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                autoComplete="given-name"
                className={getInputClasses('firstName')}
                placeholder="Your first name"
                onFocus={handleInputFocus}
                aria-describedby={
                  errors.firstName ? 'firstName-error' : undefined
                }
                aria-invalid={errors.firstName ? 'true' : 'false'}
              />
              {errors.firstName && (
                <p
                  id="firstName-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Last name *
            </label>
            <div className="mt-2.5">
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                autoComplete="family-name"
                className={getInputClasses('lastName')}
                placeholder="Your last name"
                onFocus={handleInputFocus}
                aria-describedby={
                  errors.lastName ? 'lastName-error' : undefined
                }
                aria-invalid={errors.lastName ? 'true' : 'false'}
              />
              {errors.lastName && (
                <p
                  id="lastName-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Email address *
          </label>
          <div className="mt-2.5">
            <input
              {...register('email')}
              type="email"
              id="email"
              autoComplete="email"
              className={getInputClasses('email')}
              placeholder="your.email@company.com"
              onFocus={handleInputFocus}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Company *
          </label>
          <div className="mt-2.5">
            <input
              {...register('company')}
              type="text"
              id="company"
              autoComplete="organization"
              className={getInputClasses('company')}
              placeholder="Your company name"
              onFocus={handleInputFocus}
              aria-describedby={errors.company ? 'company-error' : undefined}
              aria-invalid={errors.company ? 'true' : 'false'}
            />
            {errors.company && (
              <p
                id="company-error"
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {errors.company.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Phone number <span className="text-gray-500">(optional)</span>
          </label>
          <div className="mt-2.5">
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              autoComplete="tel"
              className={getInputClasses('phone')}
              placeholder="+1 (555) 123-4567"
              onFocus={handleInputFocus}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              aria-invalid={errors.phone ? 'true' : 'false'}
            />
            {errors.phone && (
              <p
                id="phone-error"
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Message *
          </label>
          <div className="mt-2.5">
            <textarea
              {...register('message')}
              id="message"
              rows={4}
              className={getInputClasses('message')}
              placeholder="Tell us about your Salesforce needs, current challenges, or goals. The more details you provide, the better we can help you."
              onFocus={handleInputFocus}
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={errors.message ? 'true' : 'false'}
            />
            {errors.message && (
              <p
                id="message-error"
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Submission Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`
              w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              ${
                isSubmitting || !isValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'
              }
            `}
            aria-describedby="submit-help"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Get Started Today'
            )}
          </button>
          <p
            id="submit-help"
            className="mt-2 text-xs text-gray-500 text-center"
          >
            By submitting this form, you agree to our{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              privacy policy
            </a>
            . We&apos;ll respond within 24 hours.
            <br />
            <span className="text-gray-400">
              💾 Your form data is automatically saved as you type
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
