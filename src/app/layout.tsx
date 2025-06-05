import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'SF Consultancy - Expert Salesforce Implementation & Optimization',
    template: '%s | SF Consultancy',
  },
  description:
    'Professional Salesforce consulting services. We help businesses maximize their Salesforce investment with expert implementation, customization, and optimization solutions.',
  keywords: [
    'Salesforce',
    'consulting',
    'CRM',
    'implementation',
    'customization',
    'optimization',
    'business automation',
  ],
  authors: [{ name: 'SF Consultancy' }],
  creator: 'SF Consultancy',
  publisher: 'SF Consultancy',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sf-consultancy.com',
    title: 'SF Consultancy - Expert Salesforce Implementation & Optimization',
    description:
      'Professional Salesforce consulting services. We help businesses maximize their Salesforce investment.',
    siteName: 'SF Consultancy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SF Consultancy - Expert Salesforce Implementation & Optimization',
    description:
      'Professional Salesforce consulting services. We help businesses maximize their Salesforce investment.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
