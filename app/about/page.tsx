import Link from "next/link";

export const metadata = { title: "About — Common Ground" };

export default function AboutPage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>About Common Ground</h1>
        <p>Friends and activities, close to home.</p>
      </div>

      <section className="block" style={{ paddingTop: 16 }}>
        <div className="prose" style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 21 }}>
            Common Ground exists for a simple reason: getting together with people nearby should be
            easy, warm, and free of fuss — especially as we get older and our circles get smaller.
          </p>

          <h2>Why we built it</h2>
          <p>
            Plenty of apps promise connection, but most are loud, busy, and built around being
            popular. That&apos;s not what most people want. They want a card game on Tuesday, a
            morning walk with a neighbor, a knitting circle and a cup of tea. Real, local, in-person
            — without performing for anyone.
          </p>
          <p>
            So we made the opposite of social media: no photos to post, no &quot;likes,&quot; no
            follower counts. Just clear, friendly listings of get-togethers happening close to home,
            and an easy way to join or host one.
          </p>

          <h2>Made to be simple and kind</h2>
          <p>
            Every part of Common Ground is designed to be easy on the eyes and easy to use — large
            text, high contrast, big buttons, and plain language. If you can check your email, you
            can find your people here.
          </p>

          <h2>Where we&apos;re headed</h2>
          <p>
            We&apos;re just getting started. We&apos;re adding friendly reminders before your
            activities, more neighborhoods, and helpful tools for hosts — always keeping things
            simple, safe, and welcoming.
          </p>
        </div>
      </section>

      <div className="wrap">
        <section className="cta-banner">
          <h2>Come find your people</h2>
          <p>Your first month is on us.</p>
          <Link href="/signup" className="btn btn-primary btn-lg">Start free</Link>
        </section>
      </div>
    </div>
  );
}
