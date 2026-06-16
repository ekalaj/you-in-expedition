import Link from "next/link";
import { isStripeConfigured } from "@/lib/stripe";

export default function PricingPage() {
  const billingOn = isStripeConfigured();
  return (
    <div className="wrap">
      <div className="page-head" style={{ textAlign: "center" }}>
        <h1>Simple, friendly pricing</h1>
        <p>Try everything free. Stay if you love it. Leave whenever you like.</p>
      </div>

      <section className="block" style={{ paddingTop: 24 }}>
        <div className="price-grid">
          <div className="price-card">
            <h3>Free Trial</h3>
            <div className="amt">$0</div>
            <p style={{ color: "var(--muted)" }}>for your first 30 days</p>
            <ul>
              <li>Find every activity near you</li>
              <li>Join as many as you like</li>
              <li>Host your own get-togethers</li>
              <li>No card needed to start</li>
            </ul>
            <Link href="/signup" className="btn btn-outline btn-lg btn-block">Start free</Link>
          </div>
          <div className="price-card feature">
            <span className="tag">Best value</span>
            <h3>Membership</h3>
            <div className="amt">$10<small> / month</small></div>
            <p style={{ color: "var(--muted)" }}>after your free trial</p>
            <ul>
              <li>Everything in the free trial</li>
              <li>Unlimited joining and hosting</li>
              <li>Reminders before your activities</li>
              <li>Cancel anytime — no fuss</li>
            </ul>
            {billingOn ? (
              <form action="/api/stripe/checkout" method="post">
                <button className="btn btn-primary btn-lg btn-block">Become a member</button>
              </form>
            ) : (
              <Link href="/signup" className="btn btn-primary btn-lg btn-block">Start free</Link>
            )}
          </div>
        </div>

        {!billingOn && (
          <p style={{ textAlign: "center", color: "var(--muted)", maxWidth: 620, margin: "28px auto 0", fontSize: 18 }}>
            💛 We&apos;re in early access — everything is free for now. Paid membership turns on later.
          </p>
        )}
      </section>
    </div>
  );
}
