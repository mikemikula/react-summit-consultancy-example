import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services - Professional Salesforce Consulting',
  description:
    'Comprehensive Salesforce consulting services including implementation, customization, optimization, training, and ongoing support for your business success.',
};

const services = [
  {
    title: 'Salesforce Implementation',
    description:
      'Complete end-to-end Salesforce implementation tailored to your business needs.',
    features: [
      'Requirements gathering and analysis',
      'System architecture and design',
      'Data migration and integration',
      'User training and adoption',
      'Go-live support and optimization',
    ],
    icon: '🚀',
  },
  {
    title: 'Custom Development',
    description:
      'Tailored Salesforce solutions with custom objects, workflows, and applications.',
    features: [
      'Custom objects and fields',
      'Apex and Lightning development',
      'Process automation and workflows',
      'Custom Lightning components',
      'API integrations and third-party connections',
    ],
    icon: '⚙️',
  },
  {
    title: 'System Optimization',
    description:
      'Maximize your existing Salesforce investment with performance improvements.',
    features: [
      'Performance analysis and tuning',
      'Data quality improvement',
      'Process streamlining',
      'Security and compliance review',
      'User experience enhancement',
    ],
    icon: '📈',
  },
  {
    title: 'Training & Support',
    description:
      'Empower your team with comprehensive training and ongoing support.',
    features: [
      'User and administrator training',
      'Best practices workshops',
      'Documentation and knowledge transfer',
      'Ongoing support and maintenance',
      'Change management guidance',
    ],
    icon: '🎓',
  },
  {
    title: 'Data Migration',
    description: 'Seamless data migration from legacy systems to Salesforce.',
    features: [
      'Data mapping and transformation',
      'Quality assurance and validation',
      'Legacy system integration',
      'Duplicate management',
      'Historical data preservation',
    ],
    icon: '📊',
  },
  {
    title: 'Managed Services',
    description:
      'Ongoing Salesforce administration and management for peace of mind.',
    features: [
      'System administration',
      'Regular health checks',
      'User management and provisioning',
      'Release management',
      'Performance monitoring',
    ],
    icon: '🛡️',
  },
];

const processes = [
  {
    step: '01',
    title: 'Discovery & Planning',
    description:
      'We start by understanding your business requirements, current processes, and goals to create a tailored solution strategy.',
  },
  {
    step: '02',
    title: 'Design & Development',
    description:
      'Our experts design and develop your Salesforce solution using best practices and industry standards.',
  },
  {
    step: '03',
    title: 'Testing & Training',
    description:
      'Comprehensive testing ensures quality, while training prepares your team for successful adoption.',
  },
  {
    step: '04',
    title: 'Deployment & Support',
    description:
      'Smooth deployment with ongoing support ensures your success and continuous improvement.',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Our Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Comprehensive Salesforce consulting services designed to transform
              your business processes and drive sustainable growth.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What We Offer
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              From initial implementation to ongoing optimization, we provide
              end-to-end Salesforce solutions.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex gap-x-4 rounded-xl bg-gray-50 dark:bg-gray-800 p-6"
              >
                <div className="text-4xl">{service.icon}</div>
                <div>
                  <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                      >
                        <svg
                          className="mr-2 h-4 w-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Process
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              A proven methodology that ensures successful Salesforce
              implementations and optimizations.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {processes.map((process, index) => (
                <div key={index} className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <span className="text-sm font-bold text-white">
                        {process.step}
                      </span>
                    </div>
                    {process.title}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{process.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-blue-800">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Contact us today to discuss your Salesforce needs and discover how
              we can help transform your business.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/#contact"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/"
                className="text-base font-semibold leading-6 text-white hover:text-blue-100 transition-colors"
              >
                Back to Home <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
