# Common Ground (working name)

**Friends and activities, close to home.**

A clickable prototype for a "Meetup for seniors" — a simple, senior-first way to
find friendly local get-togethers (cards, knitting, dominoes, walks, coffee and
more) with neighbors who share the same interests. It's the helpful part of
Meetup, without the popularity-contest feel of social media: **no photos to post,
nothing to perform, just real activities close to home.**

## What this is (and isn't)

This is a **front-end prototype** — pure HTML, CSS and a little vanilla
JavaScript. There is **no server, no real accounts, and no payments**. It's meant
to let you click through the whole experience and share the idea.

To make the demo feel real, your actions (signing up, posting an activity,
joining/leaving) are saved in your **browser only**, using `localStorage`. Clearing
your browser data resets it to the sample activities.

## Run it

No build step. Just open `index.html` in a browser, or serve the folder:

```bash
cd common-ground
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What you can do in the prototype

- **Browse activities** by category (cards, dominoes, crafts, walking, coffee…)
- **Open an activity** to see when/where, the description, and who's coming
- **Join / cancel** — spots update live, and "Full" activities are blocked
- **Post your own activity** with a friendly form — it appears in the listings
- **Sign up** for a simulated free 30-day trial and see your **trial days left**
- **My Activities** — see what you're hosting and going to
- **Pricing** — free trial → $10/month

## Senior-first design choices

- Large base font (19px) and high-contrast colors
- Big tap targets (buttons ≥ 56px tall) and clear, visible focus outlines
- Simple, shallow navigation and plain language
- Friendly category icons for quick recognition
- No required photos, no "likes," no follower counts
- Respects "reduce motion" accessibility settings

## File overview

| File | Purpose |
|------|---------|
| `index.html` | Landing page: value prop, how it works, categories, pricing CTA |
| `browse.html` | Activity listings with category filters |
| `activity.html` | Single activity detail + join/leave |
| `post.html` | Form to host a new activity |
| `signup.html` | Simulated free-trial sign-up |
| `profile.html` | "My Activities" + trial status |
| `pricing.html` | Free trial → $10/month |
| `css/styles.css` | Shared design system |
| `js/data.js` | Categories + sample activities |
| `js/app.js` | Storage, join/post logic, helpers |

## Suggested next steps toward a real product

1. **Backend & accounts** — real sign-up/sign-in, a database for activities and RSVPs.
2. **Location search** — find activities by distance / postcode, with a map.
3. **Payments** — Stripe subscription for the $10/month plan after the trial (30 or 90 days).
4. **Reminders** — email/text reminders before an activity (great for the target audience).
5. **Safety & trust** — reporting, host verification, community guidelines.
6. **Accessibility audit** — formal WCAG check, plus larger-text and screen-reader testing with real seniors.

> Naming note: "Common Ground" is a working name and easy to change throughout.
