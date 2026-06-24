# LeadSignal AI

A focused SaaS MVP for finding local businesses, analyzing marketing presence, scoring outreach opportunities, and generating personalized openers.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Supabase Auth and Postgres
- Google Places API
- OpenAI API structured outputs
- Stripe-ready customer account schema, without payments implemented

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   OPENAI_API_KEY=
   GOOGLE_PLACES_API_KEY=
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run `supabase/schema.sql` in the Supabase SQL editor.

5. Start the app:

   ```bash
   npm run dev
   ```

## Notes

- New users receive 25 credits through the auth trigger.
- Creating a search spends 1 credit per analyzed lead.
- The search API runs the lead pipeline synchronously for MVP simplicity.
- If OpenAI fails, the app stores deterministic fallback outreach copy.
- Stripe can be added by wiring checkout/webhooks to `customer_accounts` and credit packages later.
