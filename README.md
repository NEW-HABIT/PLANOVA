# PLANOVA — AI-Powered Event Planning Platform

> *"Every Great Moment Starts with a Plan."*

PLANOVA is an intelligent Generative AI event-planning assistant designed to transform ambitious celebrations into complete, actionable production blueprints. It powers weddings, milestone birthdays, corporate summits, college fests, and community galas with AI-driven concepts, precision budget allocation, timeline milestones, vendor discovery, guest management, and copywriting.

---

## 🌟 Key Highlights & Architecture

- **Next.js 14 with App Router & TypeScript**: Fast, server-first modern web application.
- **Groq API Integration (Llama 3.3 70B)**: Ultra-fast structured event plan synthesis, sectional regeneration, and an interactive 24/7 planning assistant.
- **Zod Schema Validation**: Every AI response is validated with strict type guards before reaching the UI.
- **Smart Budget Manager & Recharts**: Category breakdown, spending variance, zero-double-count emergency reserves, CSV export, and cost-saving alternatives.
- **Vendor Directory & Comparison Matrix**: Compare quotes side-by-side with AI-generated interview checklists.
- **Guest List & RSVP Tracker**: Headcounts with plus-one math, dietary/accessibility logging, and CSV export.
- **Creative Studio**: 1-click copywriting for WhatsApp invitations, formal toasts, emcee scripts, and announcements.
- **Supabase PostgreSQL & Row Level Security (RLS)**: Normalized relational schema with owner/collaborator access control.
- **Zero-Setup Out-of-the-Box Demo Mode**: Pre-loaded with realistic celebrations (e.g. *Rohan & Ananya's Royal Palace Wedding*) so you can test every feature instantly without configuring credentials first.

---

## 🎨 Visual Identity

- **Deep Indigo**: `#4338CA`
- **Electric Violet**: `#7C3AED`
- **Soft Lavender**: `#EDE9FE`
- **Off-White**: `#FAFAFF`
- **Dark Text**: `#17172A`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v18.17.0+` or `v20+`
- npm `v9+` or `v10+`

### 2. Installation
```bash
# Clone the repository and enter directory
git clone <repo-url>
cd planova

# Install dependencies
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` to add your credentials:
```env
# Groq API (https://console.groq.com/keys)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Supabase (Optional for local demo mode; Required for persistent cloud database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
> **Note**: Even without API keys, PLANOVA runs in **Smart Demo Mode** with realistic contextual generation!

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Migrations (Supabase)

The complete SQL schema and Row Level Security policies are located in:
[`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)

### Applying to Supabase:
1. Create a new project in your [Supabase Dashboard](https://app.supabase.com).
2. Navigate to the **SQL Editor**.
3. Paste the contents of `supabase/migrations/001_initial_schema.sql`.
4. Click **Run**. All tables (`profiles`, `events`, `budgets`, `tasks`, `vendors`, `guests`, `creative_assets`, `ai_messages`) and RLS policies will be created.

---

## 🧪 Automated Testing

Run the automated budget and emergency reserve calculation unit tests:
```bash
npm test
```

Expected output:
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

---

## 📂 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/ai/
│   │   │   ├── assistant/route.ts        # Conversational event copilot
│   │   │   ├── generate-plan/route.ts    # Full AI blueprint generation
│   │   │   └── regenerate-section/route.ts # Granular section regeneration
│   │   ├── auth/
│   │   │   ├── sign-in/page.tsx          # Sign In & 1-click demo login
│   │   │   ├── sign-up/page.tsx          # Registration flow
│   │   │   └── forgot-password/page.tsx  # Password reset flow
│   │   ├── dashboard/page.tsx            # Main personalized dashboard
│   │   ├── events/
│   │   │   ├── new/page.tsx              # 5-step AI creation wizard
│   │   │   └── [eventId]/
│   │   │       ├── layout.tsx            # Shared event workspace layout
│   │   │       ├── plan/page.tsx         # AI plan overview & schedule
│   │   │       ├── budget/page.tsx       # Recharts budget manager & CSV
│   │   │       ├── timeline/page.tsx     # Milestone checklist & filters
│   │   │       ├── vendors/page.tsx      # Directory & comparison matrix
│   │   │       ├── guests/page.tsx       # RSVP & dietary tracker
│   │   │       ├── creative-studio/page.tsx # Copywriting generator
│   │   │       └── assistant/page.tsx    # Context-aware chat assistant
│   │   ├── features/page.tsx             # Public capabilities showcase
│   │   ├── pricing/page.tsx              # Public transparent pricing tiers
│   │   ├── globals.css                   # Tailwind & glassmorphism system
│   │   ├── layout.tsx                    # Root navigation & layout
│   │   └── page.tsx                      # Landing page with interactive preview
│   ├── components/layout/
│   │   ├── Navbar.tsx                    # Header with responsive mobile drawer
│   │   └── Footer.tsx                    # Brand statement & trust badges
│   ├── lib/
│   │   ├── budget-calc.ts                # Allocation engine & reserves math
│   │   ├── groq.ts                       # Groq Llama 3.3 client & Zod schema
│   │   ├── seed-data.ts                  # Authentic sample celebrations
│   │   ├── storage.ts                    # LocalStorage + sync store
│   │   └── utils.ts                      # Currency & date formatters
│   └── types/index.ts                    # Complete TypeScript domain models
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Tables, foreign keys & RLS policies
├── scripts/
│   └── test-budget.js                    # Automated unit tests
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛡️ License

Built for excellence with PLANOVA. All rights reserved.
