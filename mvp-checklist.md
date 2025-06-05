# MVP Build Checklist – Salesforce Consultancy Website

This checklist guides an **AI development agent** through building the entire MVP described in `website-prd-mvp.md`.  
Follow the tasks **strictly in order**. After completing each task:
1. Add implementation notes indented under the task (bullet list).
2. Change the checkbox `[ ]` → `[x]`.
3. Run `pnpm verify` to lint and type-check the workspace.
4. Fix **all** linter and TypeScript issues.
5. Commit the changes with a meaningful message: `git commit -am "<task-id>: <summary>"`.
6. Only then proceed to the next task.

> **Notation**: Use nested bullets `-` for notes. Do **not** remove unchecked items; always mark them when done.

---

## 0. Pre-Flight

- [x] **0.1 Validate local toolchain** – Confirm Node.js 20.x, pnpm ≥8, git installed.
  - Notes:
    - Node.js version: v18.20.5 (Checklist specifies 20.x)
    - pnpm version: 10.5.0
    - git version: 2.47.0
- [ ] **0.2 Clone / initialise repo** – `git clone` or `git init` in empty dir; create `main` and `mvp` branches.
  - Notes:
- [ ] **0.V pnpm verify & fix** – Run `pnpm verify` and resolve any issues introduced in section 0.
  - Notes:
- [ ] **0.G Git commit `pre-flight`** – `git commit -am "0: pre-flight complete"`.
  - Notes:

## 1. Project Scaffold

- [ ] **1.1 Scaffold Next.js 15 app** – `pnpm create next-app@latest -- --typescript --tailwind --eslint`.
  - Notes:
- [ ] **1.2 Pin Next.js 15** – `pnpm add next@15 react@latest react-dom@latest`.
  - Notes:
- [ ] **1.3 Verify dev server** – `pnpm dev` (ensure app launches locally).
  - Notes:
- [ ] **1.V pnpm verify & fix** – Run `pnpm verify` and resolve any issues introduced in section 1.
  - Notes:
- [ ] **1.G Git commit `project scaffold`** – `git commit -am "1: scaffold complete"`.
  - Notes:

## 2. Core Tooling

- [ ] **2.1 Add Tailwind CSS v4 config** – create `tailwind.config.ts` at project root and `styles/globals.css`.
  - Notes:
- [ ] **2.2 Add ESLint + Prettier + Airbnb config** – update `.eslintrc.json` and add "verify" script to `package.json`: `"verify": "next lint && tsc --noEmit"`.
  - Notes:
- [ ] **2.3 Add Husky & lint-staged pre-commit hooks**.
  - Notes:
- [ ] **2.4 Install Zod and React Hook Form** – `pnpm add zod react-hook-form @hookform/resolvers`.
  - Notes:
- [ ] **2.V pnpm verify & fix** – Run `pnpm verify` for section 2.
  - Notes:
- [ ] **2.G Git commit `core tooling`** – `git commit -am "2: tooling setup"`.
  - Notes:

## 3. Database Layer

- [ ] **3.1 Install PostgreSQL locally (or Docker)** and create empty DB.
  - Notes:
  - Create database **sf_consultancy_mvp**.
- [ ] **3.2 Add Prisma 5.x & initialise schema** – `pnpm add -D prisma && pnpm add @prisma/client && pnpm prisma init`; edit `prisma/schema.prisma` with `Lead` model.
  - Notes:
- [ ] **3.3 Run initial migration** – `pnpm prisma migrate dev`.
  - Notes:
- [ ] **3.4 Create Prisma client singleton** – create folder `lib/` and file: `lib/prisma.ts`.
  - Notes:
- [ ] **3.V pnpm verify & fix** – Run `pnpm verify` for section 3.
  - Notes:
- [ ] **3.G Git commit `db layer`** – `git commit -am "3: database layer complete"`.
  - Notes:

## 4. Environment & Secrets

- [ ] **4.1 Add `dotenv` & create env files** – `pnpm add -D dotenv`; create `.env.local` (add to `.gitignore`) and `.env.example` with `DATABASE_URL`, `RESEND_API_KEY`.
  - Notes:
- [ ] **4.2 Install email provider SDK** – `pnpm add resend`.
  - Notes:
- [ ] **4.V pnpm verify & fix** – Run `pnpm verify` for section 4.
  - Notes:
- [ ] **4.G Git commit `env setup`** – `git commit -am "4: env & secrets"`.
  - Notes:

## 5. UI Pages

- [ ] **5.1 Build root layout** – file: `app/layout.tsx`; import globals & meta.
  - Notes:
