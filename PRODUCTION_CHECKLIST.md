# Common Ground — Production Checklist

Things to do before treating this as a real, public, paid product. The app
works today on test infrastructure; this is the path to hardening it.

## Security & anti-abuse
- [ ] **Turnstile CAPTCHA on sign-up** (Cloudflare Turnstile, free). Supabase has
      native support — add keys in Supabase Auth + pass the token from the signup form.
- [ ] **Tighten Supabase Auth rate limits** (Authentication → Rate Limits): cap
      signups, emails/hour, token verifications per IP. *(Toggle only.)*
- [ ] **Vercel Firewall / Attack Challenge Mode** (project → Firewall). *(Toggle only.)*
- [ ] App-level guardrails: limit how many activities a brand-new account can post;
      honeypot field on forms; block disposable-email domains at signup.

## Payments
- [ ] Switch Stripe from **test** to **live** keys.
- [ ] **Enforce the paywall**: gate posting/joining on `trial_ends_at` /
      `subscription_status` once the trial ends.
- [ ] Add a Stripe **billing portal** link so members can manage/cancel.
- [ ] Set the **webhook secret** (`STRIPE_WEBHOOK_SECRET`) so subscription status
      syncs back to `profiles`.

## Email & domain
- [ ] **Custom domain** (e.g. commonground.app) on Vercel.
- [ ] **Dedicated email sender** (Resend/Postmark) via Supabase custom SMTP, so
      sign-in links land reliably and not in spam.
- [ ] Update Supabase **Site URL** + **Redirect URLs** to the custom domain.

## Trust & safety
- [x] **Report a problem** on activities (stored in `public.reports`).
- [ ] Operator review flow for reports (dashboard or admin view; currently read
      via Supabase directly).
- [ ] **Block / hide** a member or activity after review.
- [ ] Host verification for higher-trust events.

## Features that drive retention
- [ ] **Reminders** before events (email + SMS via Resend + Twilio).
- [ ] Real **address → map/distance** (Mapbox geocoding) instead of fixed neighborhoods.
- [ ] Recurring events; attendee messaging; invite-a-friend.
- [ ] **PWA** (installable on phone home screen).

## Quality
- [ ] Accessibility audit (WCAG) + testing with real seniors.
- [ ] Capacity enforced at the DB level (trigger/constraint) for concurrency.
- [ ] Basic analytics + error monitoring.
- [ ] Fix the `seed.sql` time math (use `date_trunc('day', now())`).
