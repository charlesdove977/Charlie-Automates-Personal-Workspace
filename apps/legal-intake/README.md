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

## Supabase Storage Setup

Before document uploads will work, you need to configure Supabase Storage:

1. **Create Storage Bucket**
   - Go to your Supabase project dashboard
   - Navigate to Storage
   - Click "New bucket"
   - Name it `case-documents`
   - Set to **Private** (not public)

2. **Configure RLS Policy**
   - Click on the `case-documents` bucket
   - Go to Policies tab
   - Add a new policy for INSERT:
     ```sql
     CREATE POLICY "Allow public uploads"
     ON storage.objects
     FOR INSERT
     WITH CHECK (bucket_id = 'case-documents');
     ```
   - Note: This allows public uploads for MVP. Authentication will be added in Phase 4.

3. **File Path Convention**
   - Files are stored as: `{firmId}/{caseId}/{filename}`
   - Example: `firm_abc123/case_xyz789/divorce-petition.pdf`

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