- [ ] **5.2 Build Home page** – file: `app/page.tsx`; headline, service overview, CTA.
  - Notes:
- [ ] **5.3 Build Services page** – create folder `app/services/` and file: `app/services/page.tsx`.
  - Notes:
- [ ] **5.4 Build Thank-You page** – create folder `app/thank-you/` and file: `app/thank-you/page.tsx`.
  - Notes:
- [ ] **5.5 Build Privacy page** – create folder `app/privacy/` and file: `app/privacy/page.tsx` (simple privacy statement).
  - Notes:
- [ ] **5.V pnpm verify & fix** – Run `pnpm verify` for section 5.
  - Notes:
- [ ] **5.G Git commit `ui pages`** – `git commit -am "5: ui pages"`.
  - Notes:

## 6. Components

- [ ] **6.1 Navbar & Footer components** – create folder `components/` and files: `components/Navbar.tsx`, `components/Footer.tsx`; include in layout.
  - Notes:
- [ ] **6.V pnpm verify & fix** – Run `pnpm verify` for section 6.
  - Notes:
- [ ] **6.G Git commit `components`** – `git commit -am "6: components"`.
  - Notes:

## 7. API & Business Logic

- [ ] **7.1 Create Zod schema** – create folder `validators/` and file: `validators/leadSchema.ts`.
  - Notes:
- [ ] **7.2 Create type definitions** – create folder `types/` and file: `types/lead.ts`.
  - Notes:
- [ ] **7.3 LeadForm client component** – file: `components/LeadForm.tsx`; use React Hook Form + Zod schema from 7.1.
  - Notes:
- [ ] **7.4 Implement Route Handler** – create folders `app/api/lead/` and file: `app/api/lead/route.ts` (POST): validate, insert to DB, send email.
  - Notes:
- [ ] **7.5 Email utility wrapper** – file: `lib/email.ts`; use Resend SDK.
  - Notes:
- [ ] **7.6 Rate-limiter helper** – `pnpm add rate-limiter-flexible`; create file: `lib/rateLimiter.ts`; integrate in handler.
  - Notes:
- [ ] **7.V pnpm verify & fix** – Run `pnpm verify` for section 7.
  - Notes:
- [ ] **7.G Git commit `api logic`** – `git commit -am "7: api & business logic"`.
  - Notes:

## 8. Security Hardening

- [ ] **8.1 Install security libs** – `pnpm add next-secure-headers`.
  - Notes:
- [ ] **8.2 Security middleware** – file: `middleware.ts` at project root; apply `next-secure-headers` & rate-limit.
  - Notes:
- [ ] **8.3 Configure Content-Security-Policy & HSTS** – update middleware config.
  - Notes:
- [ ] **8.V pnpm verify & fix** – Run `pnpm verify` for section 8.
  - Notes:
- [ ] **8.G Git commit `security`** – `git commit -am "8: security hardening"`.
  - Notes:

## 9. Testing

- [ ] **9.1 Install Jest & React Testing Library** – `pnpm add -D jest @testing-library/react jest-environment-jsdom @types/jest`; add `jest.config.ts` at project root.
  - Notes:
- [ ] **9.2 Write unit test for Zod schema** – file: `validators/leadSchema.test.ts`.
  - Notes:
- [ ] **9.3 Write integration test for Route Handler** – file: `app/api/lead/route.test.ts` (mock Prisma + email).
  - Notes:
- [ ] **9.V pnpm verify & fix** – Run `pnpm verify` for section 9.
  - Notes:
- [ ] **9.G Git commit `tests`** – `git commit -am "9: tests"`.
  - Notes:

## 10. Deployment

- [ ] **10.1 Install Vercel CLI & login**.
  - Notes:
- [ ] **10.2 Create Vercel project, set env vars, push `mvp` branch**.
  - Notes:
- [ ] **10.3 Verify live site & form submission end-to-end**.
  - Notes:
- [ ] **10.V pnpm verify & fix** – Run `pnpm verify` for section 10.
  - Notes:
- [ ] **10.G Git commit `deployment`** – `git commit -am "10: deployment"`.
  - Notes:

## 11. Documentation & Cleanup

- [ ] **11.1 Update `README.md`** – add usage docs at project root.
  - Notes:
- [ ] **11.2 Run final `pnpm verify`**, ensure zero warnings.
  - Notes:
- [ ] **11.3 Merge `mvp` -> `main` and tag `v0.1.0`**.
  - Notes:

---

**When every task shows `[x]`, the MVP is complete. Do not skip steps or reorder them.**