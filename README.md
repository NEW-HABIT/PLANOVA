# PLANOVA — AI-Powered Event Planning Platform

<div align="center">
  <br />
  <p align="center">
    <strong><em>"Every Great Moment Starts with a Plan."</em></strong>
  </p>
  <p align="center">
    A production-ready, intelligent Generative AI event-planning and production platform designed to transform ambitious celebrations into executed master blueprints.
  </p>
  <p align="center">
    <a href="https://github.com/NEW-HABIT/PLANOVA">
      <img src="https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    </a>
    <a href="https://supabase.com/">
      <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
    </a>
    <a href="https://huggingface.co/">
      <img src="https://img.shields.io/badge/Hugging_Face-Llama_3.3_70B-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="Hugging Face" />
    </a>
  </p>
</div>

---

## 📖 Table of Contents
1. [Overview & Product Vision](#-overview--product-vision)
2. [Signature Design System & Color Palette](#-signature-design-system--color-palette)
3. [Core Feature Matrix](#-core-feature-matrix)
4. [Tech Stack & Architecture](#-tech-stack--architecture)
5. [Quick Start & Local Setup](#-quick-start--local-setup)
6. [Database Schema & Migrations](#-database-schema--migrations)
7. [Automated Testing & QA](#-automated-testing--qa)
8. [Production Deployment Guide](#-production-deployment-guide)
9. [Project Directory Layout](#-project-directory-layout)
10. [License](#-license)

---

## 🌟 Overview & Product Vision

**PLANOVA** is an intelligent Generative AI event-planning assistant that bridges the gap between vision and execution. Whether planning a royal destination wedding, a milestone 50th birthday, a global corporate summit, or a vibrant college festival, PLANOVA handles the operational complexity so hosts and planners can focus on the celebration.

### Key Value Propositions
- **Zero Spreadsheets Required**: Real-time budget allocation with automated emergency contingency reserves (default 8–10%) and spending variance tracking.
- **Context-Aware Event Intelligence**: Generates complete schedules, culinary menus, styling decor concepts, vendor questionnaires, and timeline milestones.
- **Curated Previous Works Showcase**: Public high-resolution photo galleries with verified celebration host reviews and financial savings metrics.
- **Event Completion & Verified Review Loop**: Real platform workflow allowing hosts to officially complete an event, upload celebration photos, and publish reviews into the public showcase.
- **Strict Privacy & Security**: Unauthenticated visitors are guided to sign in before creating or editing plans. Full Row Level Security (RLS) data isolation and cookie compliance.

---

## 🎨 Signature Design System & Color Palette

PLANOVA features a curated, boutique luxury aesthetic designed to wow clients and guests:

| Hex Code | Tone Name | Purpose & Hierarchy |
| :--- | :--- | :--- |
| **`#3E3239`** | **Royal Espresso** | Primary typography, deep contrast surfaces, modal backdrop overlays, luxury dark accents |
| **`#6B5560`** | **Velvet Wine** | Secondary narrative body text, primary button gradients, status badges, elegant borders |
| **`#9E8189`** | **Dusty Roseplum** | Category chips, subtle highlights, glowing accents, star ratings, micro-interactions |
| **`#C7A9A3`** | **Soft Sand** | Delicate border strokes, divider rules, subtle card outlines, ambient radial illumination |
| **`#E8D2C4`** | **Warm Champagne** | Primary button highlights, badge backgrounds, thumbnail selection rings, golden glows |
| **`#F7EFE7`** | **Silk Cream** | Main landing page backdrop, pristine surface fills, light high-contrast text |

---

## 🚀 Core Feature Matrix

### 1. Intelligent Event Wizard (`/events/new`)
- Multi-step interactive flow: Event Type, Theme & Aesthetic, City & Venue, Guest Count, Target Budget, and Currency.
- Instant AI blueprint generation powered by Groq Llama 3.3 70B with Zod schema validation.

### 2. Comprehensive Event Workspace (`/events/[eventId]/*`)
- **Master Plan (`/plan`)**: High-level executive summary, theme breakdown, run of show, and dining menu with granular 1-click regeneration.
- **Precision Budget Manager (`/budget`)**: Interactive Recharts expense allocation, spending variance alerts, contingency locks, and 1-click CSV export.
- **Production Timeline (`/timeline`)**: Categorized milestones (3 months out, 1 month out, week of, day of), task completion toggles, and status filters.
- **Curated Vendor Discovery (`/vendors`)**: Side-by-side proposal comparison matrix with AI-generated interview checklists and negotiation tactics.
- **Guest Management & RSVP Studio (`/guests`)**: Headcount calculations, plus-one tracking, dietary preferences, accessibility needs, and CSV exports.
- **Creative Studio (`/creative-studio`)**: 1-click copywriting generator for WhatsApp invites, formal toasts, emcee scripts, and schedule announcements.
- **24/7 Contextual Event Copilot (`/assistant`)**: AI assistant aware of all event details, ready to answer questions, recommend local vendors, or draft speeches.

### 3. Public Previous Works Gallery & Modal (`/#previous-works`)
- Visual showcase of authentic celebrations across India and worldwide (Royal Heritage Udaipur, Global Tech Summit Bangalore, Goa Sunset Wedding, etc.).
- Interactive modal with multi-photo carousel, budget metrics, verified host testimonials, and financial savings reports.

### 4. Event Lifecycle Completion Loop
- Event hosts can trigger the **"Complete Event & Submit Review"** workflow from the workspace header or dashboard.
- Includes star ratings, personal review testimonial, financial savings achieved, preset celebration photo galleries, or custom photo uploads with confetti celebration.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router, Server Actions, Client Components)
- **Language**: TypeScript 5 (Strict Mode enabled)
- **Styling**: Tailwind CSS 3.4 with custom `@tailwind` design system and glassmorphism utilities
- **Animations**: Framer Motion (page transitions, interactive photo carousels, floating ambient glows)
- **Icons**: Lucide React
- **Data Visualization**: Recharts (dynamic budget and category expense distribution)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) + resilient local offline store
- **AI Engine**: Groq SDK (Llama 3.3 70B Versatile model) with deterministic fallback engine
- **Form & Schema Validation**: Zod v3

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: `v18.17.0+` or `v20+` (LTS recommended)
- **npm**: `v9+` or `v10+`
- **Git**: `v2.30+`

### 2. Clone & Install
```bash
git clone https://github.com/NEW-HABIT/PLANOVA.git
cd PLANOVA
npm install
```

### 3. Environment Configuration
Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
# Hugging Face AI (Get free Access Token at https://huggingface.co/settings/tokens)
HUGGINGFACE_API_KEY=hf_your_token_here
HUGGINGFACE_MODEL=meta-llama/Llama-3.3-70B-Instruct

# Supabase Database & Auth (Get keys at https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

> **Note**: Even without external cloud keys, PLANOVA immediately launches in **Smart Demo Mode** with realistic local persistence, pre-seeded celebrations, and full UI features!

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🗄️ Database Schema & Migrations

The production PostgreSQL schema is located at:
[`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)

### Tables Included:
1. `profiles`: User accounts, avatars, role permissions.
2. `events`: Master celebration metadata, date, city, budget, guest count.
3. `budgets`: Category allocations, allocated amount, actual spent, notes.
4. `tasks`: Timeline milestones, deadlines, assignees, completion state.
5. `vendors`: Service categories, quotes, contact details, status.
6. `guests`: RSVP tracking, dietary restrictions, table allocations.
7. `creative_assets`: AI-synthesized copy, invitation drafts, speeches.
8. `ai_messages`: Context-aware chat logs and assistant memory.

### Executing Migrations:
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project and open the **SQL Editor**.
3. Paste the contents of `001_initial_schema.sql` and click **Run**.
4. Row Level Security (RLS) is automatically enabled with owner-scoped policies.

---

## 🧪 Automated Testing & QA

Run the built-in mathematical engine unit tests:
```bash
npm test
```

Expected Output:
```text
🧪 Starting PLANOVA Budget & Reserve Engine Tests...

Test 1: Category Allocation & Zero-Double-Count Reserve Calculation
  ✓ Passed: Total budget ₹25,00,000 sums exactly with reserve ₹2,00,000

Test 2: Spending Variance & Over-Budget Alert Calculation
  ✓ Passed: Detected over-budget deficit of ₹3,00,000 accurately

Test 3: Currency Format Bounds Check
  ✓ Passed: Global currency support validated

🎉 ALL PLANOVA UNIT TESTS PASSED SUCCESSFULLY! (3/3 suites)
```

Run TypeScript verification:
```bash
npx tsc --noEmit
```

---

## 🌐 Production Deployment Guide

For a complete step-by-step production hosting blueprint, read [**`HOSTING_GUIDE.md`**](./HOSTING_GUIDE.md).

### Quick Deploy via Vercel (Recommended)
1. Push your repository to GitHub: `https://github.com/NEW-HABIT/PLANOVA.git`.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Import Project"**.
3. Select the `PLANOVA` repository.
4. Add Environment Variables:
   - `GROQ_API_KEY`
   - `GROQ_MODEL` (`llama-3.3-70b-versatile`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **"Deploy"**. Vercel will automatically build the Next.js production bundle with Edge Caching and SSL.

---

## 📂 Project Directory Layout

```text
PLANOVA/
├── src/
│   ├── app/
│   │   ├── api/ai/
│   │   │   ├── assistant/route.ts          # 24/7 Contextual event copilot
│   │   │   ├── generate-plan/route.ts      # Full AI blueprint synthesis
│   │   │   └── regenerate-section/route.ts # Granular section regenerations
│   │   ├── auth/
│   │   │   ├── sign-in/page.tsx            # Sign In & 1-click host demo access
│   │   │   ├── sign-up/page.tsx            # Host registration
│   │   │   └── forgot-password/page.tsx    # Password recovery
│   │   ├── dashboard/page.tsx              # Host control center & event switcher
│   │   ├── events/
│   │   │   ├── new/page.tsx                # 5-step intelligent event wizard
│   │   │   └── [eventId]/
│   │   │       ├── layout.tsx              # Workspace header & complete review modal
│   │   │       ├── plan/page.tsx           # Master blueprint, run of show & menu
│   │   │       ├── budget/page.tsx         # Recharts budget allocator & CSV export
│   │   │       ├── timeline/page.tsx       # Milestones & production checklist
│   │   │       ├── vendors/page.tsx        # Vendor matrix & questionnaire
│   │   │       ├── guests/page.tsx         # Headcount, dietary & RSVP studio
│   │   │       ├── creative-studio/page.tsx# Copywriting & invitation generator
│   │   │       └── assistant/page.tsx      # Contextual event copilot
│   │   ├── features/page.tsx               # Capabilities & showcase
│   │   ├── pricing/page.tsx                # Transparent tiers & concierge
│   │   ├── globals.css                     # Tailwind tokens & luxury glassmorphism
│   │   ├── layout.tsx                      # Root navigation, banner & footer
│   │   └── page.tsx                        # Landing page, previous works & modal
│   ├── components/
│   │   ├── events/
│   │   │   └── CompleteEventReviewModal.tsx# Verified review & photo upload modal
│   │   └── layout/
│   │       ├── CookieConsent.tsx           # Privacy-first cookie banner
│   │       ├── Footer.tsx                  # Luxury palette footer & trust markers
│   │       └── Navbar.tsx                  # Responsive glass navbar & quick actions
│   ├── lib/
│   │   ├── budget-calc.ts                  # Pure mathematical budget engine
│   │   ├── groq.ts                         # Groq client & Zod schema guards
│   │   ├── seed-data.ts                    # Realistic celebration seeds
│   │   ├── storage.ts                      # LocalStorage sync engine & review store
│   │   └── utils.ts                        # Currency formatters & helpers
│   └── types/index.ts                      # Strict TypeScript domain interfaces
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql          # Production SQL schema & RLS policies
├── scripts/
│   └── test-budget.js                      # Automated unit test suite
├── HOSTING_GUIDE.md                        # Complete production hosting guide
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛡️ License

Built with pride for PLANOVA. All rights reserved.
