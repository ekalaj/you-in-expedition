/* =====================================================================
   COMMON GROUND — recommendation algorithm
   Ranks nearby activities for a given member by how good a fit they are.
   Pure function of (member, activities); runs client-side in the prototype
   and mirrors the formula we'd later push into a Postgres "ORDER BY score".
   ===================================================================== */

/* Weights for each signal (tuned for an older, locally-focused audience:
   interest and proximity dominate). They sum to 1.0. */
const REC_WEIGHTS = {
  interest: 0.35,   // do the topics match what they enjoy?
  distance: 0.30,   // how close is it? (short trips matter a lot)
  time:     0.15,   // does the time of day suit them?
  social:   0.10,   // are people they've met going?
  avail:    0.05,   // is there room to join?
  fresh:    0.05,   // is it happening soon?
};

/* ---------- geo helpers ---------- */
function areaCoords(area) {
  if (!area) return null;
  const key = Object.keys(AREA_COORDS).find(k => k.toLowerCase() === area.toLowerCase());
  return key ? AREA_COORDS[key] : null;
}
function haversineKm(a, b) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
function kmToMiles(km) { return km * 0.621371; }

/* ---------- time helpers ---------- */
function activityTimeHour(t) {
  const m = /(\d+):(\d+)\s*(AM|PM)/i.exec(t || '');
  if (!m) return 12;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h;
}
function timeBucket(hour) {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/* People the member has already shared an activity with (basis for the
   "social" signal). Empty for a brand-new member, so it stays cold-start safe. */
function metPeople(member) {
  const set = new Set();
  getActivities().forEach(a => {
    if (a.attendees.includes(member.name)) {
      a.attendees.forEach(n => { if (n !== member.name) set.add(n); });
    }
  });
  return set;
}

/* ---------- score one activity for one member ---------- */
function scoreActivity(member, activity, ctx) {
  const reasons = [];
  const W = REC_WEIGHTS;

  // Interest: exact-category match scores high; everything else keeps a small
  // base so discovery is still possible.
  const interests = member.interests || [];
  const interestMatch = interests.includes(activity.category) ? 1 : 0.15;
  if (interestMatch === 1) {
    reasons.push({ k: 'interest', text: 'Matches your interest in ' + categoryById(activity.category).name });
  }

  // Distance: exponential decay over ~3 km. Unknown areas stay neutral.
  let proximity = 0.5, distMi = null;
  const mc = areaCoords(member.area), ac = areaCoords(activity.area);
  if (mc && ac) {
    const km = haversineKm(mc, ac);
    distMi = kmToMiles(km);
    proximity = Math.exp(-km / 3);
    reasons.push({ k: 'distance', text: distMi < 0.3 ? 'Right nearby' : distMi.toFixed(distMi < 10 ? 1 : 0) + ' mi away' });
  }

  // Time of day vs the member's stated preference.
  const pref = member.timePref || 'any';
  const bucket = timeBucket(activityTimeHour(activity.time));
  let timeFit = 0.6;
  if (pref === 'any') timeFit = 0.8;
  else if (pref === bucket) { timeFit = 1; reasons.push({ k: 'time', text: 'Fits your ' + pref + ' preference' }); }
  else timeFit = 0.4;

  // Social: how many fellow attendees they've met before.
  const others = activity.attendees.filter(n => n !== member.name);
  const known = others.filter(n => ctx.met.has(n));
  const social = others.length ? Math.min(1, known.length / 2) : 0;
  if (known.length) {
    reasons.push({ k: 'social', text: known.length + ' ' + (known.length === 1 ? 'person' : 'people') + " you've met going" });
  }

  // Availability and freshness.
  const left = activity.capacity - activity.attendees.length;
  const avail = left <= 0 ? 0 : (left <= 2 ? 0.6 : 1);
  const days = (new Date(activity.date) - new Date()) / 86400000;
  const fresh = days <= 3 ? 1 : (days <= 7 ? 0.7 : 0.4);

  const score = W.interest * interestMatch + W.distance * proximity + W.time * timeFit +
                W.social * social + W.avail * avail + W.fresh * fresh;

  return { score, reasons };
}

/* ---------- rank + diversity re-rank ---------- */
function recommend(member, opts) {
  opts = opts || {};
  const limit = opts.limit || 6;
  const todayStart = new Date(new Date().toDateString());

  // Hard filters: must be upcoming and not already full (unless we're in it).
  let list = getActivities().filter(a => {
    if (new Date(a.date) < todayStart) return false;
    const joined = a.attendees.includes(member.name);
    if (a.attendees.length >= a.capacity && !joined) return false;
    return true;
  });

  const ctx = { met: metPeople(member) };
  const scored = list.map(a => Object.assign({ a }, scoreActivity(member, a, ctx)));
  scored.sort((x, y) => y.score - x.score);

  // Diversity: cap at 2 of the same category in the top results so the list
  // isn't all one thing, then fill any remaining slots.
  const out = [], catCount = {};
  for (const s of scored) {
    const c = s.a.category;
    if ((catCount[c] || 0) >= 2) continue;
    out.push(s); catCount[c] = (catCount[c] || 0) + 1;
    if (out.length >= limit) break;
  }
  if (out.length < limit) {
    for (const s of scored) {
      if (out.indexOf(s) === -1) { out.push(s); if (out.length >= limit) break; }
    }
  }
  return out;
}
