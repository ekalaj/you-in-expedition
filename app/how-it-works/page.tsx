import Link from "next/link";

export const metadata = { title: "How it works — Common Ground" };

export default function HowItWorksPage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>How Common Ground works</h1>
        <p>A simple, friendly way to find local get-togethers — no complicated apps, no pressure.</p>
      </div>

      <section className="block" style={{ paddingTop: 24 }}>
        <div className="steps">
          <div className="step">
            <div className="n">1</div>
            <h3>Tell us what you enjoy</h3>
            <p>When you sign up, pick a few interests — cards, knitting, walking, coffee — and your neighborhood. That&apos;s all it takes to get started.</p>
          </div>
          <div className="step">
            <div className="n">2</div>
            <h3>See activities near you</h3>
            <p>Your &quot;Recommended for you&quot; list shows get-togethers close to home that match the things you like and the times you prefer.</p>
          </div>
          <div className="step">
            <div className="n">3</div>
            <h3>Join in — or host your own</h3>
            <p>Tap &quot;Join&quot; to save your spot and see who else is coming. Want to start something? Posting your own activity takes about a minute.</p>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <div className="prose" style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2>Joining an activity</h2>
          <p>Browse the activities near you and open any that catch your eye. You&apos;ll see when and where it is, a friendly description, and who&apos;s already coming. When you&apos;re ready, tap <strong>Join this activity</strong> to save your spot. You can always change your mind — just open it again and tap to cancel.</p>

          <h2>Hosting your own</h2>
          <p>Hosting is welcoming and easy. Give your get-together a friendly name, pick a category, choose a date, time, and an easy-to-find place, and write a sentence about what to expect. You&apos;ll be listed as the host and the first one going. Neighbors nearby can then find and join you.</p>

          <h2>What it costs</h2>
          <p>Your first 30 days are completely free — no card needed. After that, membership is $10 a month, which keeps the community running and ad-free. You can cancel any time. <Link href="/pricing">See pricing</Link>.</p>

          <h2>Staying comfortable and safe</h2>
          <p>Activities happen in public, welcoming places. We have a few simple <Link href="/safety">safety tips</Link> for meeting new people, and you can always report anything that doesn&apos;t feel right.</p>
        </div>
      </section>

      <div className="wrap">
        <section className="cta-banner">
          <h2>Ready to find your people?</h2>
          <p>Start free today — it only takes a minute.</p>
          <Link href="/signup" className="btn btn-primary btn-lg">Start free</Link>
        </section>
      </div>
    </div>
  );
}
