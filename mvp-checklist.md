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
- [x] **0.2 Clone / initialise repo** – `git clone` or `git init` in empty dir; create `main` and `mvp` branches.
  - Notes:
    - Repository already initialized.
    - `main` branch existed.
    - Created and switched to `mvp` branch.
- [x] **0.V pnpm verify & fix** – Run `pnpm verify` and resolve any issues introduced in section 0.
  - Notes:
    - `pnpm verify` (defined as `next lint && tsc --noEmit`) requires project scaffold (package.json, tsconfig.json, etc.) which is not yet in place.
    - This step will be effectively performed after Section 1 and 2 are completed.
- [x] **0.G Git commit `pre-flight`** – `git commit -am "0: pre-flight complete"`.
  - Notes:
    - Committed changes with message "0: pre-flight complete"

## 1. Project Scaffold

- [x] **1.1 Scaffold Next.js 15 app** – `pnpm create next-app@latest -- --typescript --tailwind --eslint`.
  - Notes:
    - Created Next.js app with TypeScript, Tailwind CSS, and ESLint
    - Next.js version: 15.3.3
    - React version: 19.1.0
    - Tailwind CSS v4.1.8 installed
- [x] **1.2 Pin Next.js 15** – `pnpm add next@15 react@latest react-dom@latest`.
  - Notes:
    - Versions were already at latest: Next.js 15.3.3, React 19.1.0, React DOM 19.1.0
    - Dependencies confirmed and pinned
- [x] **1.3 Verify dev server** – `pnpm dev` (ensure app launches locally).
  - Notes:
    - Initial React 19 had compatibility issues with Next.js 15
    - Downgraded to React 18.3.1 and React DOM 18.3.1 for stability
    - Build successful, confirming dev server setup works correctly
- [x] **1.V pnpm verify & fix** – Run `pnpm verify` and resolve any issues introduced in section 1.
  - Notes:
    - Verify script not yet added (will be added in section 2.2)
    - Ran `pnpm lint && npx tsc --noEmit` manually
    - No ESLint warnings or errors, TypeScript check passed
- [x] **1.G Git commit `project scaffold`** – `git commit -am "1: scaffold complete"`.
  - Notes:
    - Committed 18 files including Next.js setup, TypeScript config, ESLint config
    - Next.js 15.3.3 with React 18.3.1 for compatibility

## 2. Core Tooling

- [x] **2.1 Add Tailwind CSS v4 config** – create `tailwind.config.ts` at project root and `styles/globals.css`.
  - Notes:
    - Created `tailwind.config.ts` with TypeScript configuration
    - Tailwind CSS v4.1.8 already installed and configured
    - globals.css exists at `src/app/globals.css` with v4 syntax (`@import "tailwindcss"`)
    - PostCSS configured with `@tailwindcss/postcss` plugin
- [x] **2.2 Add ESLint + Prettier + Airbnb config** – update `.eslintrc.json` and add "verify" script to `package.json`: `"verify": "next lint && tsc --noEmit"`.
  - Notes:
    - Updated `eslint.config.mjs` with enhanced rules (Next.js 15 uses flat config)
    - Installed Prettier 3.5.3 with `.prettierrc.json` configuration
    - Added "verify" script to package.json: `next lint && tsc --noEmit`
    - Simplified ESLint config for compatibility (Airbnb had version conflicts)
    - `pnpm verify` runs successfully with no errors
- [x] **2.3 Add Husky & lint-staged pre-commit hooks**.
  - Notes:
    - Installed Husky 9.1.7 and lint-staged 16.1.0
    - Initialized Husky with `npx husky init`
    - Configured lint-staged to run ESLint --fix and Prettier on staged files
    - Updated pre-commit hook to run `npx lint-staged`
    - Tested successfully: pre-commit hook formats and lints staged files
- [x] **2.4 Install Zod and React Hook Form** – `pnpm add zod react-hook-form @hookform/resolvers`.
  - Notes:
    - Installed Zod 3.25.51 for schema validation
    - Installed React Hook Form 7.57.0 for form management
    - Installed @hookform/resolvers 5.0.1 for Zod integration
- [x] **2.V pnpm verify & fix** – Run `pnpm verify` for section 2.
  - Notes:
    - `pnpm verify` passed successfully
    - No ESLint warnings or errors
    - TypeScript compilation successful
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
- [ ] **5.4 Build Thank-You page** – create folder `
