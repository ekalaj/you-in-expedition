import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ActivityCard } from "@/components/ActivityCard";
import { diversify } from "@/lib/ranking";
import { CATEGORIES } from "@/lib/categories";
import type { RankedActivity } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Recommendations are personalized; only fetch when signed in with interests.
  let recommended: RankedActivity[] = [];
  let hasInterests = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("interests")
      .eq("id", user.id)
      .single();
    hasInterests = !!profile?.interests?.length;

    if (hasInterests) {
      const { data } = await supabase.rpc("recommend_activities", {
        p_profile_id: user.id,
        p_limit: 12,
      });
      recommended = diversify((data as RankedActivity[]) ?? [], 6);
    }
  }

  // The full, filterable list. We reuse recommend_activities for a single signed-in
  // member so cards carry counts/joined; signed-out visitors get a plain listing.
  const activeCat = searchParams.cat ?? "all";
  let all: RankedActivity[] = [];

  if (user) {
    const { data } = await supabase.rpc("recommend_activities", {
      p_profile_id: user.id,
      p_limit: 200,
    });
    all = (data as RankedActivity[]) ?? [];
    // Re-sort the full list chronologically (recommendations stay score-sorted above).
    all.sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));
  } else {
    const { data } = await supabase
      .from("activities")
      .select("id,title,category,starts_at,place,area,capacity,host:profiles(name)")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at");
    all = ((data as any[]) ?? []).map((r) => ({
      id: r.id, title: r.title, category: r.category, starts_at: r.starts_at,
      place: r.place, area: r.area, capacity: r.capacity,
      host_name: r.host?.name ?? "A neighbor", attendee_count: 0,
      joined: false, distance_km: null, score: 0, reasons: [],
    }));
  }

  if (activeCat !== "all") all = all.filter((a) => a.category === activeCat);

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Activities near you</h1>
        <p>Find a friendly get-together and save your spot. New ones are added all the time.</p>
      </div>

      {recommended.length > 0 ? (
        <section aria-label="Recommended for you" style={{ marginBottom: 40 }}>
          <div className="rec-head">
            <h2>Recommended for you</h2>
            <span className="rec-sub">Based on your interests, neighborhood, and preferred times</span>
          </div>
          <div className="grid">
            {recommended.map((a) => (
              <ActivityCard key={a.id} a={a} showReasons />
            ))}
          </div>
        </section>
      ) : user && !hasInterests ? (
        <div className="rec-prompt" style={{ marginBottom: 40 }}>
          <div>
            <strong>Want picks chosen just for you?</strong>
            <p style={{ color: "var(--muted)", marginTop: 4 }}>Add a few interests to your profile and we&apos;ll sort by what fits you best.</p>
          </div>
          <Link className="btn btn-primary" href="/profile">Add my interests</Link>
        </div>
      ) : !user ? (
        <div className="rec-prompt" style={{ marginBottom: 40 }}>
          <div>
            <strong>Want picks chosen just for you?</strong>
            <p style={{ color: "var(--muted)", marginTop: 4 }}>Sign in and tell us what you enjoy.</p>
          </div>
          <Link className="btn btn-primary" href="/signup">Get my recommendations</Link>
        </div>
      ) : null}

      <h2 style={{ margin: "8px 0 20px" }}>All activities</h2>
      <div className="toolbar">
        <div className="filters" role="group" aria-label="Filter by activity type">
          <Link className={`filter-pill ${activeCat === "all" ? "active" : ""}`} href="/browse">✨ All</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} className={`filter-pill ${activeCat === c.id ? "active" : ""}`} href={`/browse?cat=${c.id}`}>
              <span aria-hidden="true">{c.icon}</span> {c.name}
            </Link>
          ))}
        </div>
        <Link href="/post" className="btn btn-accent">＋ Post an activity</Link>
      </div>

      {all.length > 0 ? (
        <div className="grid">
          {all.map((a) => (
            <ActivityCard key={a.id} a={a} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="big">🔍</div>
          <p>No activities here yet.</p>
          <p style={{ marginTop: 14 }}><Link className="btn btn-primary" href="/post">Be the first to post one</Link></p>
        </div>
      )}
    </div>
  );
}
