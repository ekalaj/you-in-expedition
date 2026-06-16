import type { RankedActivity } from "./types";

// Diversity re-rank — the one part of ALGORITHM.md that lives in the app layer
// rather than SQL. The recommend_activities() function already returns rows in
// descending score; here we cap the result at `maxPerCategory` of any single
// category so the list isn't all one thing, then fill remaining slots.
export function diversify(
  ranked: RankedActivity[],
  limit = 6,
  maxPerCategory = 2
): RankedActivity[] {
  const out: RankedActivity[] = [];
  const counts: Record<string, number> = {};

  for (const a of ranked) {
    if ((counts[a.category] ?? 0) >= maxPerCategory) continue;
    out.push(a);
    counts[a.category] = (counts[a.category] ?? 0) + 1;
    if (out.length >= limit) break;
  }
  if (out.length < limit) {
    for (const a of ranked) {
      if (!out.includes(a)) {
        out.push(a);
        if (out.length >= limit) break;
      }
    }
  }
  return out;
}
