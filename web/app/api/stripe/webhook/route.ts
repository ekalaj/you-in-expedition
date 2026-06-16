import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionStatus } from "@/lib/types";

// Stripe webhook: keeps profiles.subscription_status in sync with Stripe.
// Configure the endpoint in the Stripe dashboard and set STRIPE_WEBHOOK_SECRET.
export async function POST(request: Request) {
  // No-op if Stripe isn't configured yet.
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Stripe not configured", { status: 200 });
  }
  const stripe = getStripe();

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new NextResponse(`Webhook signature error: ${(err as Error).message}`, { status: 400 });
  }

  const admin = createAdminClient();

  // Map a Stripe subscription status onto our coarser model.
  const mapStatus = (s: string): SubscriptionStatus => {
    if (s === "active" || s === "trialing") return "active";
    if (s === "past_due" || s === "unpaid") return "past_due";
    return "canceled";
  };

  async function syncByCustomer(customerId: string, status: SubscriptionStatus) {
    await admin.from("profiles").update({ subscription_status: status }).eq("stripe_customer_id", customerId);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.customer) await syncByCustomer(String(s.customer), "active");
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await syncByCustomer(String(sub.customer), mapStatus(sub.status));
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
