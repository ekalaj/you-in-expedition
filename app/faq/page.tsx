import Link from "next/link";

export const metadata = { title: "FAQs — Common Ground" };

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is Common Ground?",
    a: "It's a friendly way to find local get-togethers — like cards, knitting, dominoes, walks and coffee — with neighbors who enjoy the same things. Think of it as a simple meetup made for people who'd rather get together than scroll.",
  },
  {
    q: "Do I need to be good with computers or phones?",
    a: "Not at all. The whole site is built to be simple: big text, large buttons, plain language, and no photos to post. If you can check email, you can use Common Ground.",
  },
  {
    q: "How much does it cost?",
    a: (
      <>
        Your first 30 days are free, with no card required. After that it&apos;s $10 a month, and
        you can cancel any time. <Link href="/pricing">See pricing</Link>.
      </>
    ),
  },
  {
    q: "How do I sign in? I didn't get a password.",
    a: "There's no password to remember. When you sign in, we email you a secure link — just click it (or copy it into your browser) and you're in. It's simpler and safer than a password.",
  },
  {
    q: "Do I have to post photos of myself?",
    a: "Never. Common Ground isn't social media — there are no photos to post, no 'likes,' and no follower counts. Just real get-togethers with real people.",
  },
  {
    q: "How do I join an activity?",
    a: "Open any activity from the 'Find Activities' page, read the details, and tap 'Join this activity' to save your spot. You'll see who else is coming. You can cancel any time.",
  },
  {
    q: "Can I host my own get-together?",
    a: (
      <>
        Yes, and it&apos;s easy — it takes about a minute. See{" "}
        <Link href="/how-it-works">How it works</Link> for the steps.
      </>
    ),
  },
  {
    q: "Is it safe to meet people I don't know?",
    a: (
      <>
        Activities happen in public, welcoming places, and you choose what to join. We have a few
        simple <Link href="/safety">safety tips</Link>, and you can report anything that doesn&apos;t
        feel right.
      </>
    ),
  },
  {
    q: "How do I cancel?",
    a: "You can cancel your membership any time — there's no fuss and no cancellation fee. If you ever need a hand, just reach out and we'll help.",
  },
];

export default function FaqPage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Common questions</h1>
        <p>Everything you might be wondering, in plain language.</p>
      </div>

      <section className="block" style={{ paddingTop: 16 }}>
        <div className="faq-list">
          {FAQS.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "var(--muted)", marginTop: 32, fontSize: 18 }}>
          Still have a question? <Link href="/contact">Get in touch</Link> — we&apos;re happy to help.
        </p>
      </section>
    </div>
  );
}
