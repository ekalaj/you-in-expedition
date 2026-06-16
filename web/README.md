# Common Ground — Web App (Next.js + Supabase + Stripe)

The production-shaped build of Common Ground: a senior-first "Meetup for
neighbors." This is the real app (database, auth, payments), the successor to the
static prototype in [`../common-ground`](../common-ground).

## Stack

- **Next.js 14** (App Router, TypeScript, Server Components + Server Actions)
- **Supabase** — Postgres + **PostGIS**, Auth (passwordless magic link), RLS
- **Stripe** — $10/month subscription after a 30-day trial
- Plain CSS design system carried over from the prototype (large type, high
  contrast, big tap targets — tuned for older users)

## The matching algorithm lives in the database

The "Recommended for you" ranking from `ALGORITHM.md` is implemented as the
`recommend_activities()` SQL function in
[`supabase/migrations/0002_ranking.sql`](supabase/migrations/0002_ranking.sql) —
the same six weighted signals (interest, proximity, time, social, availability,
freshness), using PostGIS `ST_Distance` for real geo. The Browse page calls it
via `supabase.rpc("recommend_activities", …)` and applies the diversity re-rank
in `lib/ranking.ts`.

## Project layout

```
app/
  page.tsx                      Landing
  browse/page.tsx               Listings + "Recommended for you" (calls the RPC)
  activity/[id]/page.tsx        Detail + join/leave (server action)
  post/page.tsx                 Host a new activity (server action)
  signup/page.tsx               Passwordless magic-link sign-in
  profile/page.tsx              Interests/prefs editor, trial status, your activities
  pricing/page.tsx              Free trial → $10/month
  auth/callback/route.ts        Magic-link code exchange
  auth/signout/route.ts
  api/stripe/checkout/route.ts  Start a subscription Checkout
  api/stripe/webhook/route.ts   Sync subscription status back to the DB
lib/
  supabase/{server,client,middleware,admin}.ts
  stripe.ts  types.ts  categories.ts  areas.ts  ranking.ts
supabase/
  migrations/0001_init.sql      Schema, triggers, RLS
  migrations/0002_ranking.sql   recommend_activities()
  seed.sql                      Optional demo activities
```

## Setup

1. **Install**
   ```bash
   cd web
   npm install
   ```

2. **Create a Supabase project**, then run both migrations (SQL editor, or the
   Supabase CLI):
   ```bash
   supabase db push   # or paste migrations/0001 then 0002 into the SQL editor
   ```

3. **Configure env** — copy `.env.example` to `.env.local` and fill in:
   - Supabase URL + anon key + service-role key (required)
   - `NEXT_PUBLIC_SITE_URL`
   - Stripe values are **optional** — leave them blank to skip payments.

4. **Stripe (optional — skip to run free)**
   Leave the `STRIPE_*` / `NEXT_PUBLIC_STRIPE_PRICE_ID` vars blank and the app
   runs in "early access" mode (everything free, membership button hidden).
   When you're ready to charge:
   - Grab **test-mode** keys from dashboard.stripe.com → Developers → API keys.
   - Create a recurring **$10/month** Price; put its id in `NEXT_PUBLIC_STRIPE_PRICE_ID`.
   - Add a webhook to `/api/stripe/webhook` for `checkout.session.completed`
     and `customer.subscription.*`.
   - Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

5. **Run**
   ```bash
   npm run dev   # http://localhost:3000
   ```
   Sign up (check your email for the link), add interests on your profile, then
   optionally run `supabase/seed.sql` to populate sample activities.

## Deploy

- **Vercel** for the app (set the same env vars; point the Stripe webhook at the
  deployed URL).
- **Supabase** hosts Postgres/Auth.

## Notes & next steps

- **Location privacy:** only neighborhood-level points are stored — never an exact
  address. `lib/areas.ts` maps demo neighborhoods to coordinates; swap in real
  geocoding (Mapbox/Google) when you add an address field.
- **Capacity:** enforced in the UI; add a DB trigger/constraint to make it strict
  under concurrency.
- **Reminders:** wire Resend (email) + Twilio (SMS) to a scheduled function — a
  high-value feature for this audience.
- **PWA:** add a manifest + service worker (e.g. `next-pwa`) to make it installable.
- **Trial enforcement:** gate posting/joining on `trial_ends_at`/`subscription_status`
  once you're ready to make the paywall real.
