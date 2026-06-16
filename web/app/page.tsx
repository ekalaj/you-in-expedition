import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function HomePage() {
  return (
    <>
      <div className="wrap">
        <section className="hero">
          <div>
            <span className="eyebrow">👋 For folks who&apos;d rather get together than scroll</span>
            <h1>Find friends and activities, <em>close to home.</em></h1>
            <p className="lede">
              Common Ground helps you discover friendly local get-togethers — cards, knitting,
              dominoes, walks and more — with neighbors who enjoy the same things you do.
            </p>
            <div className="cta-row">
              <Link href="/browse" className="btn btn-primary btn-lg">Find activities near me</Link>
              <Link href="/post" className="btn btn-outline btn-lg">Post your own</Link>
            </div>
            <p className="reassure">✓ Free for your first 30 days &nbsp;·&nbsp; ✓ No photos to post &nbsp;·&nbsp; ✓ Cancel anytime</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="mini-card"><span className="ico">🂡</span><span><span className="t">Friendly Bridge Afternoon</span><br /><span className="s">Tomorrow · Maple Street Center</span></span></div>
            <div className="mini-card"><span className="ico">🧶</span><span><span className="t">Knitting Circle &amp; Chat</span><br /><span className="s">Saturday · The Yarn Corner</span></span></div>
            <div className="mini-card"><span className="ico">🚶</span><span><span className="t">Morning Walk in the Park</span><br /><span className="s">Tomorrow · Greenfield Park</span></span></div>
          </div>
        </section>
      </div>

      <section className="block" style={{ background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="section-head">
            <h2>It&apos;s as easy as one, two, three</h2>
            <p>No complicated apps. No pressure. Just a simple way to meet up.</p>
          </div>
          <div className="steps">
            <div className="step"><div className="n">1</div><h3>Look around</h3><p>Browse activities happening near you. Filter by what you enjoy.</p></div>
            <div className="step"><div className="n">2</div><h3>Join in</h3><p>See one you like? Save your spot, and see who else is coming.</p></div>
            <div className="step"><div className="n">3</div><h3>Show up &amp; enjoy</h3><p>Meet your neighbors. Want to host your own? It takes about a minute.</p></div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <h2>So many ways to connect</h2>
            <p>Whatever you&apos;re into, there are neighbors who&apos;d love to join you.</p>
          </div>
          <div className="cat-row">
            {CATEGORIES.map((c) => (
              <Link key={c.id} className="cat-chip" href={`/browse?cat=${c.id}`}>
                <span className="ico" aria-hidden="true">{c.icon}</span> {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="cta-banner">
          <h2>Your first month is on us</h2>
          <p>Try everything free for 30 days. After that it&apos;s just $10 a month.</p>
          <Link href="/signup" className="btn btn-primary btn-lg">Start free</Link>
        </section>
      </div>
    </>
  );
}
