# SF Consultancy MVP

A modern Salesforce consultancy website built with Next.js 15, featuring lead generation, email notifications, and enterprise-grade security.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS 4
- **Lead Management**: Contact forms with validation and database storage
- **Email Notifications**: Automated lead notifications and welcome emails via Resend
- **Security Hardening**: Rate limiting, CSP headers, bot protection, and OWASP compliance
- **Database**: PostgreSQL with Prisma ORM for type-safe data access
- **Testing**: Comprehensive unit and integration tests with Jest
- **Professional UI**: Responsive design with accessibility features

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first styling
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend

- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Production database
- **Resend** - Email delivery service
- **Rate Limiter Flexible** - API rate limiting

### Development

- **Jest** - Testing framework
- **ESLint + Prettier** - Code quality and formatting
- **Husky** - Git hooks for code quality
- **pnpm** - Fast package manager

## 📦 Installation

### Prerequisites

- Node.js 18+ (20+ recommended)
- PostgreSQL 14+
- pnpm 8+

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd FullStackApp
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/sf_consultancy_mvp"
   RESEND_API_KEY="your_resend_api_key"
   ```

4. **Database setup**

   ```bash
   # Create PostgreSQL database
   createdb sf_consultancy_mvp

   # Run migrations
   pnpm prisma migrate dev

   # Generate Prisma client
   pnpm prisma generate
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm studio           # Open Prisma Studio (database GUI)
pnpm prisma migrate   # Run database migrations

# Testing & Quality
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
pnpm test:ci          # Run tests for CI
pnpm verify           # Run lint, type-check, and tests

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
```

## 🏗️ Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/lead/          # Lead submission API
│   │   ├── privacy/           # Privacy policy page
│   │   ├── services/          # Services page
│   │   ├── thank-you/         # Thank you page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── Footer.tsx         # Site footer
│   │   ├── LeadForm.tsx       # Lead capture form
│   │   └── Navbar.tsx         # Navigation header
│   ├── lib/                   # Utility libraries
│   │   └── email.ts           # Email service wrapper
│   ├── types/                 # TypeScript type definitions
│   │   └── lead.ts            # Lead-related types
│   └── validators/            # Zod validation schemas
│       └── leadSchema.ts      # Lead form validation
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   └── rateLimiter.ts         # Rate limiting utilities
├── prisma/
│   ├── migrations/            # Database migrations
│   └── schema.prisma          # Database schema
├── middleware.ts              # Next.js middleware (security)
├── jest.config.ts             # Jest configuration
└── tailwind.config.ts         # Tailwind CSS configuration
```

## 🔒 Security Features

- **Rate Limiting**: API endpoints protected against abuse
- **Content Security Policy**: Strict CSP headers prevent XSS attacks
- **Bot Protection**: Automated bot detection and blocking
- **HTTPS Headers**: HSTS, X-Frame-Options, and security headers
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Validation schemas, utility functions
- **Integration Tests**: API endpoints, database operations
- **Component Tests**: React components and forms

Run tests with:

```bash
pnpm test              # Single run
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage report
```

## 📊 Database Schema

### Lead Model

```prisma
model Lead {
  id        String   @id @default(cuid())
  firstName String
  lastName  String
  email     String   @unique
  company   String
  phone     String?
  message   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 📧 Email Integration

The application sends two types of emails via Resend:

1. **Lead Notification**: Alerts the sales team of new leads
2. **Welcome Email**: Acknowledges form submission to the prospect

Configure your Resend API key in `.env.local` to enable email functionality.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**

   ```bash
   pnpm add -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure environment variables** in Vercel dashboard:

   - `DATABASE_URL`
   - `RESEND_API_KEY`

3. **Deploy database** (using a hosted PostgreSQL service like Neon, Supabase, or Railway)

### Other Platforms

The application is compatible with any Node.js hosting platform that supports:

- Node.js 18+
- PostgreSQL database
- Environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Run quality checks: `pnpm verify`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Create a Pull Request

## 📝 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

Built with ❤️ using Next.js 15 and modern web technologies.
