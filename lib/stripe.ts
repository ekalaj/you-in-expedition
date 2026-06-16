import Stripe from "stripe";

// Stripe is optional. The app runs fully without it; the membership button
// simply shows an "early access" state until these env vars are set.
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
}

let _stripe: Stripe | null = null;

// Lazy accessor so importing this module never throws when Stripe is unconfigured.
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured (STRIPE_SECRET_KEY is missing).");
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
    });
  }
  return _stripe;
}
