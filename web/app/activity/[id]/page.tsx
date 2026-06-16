import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { categoryById } from "@/lib/categories";
import { toggleJoin } from "../actions";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default async function ActivityPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: activity } = await supabase
    .from("activities")
    .select("id,title,category,starts_at,place,area,capacity,description,host:profiles(id,name)")
    .eq("id", params.id)
    .maybeSingle();

  if (!activity) notFound();

  const { data: attendeeRows } = await supabase
    .from("attendees")
    .select("profile:profiles(id,name)")
    .eq("activity_id", params.id);

  const attendees = (attendeeRows ?? []).map((r: any) => r.profile).filter(Boolean);
  const host = (activity as any).host;
  const joined = !!user && attendees.some((a: any) => a.id === user.id);
  const full = attendees.length >= activity.capacity;
  const left = activity.capacity - attendees.length;
  const cat = categoryById(activity.category);

  const when = new Date(activity.starts_at);
  const dateLabel = when.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const timeLabel = when.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const spotsText = full ? "Full" : `${left} spot${left === 1 ? "" : "s"} left`;

  const join = toggleJoin.bind(null, activity.id);

  return (
    <div className="wrap">
      <p className="breadcrumb"><Link href="/browse">← Back to all activities</Link></p>

      <div className={`detail-head ${cat.cls}`}>
        <span className="ico" aria-hidden="true">{cat.icon}</span>
        <div>
          <div className="cat">{cat.name}</div>
          <h1>{activity.title}</h1>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <ul className="fact-list">
            <li><span className="fi" aria-hidden="true">📅</span><span><span className="fk">When</span>{dateLabel} at {timeLabel}</span></li>
            <li><span className="fi" aria-hidden="true">📍</span><span><span className="fk">Where</span>{activity.place}<br />{activity.area}</span></li>
            <li><span className="fi" aria-hidden="true">👤</span><span><span className="fk">Hosted by</span>{host?.name ?? "A neighbor"}</span></li>
          </ul>

          <h2 style={{ margin: "30px 0 12px" }}>About this get-together</h2>
          <div className="prose"><p>{activity.description}</p></div>

          <h2 style={{ margin: "30px 0 12px" }}>Who&apos;s coming ({attendees.length})</h2>
          <div className="attendees">
            {attendees.map((a: any) => (
              <span className="who" key={a.id}><span className="avatar">{initials(a.name || "?")}</span>{a.name}</span>
            ))}
          </div>
        </div>

        <aside>
          <div className="side-card">
            <div className="spots-big">{spotsText}</div>
            <p style={{ color: "var(--muted)", marginBottom: 6 }}>{attendees.length} of {activity.capacity} spots filled</p>

            <div className="host-line">
              <span className="avatar">{initials(host?.name || "?")}</span>
              <div><strong>{host?.name ?? "A neighbor"}</strong><br /><span style={{ color: "var(--muted)", fontSize: 16 }}>Host</span></div>
            </div>

            {user ? (
              <form action={join}>
                <button
                  type="submit"
                  className={`btn btn-block btn-lg ${joined ? "btn-outline" : "btn-primary"}`}
                  disabled={full && !joined}
                >
                  {joined ? "✓ You're going — tap to cancel" : full ? "This activity is full" : "Join this activity"}
                </button>
              </form>
            ) : (
              <Link href="/signup" className="btn btn-primary btn-block btn-lg">Sign in to join</Link>
            )}
            <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 14, textAlign: "center" }}>
              Free to join while you&apos;re a member.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
