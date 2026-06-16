import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/categories";
import { AREA_NAMES } from "@/lib/areas";
import { createActivity } from "./actions";

export const dynamic = "force-dynamic";

export default async function PostPage({ searchParams }: { searchParams: { error?: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Post an activity</h1>
        <p>Hosting is easy. Fill in a few details and neighbors nearby can join you.</p>
      </div>

      <form className="form-card" action={createActivity}>
        {searchParams.error && (
          <div className="notice" style={{ background: "#FBEAE6", borderColor: "#E6B9AE", color: "var(--terra-d)" }}>
            <span aria-hidden="true">⚠️</span>
            <span>Please fill in all the fields and try again.</span>
          </div>
        )}
        <div className="notice">
          <span aria-hidden="true">💡</span>
          <span>Tip: a friendly title and a sentence about what to expect helps people feel welcome.</span>
        </div>

        <div className="field">
          <label htmlFor="title">What&apos;s the activity?</label>
          <div className="hint">For example: &quot;Tuesday Dominoes Club&quot; or &quot;Morning Walk in the Park&quot;</div>
          <input id="title" name="title" type="text" required placeholder="Give it a friendly name" />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" required defaultValue="">
            <option value="" disabled>Choose one…</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" required />
          </div>
          <div className="field">
            <label htmlFor="time">Time</label>
            <input id="time" name="time" type="time" required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="place">Where will you meet?</label>
          <div className="hint">A café, community center, park, library — somewhere easy to find.</div>
          <input id="place" name="place" type="text" required placeholder="Place name" />
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="area">Neighborhood</label>
            <select id="area" name="area" required defaultValue="">
              <option value="" disabled>Choose…</option>
              {AREA_NAMES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="capacity">How many can join?</label>
            <input id="capacity" name="capacity" type="number" min={2} max={50} defaultValue={8} required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">Tell people what to expect</label>
          <div className="hint">A warm sentence or two. Mention if beginners are welcome, if there&apos;s tea, etc.</div>
          <textarea id="description" name="description" required placeholder="Write a short, friendly description..." />
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block">Post this activity</button>
      </form>
    </div>
  );
}
