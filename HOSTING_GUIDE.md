# PLANOVA — Production Hosting & Deployment Blueprint

This guide provides a step-by-step, turnkey plan to host **PLANOVA** in a fully production-ready, highly available, and scalable environment.

---

## 🏗️ Recommended Production Architecture

| Component | Service Provider | Tier / Specification | Key Advantages |
| :--- | :--- | :--- | :--- |
| **Web Frontend & API Routes** | **Vercel** | Hobby (Free) or Pro ($20/mo) | Native Next.js 14 App Router support, Global Edge CDN, automated CI/CD from `main`, automatic SSL. |
| **Database & Auth** | **Supabase** | Free or Pro ($25/mo) | Fully managed PostgreSQL, Row Level Security (RLS), instant Auth, daily backups, global connection pooling (PgBouncer). |
| **AI Inference Engine** | **Hugging Face** | Free Serverless or Dedicated | OpenAI-compatible inference with state-of-the-art open models (Llama 3.3 70B, Qwen 2.5 72B, Mistral). |
| **DNS & Custom Domain** | **Vercel DNS** / **Cloudflare** | Free | Instant SSL, DDoS protection, edge caching. |

---

## 📋 Phase 1: Database Setup (Supabase)

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in (via GitHub or email).
2. Click **"New Project"**.
3. Fill in the details:
   - **Name**: `planova-production`
   - **Database Password**: Generate and securely store a strong password.
   - **Region**: Choose the region closest to your primary user base (e.g., `South Asia (Mumbai)` for India, or `East US` / `Frankfurt`).
   - **Pricing Plan**: Free tier (includes 500MB DB & 50,000 monthly active users).
4. Click **"Create new project"** (takes ~90 seconds to provision).

### 2. Execute Production SQL Migrations
1. In your Supabase project dashboard, click on the **SQL Editor** tab on the left sidebar.
2. Click **"New Query"**.
3. Open [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) from the PLANOVA repository, copy its entire content, and paste it into the SQL editor.
4. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`).
5. Verify in **Table Editor** that all 8 tables are created with Row Level Security (RLS) active:
   - `profiles`
   - `events`
   - `budgets`
   - `tasks`
   - `vendors`
   - `guests`
   - `creative_assets`
   - `ai_messages`

### 3. Copy API Credentials
Navigate to **Project Settings** → **API**:
- **Project URL**: Copy URL (e.g., `https://xyzabcdefghijklm.supabase.co`).
- **Project API Keys**:
  - Copy `anon` `public` key.
  - Copy `service_role` `secret` key (keep this confidential!).

---

## ⚡ Phase 2: AI Engine Setup (Hugging Face)

1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
2. Sign in or create a free Hugging Face account.
3. Click **"New token"** (or **"Create new token"**).
4. Name the token (e.g., `planova-production-token`), select **"Read"** role, and click **"Generate a token"**.
5. Copy the generated key (starts with `hf_...`).
6. *(Optional)* If using Meta Llama models like `meta-llama/Llama-3.3-70B-Instruct`, ensure you click "Agree and access repository" on the Hugging Face model page once, or use non-gated models like `Qwen/Qwen2.5-72B-Instruct` out-of-the-box.

---

## 🚀 Phase 3: Web Application Deployment (Vercel)

### 1. Import Repository to Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Sign in with GitHub.
3. Under **"Import Git Repository"**, find `NEW-HABIT/PLANOVA` and click **"Import"**.

### 2. Configure Build & Project Settings
Vercel automatically detects Next.js:
- **Framework Preset**: `Next.js`
- **Root Directory**: `./`
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Set Production Environment Variables
In the **"Environment Variables"** section, add the following keys:

| Name | Value | Description |
| :--- | :--- | :--- |
| `HUGGINGFACE_API_KEY` | `hf_your_actual_token` | Hugging Face Access Token |
| `HUGGINGFACE_MODEL` | `meta-llama/Llama-3.3-70B-Instruct` | Target LLM (or `Qwen/Qwen2.5-72B-Instruct`) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyz.supabase.co` | Supabase project endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase client anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Supabase server-side admin key |
| `GROQ_API_KEY` *(Optional)* | `gsk_...` | Optional secondary fallback AI provider |

### 4. Deploy
1. Click **"Deploy"**.
2. Vercel will build the production bundle, optimize static routes, and deploy serverless functions to edge nodes worldwide.
3. In ~60 seconds, you will receive a production URL (e.g., `https://planova.vercel.app`).

---

## 🌐 Phase 4: Custom Domain Configuration

To connect a custom domain (e.g., `planova.events` or `planova.app`):

1. In your Vercel Project, go to **Settings** → **Domains**.
2. Enter your domain name and click **"Add"**.
3. Choose redirect preference (e.g., redirect `planova.app` to `www.planova.app` or vice-versa).
4. Update DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains):

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Automatic / 300 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 300 |

5. Vercel will automatically verify the records and issue a free SSL Certificate (Let's Encrypt) within minutes.

---

## 🔍 Phase 5: Post-Deployment Smoke Test Checklist

Once live, verify each critical user journey:

1. [ ] **Landing Page**: Visit `https://yourdomain.com` — verify the signature color palette (`#3E3239`, `#6B5560`, `#9E8189`, `#C7A9A3`, `#E8D2C4`, `#F7EFE7`), smooth ambient glows, and responsive typography.
2. [ ] **Previous Works Gallery**: Click on any of the 6 previous work cards (Royal Heritage, Global Summit, etc.) — verify the modal opens with multi-photo carousel, verified owner reviews, and financial savings.
3. [ ] **Authentication Guard**: Verify that unauthenticated visitors attempting to create a plan are smoothly redirected to `/auth/sign-in`.
4. [ ] **1-Click Demo Login**: Sign in as "Demo Host" or register a new user.
5. [ ] **Event Creation Wizard**: Create a new event at `/events/new` — test that the AI synthesizes budget, timeline milestones, and run of show.
6. [ ] **Budget Engine**: Check that the 8–10% contingency reserve is automatically protected with zero double counting. Export CSV.
7. [ ] **Complete Event & Review Loop**: Click "Complete Event & Submit Review" in the event header — upload photos, submit rating, and verify celebratory confetti triggers.
8. [ ] **Cookie Banner**: Verify the privacy cookie banner displays on first visit and saves user consent.

---

## 🛡️ Phase 6: Monitoring, Security & Maintenance

1. **Vercel Analytics & Speed Insights**:
   - Enable free Vercel Analytics in **Project Settings** → **Analytics** to monitor real-user Core Web Vitals (LCP, FID, CLS).
2. **Supabase Database Backups**:
   - Supabase automatically takes daily backups. For enterprise compliance, manual logical dumps can be taken via `pg_dump`.
3. **API Rate Limiting**:
   - Vercel automatically includes DDoS protection and web application firewalls.
   - Groq API has generous rate limits for Llama 3.3 70B (30 requests/minute on free tier).
4. **Continuous Integration & Git Sync**:
   - Every `git push origin main` will automatically trigger a zero-downtime production deployment on Vercel.

---

🎉 **Your PLANOVA platform is now fully production-ready!**
