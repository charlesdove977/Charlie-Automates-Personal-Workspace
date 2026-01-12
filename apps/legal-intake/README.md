# Legal Intake System

AI-powered case intake and triage for law firms.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Fill in your credentials in `.env.local`

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This app deploys to Vercel.

1. Push to main branch
2. Vercel auto-deploys
3. Set environment variables in Vercel dashboard

Required env vars:
- DATABASE_URL
- DIRECT_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
