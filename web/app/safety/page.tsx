import Link from "next/link";

export const metadata = { title: "Staying safe — Common Ground" };

const TIPS: { icon: string; title: string; body: string }[] = [
  {
    icon: "📍",
    title: "Meet in public places",
    body: "Get-togethers happen in cafés, libraries, community centers, and parks — open, welcoming spots with other people around. Avoid meeting at someone's home, especially the first time.",
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "It's okay to bring a friend",
    body: "Feel free to bring a neighbor or family member along to your first activity. There's no rule that says you have to come alone.",
  },
  {
    icon: "🔒",
    title: "Keep personal details private",
    body: "There's no need to share your home address, financial information, or other private details. Common Ground only ever shows your name and neighborhood — never your exact address.",
  },
  {
    icon: "💵",
    title: "Be cautious about money",
    body: "A genuine get-together will never pressure you to send money, share bank details, or 'invest' in anything. If someone does, step away and report them.",
  },
  {
    icon: "🤙",
    title: "Trust your gut",
    body: "If a person or situation doesn't feel right, you don't owe anyone an explanation. It's always okay to leave, and to let us know.",
  },
  {
    icon: "🚩",
    title: "Report anything concerning",
    body: "If something feels off — a person, a message, or an activity — please tell us so we can look into it and keep the community welcoming for everyone.",
  },
];

export default function SafetyPage() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Staying safe &amp; comfortable</h1>
        <p>A few simple, friendly tips for meeting new people.</p>
      </div>

      <section className="block" style={{ paddingTop: 16 }}>
        <div className="steps">
          {TIPS.map((t) => (
            <div className="step" key={t.title}>
              <div className="n" aria-hidden="true">{t.icon}</div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>

        <div className="notice" style={{ maxWidth: 760, margin: "36px auto 0" }}>
          <span aria-hidden="true">💛</span>
          <span>
            Common Ground is built to be kind and welcoming. The vast majority of members are simply
            neighbors looking for friendly company — these tips just help everyone feel at ease.
          </span>
        </div>

        <p style={{ textAlign: "center", marginTop: 28, fontSize: 18 }}>
          Need to report something or have a concern? <Link href="/contact">Contact us</Link> — we
          take it seriously.
        </p>
      </section>
    </div>
  );
}
