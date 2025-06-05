# Product Requirements Document: MVP Salesforce Consultancy Website

## 1. Introduction

This document outlines the requirements for the Minimum Viable Product (MVP) of a website for a Salesforce consultancy. The primary goal of this MVP is to establish an online presence, clearly articulate the consultancy's specialization in custom Apex solutions and API integrations, and generate leads through a built-in lead funnel.

## 2. Goals

*   **Establish Online Presence**: Create a professional website that serves as the digital face of the consultancy.
*   **Clearly Communicate Services**: Inform potential clients about the consultancy's expertise in Salesforce, particularly custom Apex development and complex API integrations.
*   **Lead Generation**: Capture contact information and marketing consent from interested prospects through a streamlined lead funnel.
*   **Validate Market Interest**: Gather initial data on service interest and lead quality.

## 3. Target Audience

*   **Businesses using Salesforce**: Companies of various sizes (Small, Medium, Enterprise) currently utilizing Salesforce CRM.
*   **CTOs, IT Managers, Salesforce Administrators**: Individuals within these companies who are responsible for Salesforce implementations, customizations, and integrations.
*   **Companies needing custom solutions**: Organizations that require bespoke Apex code or intricate API integrations to enhance their Salesforce instance, which cannot be met by off-the-shelf solutions.

## 4. Key Features

### 4.1. Homepage
*   **Purpose**: Welcome visitors, provide a concise overview of the consultancy's value proposition, and guide them to key sections of the site.
*   **Content**:
    *   Compelling headline and sub-headline.
    *   Brief introduction to the consultancy and its specialization.
    *   Clear Call-to-Action (CTA) buttons (e.g., "Learn More About Our Services," "Get a Free Consultation").
    *   Testimonials or client logos (if available, placeholder otherwise).
    *   Professionally designed and visually appealing layout.

### 4.2. Services Page
*   **Purpose**: Detail the specific services offered, focusing on custom Apex solutions and API integrations.
*   **Content**:
    *   In-depth explanation of custom Apex development capabilities (e.g., triggers, batch Apex, Lightning Web Components).
    *   Information on API integration expertise (e.g., integrating Salesforce with ERPs, financial systems, third-party applications).
    *   Case studies or examples of past work (if available, placeholder otherwise).
    *   Benefits of choosing the consultancy for these specialized services.
    *   Clear CTAs related to service inquiries.

### 4.3. Lead Funnel (Contact Form / "Get a Quote" Page)
*   **Purpose**: Capture lead information from potential clients.
*   **Placement**: Accessible via prominent CTAs throughout the site (e.g., in the header, footer, on Services page). Can be a dedicated page or a modal.
*   **Functionality**:
    *   Form for collecting contact information.
    *   Data validation for all fields.
    *   Submission confirmation.
    *   Data storage (backend integration).

### 4.4. Thank You Page
*   **Purpose**: Confirm successful form submission and set expectations.
*   **Content**:
    *   Confirmation message (e.g., "Thank you for your inquiry!").
    *   Information on next steps (e.g., "We will contact you within 24 hours.").
    *   Optionally, links to valuable resources or blog posts.

## 5. User Stories (MVP)

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-01 | As a *prospective client*, I can quickly comprehend the consultancy's core offering from the homepage so that I immediately know if it matches my needs. | 1. Homepage headline explicitly mentions "Salesforce Custom Apex & API Integrations".<br/>2. Service overview section visible within first viewport on desktop (≤ 768 px on mobile).<br/>3. Primary CTA button scrolls or navigates to the Services page. |
| US-02 | As a *prospective client*, I can submit my contact info and project details via a form so that the consultancy can contact me. | 1. Form collects required fields: Name, Work Email.<br/>2. Optional fields: Company, Phone, Project Description.<br/>3. Form cannot submit without required fields.<br/>4. Successful submission stores data in PostgreSQL `Lead` table and returns 200 response. |
| US-03 | As a *prospective client*, I can opt-in to marketing emails by ticking a consent checkbox so that I receive future updates. | 1. Checkbox unchecked by default.<br/>2. Submission with checkbox checked stores `marketingConsent = true`.<br/>3. Privacy-policy link opens `/privacy` page. |
| US-04 | As a *prospective client*, I receive an on-screen confirmation after submitting my details so I know my request was processed. | 1. Redirect to `/thank-you` page within 1 s of successful API response.<br/>2. Thank-you page reiterates expected response time (< 24 h). |
| US-05 | As a *consultancy team member*, I receive an email notification with lead details when a new form is submitted so I can follow up promptly. | 1. System sends email via transactional provider (e.g., Resend, SendGrid).<br/>2. Email contains Name, Company, Email, Phone, Consent flag, Timestamp.<br/>3. Email delivery errors logged server-side. |

