import Link from "next/link";

export const metadata = { title: "Contact — Common Ground" };

// Update this to your preferred support address any time.
const SUPPORT_EMAIL = "support@albatechservices.com";

export default function ContactPage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Get in touch</h1>
        <p>We&apos;re a friendly bunch and happy to help.</p>
      </div>

      <section className="block" style={{ paddingTop: 16 }}>
        <div className="prose" style={{ maxWidth: 680, margin: "0 auto" }}>
          <p>
            Have a question, an idea, or need a hand getting started? We&apos;d love to hear from
            you. The easiest way to reach us is by email — we read every message.
          </p>

          <div className="notice" style={{ marginTop: 8 }}>
            <span aria-hidden="true">✉️</span>
            <span>
              Email us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>
                <strong>{SUPPORT_EMAIL}</strong>
              </a>
            </span>
          </div>

          <p style={{ marginTop: 24 }}>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="btn btn-primary btn-lg">
              Send us an email
            </a>
          </p>

          <h2>Looking for answers right now?</h2>
          <p>
            Many common questions are answered on our <Link href="/faq">FAQ page</Link>, and{" "}
            <Link href="/how-it-works">How it works</Link> walks through joining and hosting.
          </p>
        </div>
      </section>
    </div>
  );
}
