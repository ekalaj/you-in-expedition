# Common Ground — Matching & Ranking Algorithm

The core of the product isn't *listing* activities — it's showing each member the
get-togethers they're most likely to **actually attend**. That's a ranking
problem: for a member, score every nearby activity and sort.

This document describes the algorithm. A working client-side implementation lives
in [`js/recommend.js`](js/recommend.js) and powers the **"Recommended for you"**
rail on the Browse page. The same formula moves into a SQL `ORDER BY score` when
there's a backend.

## Inputs

**Member**
| Field | Used for |
|-------|----------|
| `interests[]` (category ids) | interest match |
| `area` → coordinates | distance |
| `timePref` (morning/afternoon/evening/any) | time fit |
| attendance history | social signal, cold-start detection |
| accessibility needs *(future)* | hard filter |

**Activity**
| Field | Used for |
|-------|----------|
| `category` / tags | interest match |
| `area` → coordinates | distance |
| `date`, `time` | time fit, freshness, "is it upcoming" |
| `capacity`, `attendees[]` | availability, social signal |
| `host` | social signal |

> **Privacy:** only **neighborhood-level** location is ever stored or shown —
> never a member's exact home address.

## Hard filters (run first, before scoring)

An activity is dropped from consideration unless **all** hold:
- it is **upcoming** (not in the past),
- it is **not full** (unless the member is already in it),
- its category is **not muted** by the member,
- *(future)* it meets the member's **accessibility** needs (e.g. flat paths, seating).

Filtering first keeps scoring cheap and guarantees nothing inappropriate is shown.

## Score

A weighted sum of six signals, each normalized to `0..1`:

```
Score = 0.35 · InterestMatch    do the topics match?
      + 0.30 · Proximity        how close is it?
      + 0.15 · TimeFit          does the time suit them?
      + 0.10 · SocialAffinity   are people they've met going?
      + 0.05 · Availability     is there room?
      + 0.05 · Freshness        is it happening soon?
```

Weights sum to 1.0 and are deliberately tilted toward **interest + proximity** —
the two things that matter most for a local, older audience. They live in one
constant (`REC_WEIGHTS`) so they're trivial to tune or later learn from data.

### Term definitions

| Term | Definition |
|------|------------|
| **InterestMatch** | `1.0` if the activity's category is in the member's interests, else a small base `0.15` (keeps discovery alive). Production: weighted cosine/Jaccard over a tag vector. |
| **Proximity** | Distance decay `exp(−d_km / 3)`. ~1 when next door, →0 by ~10 km. Unknown areas stay neutral (`0.5`). |
| **TimeFit** | `1.0` if the activity's time-of-day bucket matches `timePref`; `0.8` if pref is "any"; `0.4` otherwise. |
| **SocialAffinity** | Fraction of fellow attendees the member has shared an activity with (capped). `0` for new members. |
| **Availability** | `1.0` with room, `0.6` when only 1–2 spots remain, `0` when full. |
| **Freshness** | `1.0` within 3 days, `0.7` within a week, `0.4` beyond. |

## Cold start

A brand-new member has no history, so SocialAffinity is `0` and the ranking leans
entirely on **interests + proximity + time** — which is exactly why **sign-up asks
"what do you enjoy?" and "when do you like to meet?"** Those onboarding answers are
the seed for the whole experience. Without them there is nothing to rank on, so the
Browse page nudges un-onboarded visitors to add interests.

## Diversity re-rank

After sorting by score, a light MMR-style pass caps the results at **2 per
category**, then fills remaining slots. This stops the list from being all one
thing (e.g. six card games) and keeps discovery varied.

## Explainability

Each scored activity carries **reasons** ("Matches your interest in Knitting",
"0.6 mi away", "2 people you've met going"). The UI shows the two strongest as
chips. For this audience, *telling people why* something is suggested builds trust
and beats a black-box feed.

## Production mapping

| Prototype (now) | Production |
|-----------------|------------|
| `AREA_COORDS` lookup | geocode meeting place → `lat/lng`; store as PostGIS `geography` |
| `haversineKm()` | `ST_DWithin` / `ST_Distance` (indexed, fast radius queries) |
| client-side `recommend()` | SQL: filter with `ST_DWithin`, compute score in the query, `ORDER BY score LIMIT n` |
| fixed `REC_WEIGHTS` | start fixed; later learn weights from attend/no-show data |
| `metPeople()` over local data | a real "people you've met" edge table |

The formula does not change — only where it runs. Start with the fixed weights
above; once there's attendance data, the same six features become inputs to a
simple learned model (logistic regression on "did they attend?") without changing
the surrounding plumbing.
