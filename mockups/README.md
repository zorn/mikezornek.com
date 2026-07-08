# Elixir Stabilization — exploration mockups

Throwaway static HTML mockups for the productized "Elixir Stabilization" offer.
**Not real site content** — this folder lives outside Hugo's build (`content/`,
`static/`, etc.), so it never ships. Open the `.html` files directly in a
browser to review layout and flow.

These capture the decisions from the design/grilling session. They are for
*looking at and arguing with*, not for wiring up. Per the exploration ground
rule: **no real forms are created** — the intake form is a visual mock only.

## Files

- `services-page.html` — the **convert** surface. The URL every pitch/social
  post points at. Leads with the on-ramp CTA; plans shown as the destination.
- `intake-form.html` — a **mock of the Google Form** (branching intake). Shows
  the router question and the three door-specific sections it reveals.
- `checklist-hub.html` — the **give** surface. Terse, skimmable stabilization
  checklist; SEO + trust magnet. Links down to (future) deep-dive spoke posts
  and offers one soft path to the services page.

## Decisions locked in the session

**Positioning — the "wedge" model**
- The generalist `content/elixir-consulting.md` page stays **untouched** (it
  protects the greenfield/feature identity Mike loves and wants to keep).
- "Elixir Stabilization" is a **separate offer surface**, not a rebrand. The
  narrow thing is the *marketing wedge and the offer*, not the person — same
  structure as FastRuby.io sitting in front of a generalist Rails shop.
- Why a wedge and not a rebrand: the bottleneck is **awareness, not
  conversion** ("nobody has said no — they've never heard of me"). The lever is
  top-of-funnel content, and stabilization pain ("app is slow", "flaky tests")
  is *searchable and budgeted* in a way "greenfield" is not.

**Content — hub & spoke**
- One **terse** canonical checklist (the hub) + deep-dive posts per item (the
  spokes) that link back up. Terse on purpose: buyers are senior devs/CTOs who
  skim; respect them, let them self-skip.
- The checklist is **three instruments at once**: (1) free give-away/SEO magnet,
  (2) the literal rubric the paid Audit scores a codebase against, (3) a
  **buyer segmenter** — see below.

**Two doors, reprioritized**
- Primary door: **"Bring me the problem you already have"** — the content
  audience is *technical* and already self-diagnosed via the free checklist, so
  they want hands, not a diagnosis.
  - Hero offer: **Monthly Stabilization Plan** (recurring, anti-Colony,
    depression-proof — steady money without constant re-selling).
  - **One-off surgical strike** kept as a welcome "try me" entry.
- Secondary door: **Audit → Roadmap** — for the *undiagnosed* / non-technical
  buyer (the "inherited a codebase, dev left a void" client), who arrives by
  referral, not the checklist.

**The ramp problem & its resolution**
- Dropping cold into an unfamiliar codebase, early hours are orientation, not
  output — so a cold client should never start on a low plan tier.
- Every plan is preceded by a **value-delivering on-ramp** (never a naked
  "onboarding fee" — every paid step must ship something visible):
  - Undiagnosed buyer → **Audit** (artifact: the Roadmap).
  - Technical buyer → **one-off fix** (artifact: a shipped PR).
- The low tier is therefore a **fluent steady-state**, never a cold start.

**Monthly Stabilization Plan — shape**
- Three tiers: **10 / 20 / 40 hrs / month.** (10, not 8 — "one day a month"
  reads as homeopathic; 10 crosses into real ongoing help.)
- Each tier's copy states its realistic **impact ceiling** — manages
  expectations and does the upsell.
- **Monthly, cancel-anytime.** Low commitment = easy yes + matches the
  "shallow entanglement / parachute in, leave" happiness requirement.
- **Soft hours, trust-based** — "some months run a little under, some a little
  over." Not a stopwatch. The framing pre-selects for good clients.
- Word choice: **"Monthly Stabilization Plan," never "retainer."** "Retainer"
  pattern-matches to the lawyer/availability model (pay to have someone on
  standby); this is a subscription to *delivered work*. "Plan" says that
  cleanly and reinforces the pitch.

**Funnel mechanics**
- Form → **templated quote** (async, ~10 min, not a meeting) → **pay** → work.
  **No free async work; no unbounded free sales calls.** Content did the
  trust-building the sales call used to. Optional call for the nervous, never
  required. Paid post-audit walkthrough calls are welcome (warm money).

**Page architecture (three surfaces + the untouched generalist page)**
- **Give** and **convert** live on **separate pages** — fusing them makes the
  free content feel like a bait-and-switch and dilutes both jobs.
- On the services page, the **primary first-step CTA is the on-ramp**
  (Audit / "hand me your first fix"). The **plan is shown as the destination**
  ("...then keep it healthy"), not the thing a cold visitor is asked to buy.

**Form tech**
- Site is static Hugo on Render — no backend to receive a POST. Assumption for
  now: a **Google Form** (supports branching via "go to section based on
  answer"). Don't hand-build native form plumbing before there's a paying
  client. `intake-form.html` is only a visual mock of that Google Form.

**Governing principle**
- Every pitch and every paid step must **deliver visible value** — solve a
  pain, increase their confidence in their delivery, make their life easier.
  Never charge for something the client can't see.