## 6. Lead Funnel Details

The lead funnel will be implemented as a contact form with the following fields:

*   **Full Name**: Text input, required.
*   **Company Name**: Text input, optional.
*   **Work Email**: Email input, required, validated format.
*   **Phone Number**: Text input (supporting international formats if necessary), optional.
*   **Project Description/Enquiry**: Text area, optional, to allow users to provide details about their needs.
*   **Marketing Consent Checkbox**:
    *   Label: "I agree to receive marketing emails and communications from [Consultancy Name]."
    *   Checkbox, unchecked by default (opt-in).
    *   Link to a concise Privacy Policy (initially, this can be a simple statement, to be expanded later).

## 7. Design and Branding

*   **Look and Feel**: Professional, modern, trustworthy, and tech-savvy.
*   **Visuals**: High-quality images and graphics relevant to Salesforce, technology, and business solutions.
*   **Responsiveness**: Fully responsive design, ensuring optimal viewing and interaction experience across desktops, tablets, and mobile devices.
*   **Accessibility**: Adherence to basic web accessibility standards (WCAG AA where feasible for MVP).

## 8. Technology Stack

*   **Frontend**: Next.js (React framework)
*   **Styling**: Tailwind CSS v4
*   **Language**: TypeScript
*   **Backend**: Node.js runtime via **Next.js 15 Route Handlers** (no separate Express server required)
*   **ORM**: Prisma
*   **Database**: PostgreSQL
*   **Package Manager**: PNPM
*   **Deployment**: **Vercel** – serverless hosting, automatic SSL, preview deployments.

### 8.1 Versioning Standards
* Node.js 20.x LTS
* Next.js 15.x
* TypeScript 5.x
* Tailwind CSS 4.x
* Prisma 5.x
* PostgreSQL 15.x

## 9. Dependency Setup Sequence (Build Workflow)

| # | Dependency / Tool | Install Command (pnpm) | Purpose | When Used |
|---|------------------|------------------------|---------|-----------|
| 1 | Git + GitHub repo | N/A (initialize locally) | Version control & CI/CD hooks | Project initialization |
| 2 | Node.js 20.x & pnpm 8.x | `brew install node` / `corepack enable pnpm` | Runtime & package management | Local dev environment |
| 3 | create-next-app (w/ TS template) | `pnpm create next-app@latest -- --typescript` | Scaffold Next.js project with TS | Day 0 |
| 3a | Pin Next.js 15 | `pnpm add next@15 react@latest react-dom@latest` | Ensure project uses Next.js 15 stable/canary | After scaffold |
| 4 | Tailwind CSS v4 | `pnpm add -D tailwindcss@latest postcss autoprefixer`<br/>`pnpm exec tailwindcss init -p` | Utility-first styling | Immediately after project scaffold |
| 5 | ESLint + Prettier + Airbnb config | `pnpm add -D eslint @typescript-eslint/eslint-plugin eslint-config-airbnb` etc. | Code quality & formatting | Pre-commit |
| 6 | Husky + lint-staged | `pnpm add -D husky lint-staged` | Pre-commit linting | Pre-commit |
| 7 | Zod | `pnpm add zod` | Runtime & compile-time schema validation | Form validation layer |
| 8 | React Hook Form | `pnpm add react-hook-form` | Declarative form state management | Lead funnel UI |
| 9 | PostgreSQL 15 (local/docker) | `brew install postgresql@15` | Relational database | After initial UI ready |
|10 | Prisma 5.x | `pnpm add -D prisma`<br/>`pnpm add @prisma/client` | ORM & migrations | DB layer setup |
|11 | dotenv | `pnpm add -D dotenv` | Environment variable management | Immediately after DB connection |
|12 | Security libs (helmet/next-secure-headers & rate-limiter-flexible) | `pnpm add helmet next-secure-headers rate-limiter-flexible` | Secure HTTP headers & API rate limiting | Before first production deploy |
|13 | Testing libs (Jest, RTL) | `pnpm add -D jest @testing-library/react` | Unit & integration tests | After core features |
|14 | Vercel CLI | `pnpm add -g vercel` | Deployment & previews on Vercel | Continuous deployment |

> **Rationale**: Dependencies are listed in the exact order they will be introduced during development, enabling a linear, fail-fast workflow. Each step builds upon the previous, ensuring minimal context-switching and clear ownership.

### 9.1 File Structure (MVP)

