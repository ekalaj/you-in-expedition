import Link from "next/link";
import { categoryById } from "@/lib/categories";
import type { RankedActivity } from "@/lib/types";

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
function spotsLabel(a: RankedActivity) {
  const left = a.capacity - a.attendee_count;
  if (left <= 0) return { text: "Full", cls: "full" };
  if (left <= 2) return { text: `${left} spot${left === 1 ? "" : "s"} left`, cls: "few" };
  return { text: `${left} spots left`, cls: "" };
}

export function ActivityCard({ a, showReasons = false }: { a: RankedActivity; showReasons?: boolean }) {
  const cat = categoryById(a.category);
  const spots = spotsLabel(a);
  return (
    <article className="card">
      <div className={`banner ${cat.cls}`}>
        <span className="ico" aria-hidden="true">{cat.icon}</span>
        <span>{cat.name}</span>
      </div>
      <div className="body">
        <h3>{a.title}</h3>
        {showReasons && a.reasons?.length > 0 && (
          <div className="match-row">
            {a.reasons.slice(0, 2).map((r) => (
              <span className="match-chip" key={r}>{r}</span>
            ))}
          </div>
        )}
        <ul className="meta">
          <li><span className="mi" aria-hidden="true">📅</span> {shortDate(a.starts_at)} · {timeLabel(a.starts_at)}</li>
          <li><span className="mi" aria-hidden="true">📍</span> {a.place}, {a.area}</li>
          <li><span className="mi" aria-hidden="true">👤</span> Hosted by {a.host_name}</li>
        </ul>
        {a.joined && <span className="badge joined">✓ You&apos;re going</span>}
        <div className="foot">
          <span className={`spots ${spots.cls}`}>{spots.text}</span>
          <Link className="btn btn-outline" href={`/activity/${a.id}`}>View &amp; join</Link>
        </div>
      </div>
    </article>
  );
}
