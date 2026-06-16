import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, categoryById } from "@/lib/categories";
import { AREA_NAMES } from "@/lib/areas";
import { ActivityCard } from "@/components/ActivityCard";
import { updateProfile } from "./actions";
import { isStripeConfigured } from "@/lib/stripe";
import type { Profile, RankedActivity } from "@/lib/types";

export const dynamic = "force-dynamic";

function trialDaysLeft(p: Profile) {
  const left = Math.ceil((+new Date(p.trial_ends_at) - Date.now()) / 86400000);
  return Math.max(0, left);
}
function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const me = profile as Profile;

  // Activities I host and activities I'm attending.
  const { data: hostingRows } = await supabase
    .from("activities")
    .select("id,title,category,starts_at,place,area,capacity")
    .eq("host_id", user.id)
    .order("starts_at");

  const { data: goingRows } = await supabase
    .from("attendees")
    .select("activity:activities(id,title,category,starts_at,place,area,capacity,host_id)")
    .eq("profile_id", user.id);

  const toCard = (r: any): RankedActivity => ({
    id: r.id, title: r.title, category: r.category, starts_at: r.starts_at,
    place: r.place, area: r.area, capacity: r.capacity, host_name: "",
    attendee_count: 0, joined: true, distance_km: null, score: 0, reasons: [],
  });

  const hosting = (hostingRows ?? []).map(toCard);
  const going = (goingRows ?? [])
    .map((r: any) => r.activity)
    .filter((a: any) => a && a.host_id !== user.id)
    .map(toCard);

  const left = trialDaysLeft(me);
  const isMember = me.subscription_status === "active";
  const billingOn = isStripeConfigured();

  return (
    <div className="wrap">
      <div className="page-head" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <span className="avatar" style={{ width: 64, height: 64, fontSize: 26 }}>{initials(me.name || "?")}</span>
        <div>
          <h1 style={{ margin: 0 }}>{me.name || "Welcome"}</h1>
          <p style={{ margin: 0 }}>{me.area ? `📍 ${me.area}` : "Welcome back"}</p>
        </div>
      </div>

      {isMember ? (
        <div className="notice" style={{ marginTop: 8 }}>
          <span aria-hidden="true">⭐</span><span>You&apos;re a <strong>member</strong>. Thanks for keeping the community going!</span>
        </div>
      ) : !billingOn ? (
        <div className="notice" style={{ marginTop: 8 }}>
          <span aria-hidden="true">💛</span><span>You&apos;re in <strong>early access</strong> — everything is free for now.</span>
        </div>
      ) : (
        <div className="notice" style={{ marginTop: 8, alignItems: "center", justifyContent: "space-between" }}>
          <span>⭐ <strong>{left} day{left === 1 ? "" : "s"} left</strong> in your free trial. After that it&apos;s $10/month.</span>
          <form action="/api/stripe/checkout" method="post">
            <button className="btn btn-accent" style={{ minHeight: 48, padding: "10px 20px", fontSize: 17 }}>Become a member</button>
          </form>
        </div>
      )}

      {/* Interests / preferences editor */}
      <section className="block" style={{ padding: "24px 0" }}>
        <h2 style={{ marginBottom: 4 }}>Your interests &amp; preferences</h2>
        <p style={{ color: "var(--muted)", marginBottom: 18 }}>These power your &quot;Recommended for you&quot; picks.</p>
        <form className="form-card" action={updateProfile} style={{ margin: 0 }}>
          <div className="two-col">
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" type="text" defaultValue={me.name} required />
            </div>
            <div className="field">
              <label htmlFor="area">Neighborhood</label>
              <select id="area" name="area" defaultValue={me.area ?? ""}>
                <option value="" disabled>Choose…</option>
                {AREA_NAMES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>What do you enjoy?</label>
            <div className="cat-picker">
              {CATEGORIES.map((c) => (
                <label key={c.id} className="cat-option" style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    name="interests"
                    value={c.id}
                    defaultChecked={me.interests?.includes(c.id)}
                    style={{ marginBottom: 6 }}
                  />
                  <span className="ico" aria-hidden="true">{c.icon}</span>
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="time_pref">When do you like to meet?</label>
            <select id="time_pref" name="time_pref" defaultValue={me.time_pref}>
              <option value="any">Any time</option>
              <option value="morning">Mornings</option>
              <option value="afternoon">Afternoons</option>
              <option value="evening">Evenings</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg">Save preferences</button>
        </form>
      </section>

      <section className="block" style={{ padding: "24px 0" }}>
        <h2 style={{ marginBottom: 18 }}>Activities you&apos;re hosting ({hosting.length})</h2>
        {hosting.length ? (
          <div className="grid">{hosting.map((a) => <ActivityCard key={a.id} a={a} />)}</div>
        ) : (
          <div className="empty"><div className="big">📌</div><p>You&apos;re not hosting anything yet.</p>
            <p style={{ marginTop: 14 }}><Link className="btn btn-primary" href="/post">Post an activity</Link></p></div>
        )}
      </section>

      <section className="block" style={{ padding: "24px 0" }}>
        <h2 style={{ marginBottom: 18 }}>Activities you&apos;re going to ({going.length})</h2>
        {going.length ? (
          <div className="grid">{going.map((a) => <ActivityCard key={a.id} a={a} />)}</div>
        ) : (
          <div className="empty"><div className="big">🗓️</div><p>You haven&apos;t joined any activities yet.</p>
            <p style={{ marginTop: 14 }}><Link className="btn btn-primary" href="/browse">Find activities</Link></p></div>
        )}
      </section>

      <div style={{ padding: "20px 0 40px" }}>
        <form action="/auth/signout" method="post">
          <button type="submit" className="btn btn-outline">Sign out</button>
        </form>
      </div>
    </div>
  );
}
