import Stripe from "stripe";

// Server-only Stripe client. Never import this into a Client Component.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});