```
.
├── app
│   ├── layout.tsx                  # Root layout with global styles & metadata
│   ├── page.tsx                    # Homepage
│   ├── services
│   │   └── page.tsx               # Services page
│   ├── thank-you
│   │   └── page.tsx               # Post-submission confirmation
│   └── api
│       └── lead
│           └── route.ts           # POST /api/lead endpoint
├── components
│   ├── LeadForm.tsx               # Reusable lead-capture form component
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib
│   ├── prisma.ts                  # Singleton Prisma client
│   ├── rateLimiter.ts             # IP rate-limiter helper
│   └── email.ts                   # Email provider SDK wrapper
├── validators
│   └── leadSchema.ts              # Zod schema for lead validation
├── types
│   └── lead.ts                    # Type declarations & interfaces
├── prisma
│   ├── schema.prisma              # Data model
│   └── migrations/                # Auto-generated by Prisma
├── public
│   └── favicon.ico
├── styles
│   └── globals.css                # Tailwind base + custom styles
├── middleware.ts                  # next-secure-headers + rate-limit
├── tailwind.config.ts
├── postcss.config.js
├── jest.config.ts                 # Testing config
├── tsconfig.json
├── next.config.js
├── .env.example                   # Non-secret env placeholder
├── .gitignore
├── README.md
└── package.json (managed by pnpm)
```

> **Note**: File names follow conventional Next.js (App Router) structure and adhere to separation of concerns (pages, components, libs, validators).

### 9.2 Rendering & Data-Fetching Strategy

| Path / File | Component Type | Render Strategy | Rationale |
|-------------|---------------|-----------------|-----------|
| `app/layout.tsx` | Server Component | Shared layout, static at build | Contains global CSS + metadata only. |
| `app/page.tsx` (Home) | Server Component | **Static Generation (SSG)** | Pure marketing content—no runtime data. |
| `app/services/page.tsx` | Server Component | **Static Generation (SSG)** | Service descriptions rarely change; rebuild on edit. |
| `app/thank-you/page.tsx` | Server Component | **Static Generation (SSG)** | Fixed confirmation text. |
| `components/LeadForm.tsx` | **Client Component** | CSR (Hydrated) | Uses `react-hook-form`, interactive validation. |
| `app/api/lead/route.ts` | Server Route Handler | **Server-side only** | Processes POST, talks to DB & email provider. |
| `middleware.ts` | Edge Middleware | Runs per-request | Adds security headers & rate limiting. |

> Pages without data‐fetching defaults compile to static HTML under Next.js 15. If/when we need runtime data (e.g., CMS), we can introduce `fetch()` in Server Components or switch to `revalidate`.

## 10. Security & Compliance (MVP)

1. **Transport Security**
   * Enforce HTTPS via automatic redirects on all routes (handled by hosting platform and Next.js redirects).
   * Enable HTTP Strict Transport Security (HSTS) with a 1-year max-age and `includeSubDomains; preload` flags.

2. **Secure HTTP Headers**
   * Apply Helmet presets through `next-secure-headers` middleware in `middleware.ts`.
   * Configure a strict Content-Security-Policy (CSP) whitelist (self + required CDN assets).
   * Set Referrer-Policy (`strict-origin-when-cross-origin`) and X-Content-Type-Options (`nosniff`).

3. **Rate Limiting**
   * Use `rate-limiter-flexible` on API routes to limit unauthenticated requests to **100 requests / 15 minutes per IP**.
   * Return `429 Too Many Requests` with a retry-after header.

4. **Input Validation & Sanitization**
   * Leverage Zod schemas on both client and server to enforce field types and length constraints.
   * Reject requests failing validation with `400 Bad Request`.

5. **Data Layer Protection**
   * Prisma uses parameterized queries, mitigating SQL-injection risk.
   * All transactional database access encapsulated in a `LeadRepository` adhering to SOLID principles.

6. **Secrets & Environment Variables**
   * Store credentials (DB URL, email API key) in **`.env.local`**.
   * Never commit secret files—blocked via `.gitignore` and pre-commit hook.

7. **Email Security**
   * Use a trusted transactional provider (e.g., Resend) with SPF, DKIM, and DMARC configured.

8. **OWASP Alignment**
   * Perform dependency scanning via `pnpm audit` in CI.
   * Add automated lint rule to forbid unsafe eval/innerHTML.

## 11. Success Metrics (MVP)

*   **Number of unique visitors**.
*   **Bounce rate**.
*   **Number of leads generated** (form submissions).
*   **Conversion rate** (visitors to leads).
*   **Percentage of leads opting into marketing communications**.

---
This PRD provides a focused plan for the MVP scope only. It should be considered a living document and may evolve as the project progresses and more insights are gathered. 