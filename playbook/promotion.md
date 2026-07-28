# Promotion

After posting something I am particularly proud of I tend to share it for more exposure.

Some of the places include:

- Personal Mastodon
- Personal Twitter
- Personal Bluesky
- Elixir Slack (#blogs room)
- LinkedIn
- LinkedIn Elixir Group
- Reddit r/elixir
- https://elixirstatus.com — also feeds [Elixir Weekly](https://elixirweekly.net/),
  which is curated from ElixirStatus, so posting here is the submission path for
  both; no separate Elixir Weekly step needed.
- Elixir Forum? https://elixirforum.com/c/learning-resources/blogs-podcasts/60 —
  under Blogs & Podcasts, post in the **Blog Posts** subcategory, *not* the
  **Blogs** one. **Blogs** is for blog posts written on the forum itself, and its
  composer says so outright: "this section is for on-forum blog posts only (if
  you are posting a link to a blog post, use the Blog Posts section)." It also
  demands a `blog-cat-…` tag, which is the tell that you've picked the wrong
  subcategory. A link back to mikezornek.com always belongs in **Blog Posts**.
- Elixir Discord (#share channel)
- Philly Cocoa Slack
- 30x500 Slack (share as an ebomb)
- [Elixir Radar](https://elixir-radar.com/) newsletter — submit by email to
  Hugo at Elixir Radar <hugo@elixir-radar.com>, opening with "For consideration
  in the newsletter:" and the tagged post URL. Not a self-serve post: it's a
  curated newsletter, so it's a suggestion, not a guaranteed placement.

Not a venue I post to, but worth knowing about:

- **[Elixir Newsletter](https://elixir-hub.com/newsletter)** (Curiosum, weekly
  Thursdays, 1,500+ subscribers) — **no submission path exists**; I looked. They
  curate from the same watering holes in the list above, and picked up a post
  unprompted in Jul 2026 (30 visitors, ~2% of their list). So the way to "get
  into it" is just to keep working the venues above. Nothing to add to the
  routine.

Some venues post as a thread, not just a body: **Elixir Forum**, **Reddit
r/elixir**, **ElixirStatus**, and the **Elixir Discord #share channel** each
need a title. Reuse the blog post's own title verbatim rather than inventing a
new one. The Discord #share channel is a forum channel, so it also takes post
tags (set `Blog posts` and `Elixir`) in place of hashtags.

## UTM tagging

Tag every shared link with UTM params so I can tell *which venue* produced the
traffic and the signup. Without them every venue lands on the same URL and I'm
back to guessing where to spend promo effort. Confirmed working in the first
real measured week (2026-07-21): every venue resolved cleanly in Plausible's
Campaigns breakdown.

Two readouts, and they answer different questions:

- **Reach → Plausible.** Campaigns and Sources tabs: who sent visitors.
- **Signups → Kit, not Plausible.** Kit stores the **full UTM tuple on the
  subscriber record** (`utm_source`, `utm_campaign`, referrer) alongside the
  `signup_page` hidden field — so "which venue produced this subscribe" is
  answered *per person*, exactly, rather than inferred from a goal-filtered
  aggregate. The Plausible `Form: Submission` goal is worth keeping as a rough
  cross-check only; the two didn't reconcile in week one, and **Kit is the
  authority.**

Two params, all lowercase, no spaces:

| Param | Value | What it answers |
|---|---|---|
| `utm_source` | the venue (see vocabulary below) | Where do I spend promo effort? |
| `utm_campaign` | the post slug | Per-post pull (which post the share drove) |

`utm_source` is the load-bearing one: social apps strip the referrer and every
venue lands on the same post URL, so it's the only way to tell the venues apart.
`utm_campaign` is partly redundant (the signup event already records which post
page it fired on) but makes it easy to roll up a post's shares across venues.
I skip `utm_medium` on purpose: it's just a bucket I can read off the source
name, so it earns nothing.

Source vocabulary (keep these stable so trends hold across posts):

- `mastodon`, `twitter`, `bluesky`
- `linkedin`, `linkedin-elixir`
- `reddit`, `elixir-forum`, `elixirstatus`, `elixir-discord`
- `elixir-slack`, `elixir-radar`, `philly-cocoa`, `30x500`

### What each venue is actually good for

First measured week (2026-07-21 to 07-27, *Guarding Against AI Drift*). Numbers
are thin and this is one post — treat as a starting picture, not a ranking.

| Venue | Visitors | Notes |
|---|---|---|
| Reddit r/elixir | **150** | **The reach engine.** 5,600 views, best clickthrough measured (2.7%). Comments were tool-swapping, not help-seeking — no leads in the thread. |
| Elixir Forum | 68 | Solid, steady. |
| Elixir Slack | 42 | Solid, steady. |
| LinkedIn | 41 | **The qualified one** — the only venue that produced a signup. 85% of its reach was *out-of-network*, and 33% of the audience is Greater Philadelphia. Small numbers, best people. |
| Bluesky | 38 | ~5:1 better than Mastodon for me. |
| elixirstatus | 26 | Worth the manual submission. |
| Mastodon | 8 | Engagement here favours my personal posts over blog shares. |
| X / Twitter | 4 | Smallest of the three social venues; can't be measured beyond this. |

Search sent ~0 (Kagi 14, Google 8, DuckDuckGo 2) — expected for week-old posts.

A tagged link looks like:

```
https://mikezornek.com/posts/2026/6/fresh-eyes-on-a-cucumbered-team/?utm_source=mastodon&utm_campaign=cucumbered-team
```

### On link length in social posts

The tagged URL is long, but it costs almost nothing where it matters:

- **Mastodon and X/Twitter don't count the real length.** Both weigh every link
  as a flat ~23 characters toward the post limit (X wraps in `t.co`, Mastodon
  applies a fixed 23-char count regardless of the URL). So UTMs are effectively
  free against your character budget there. Don't worry about them.
- **Bluesky is the exception: inline link text counts against the 300-char
  limit in full.** A tagged URL can eat a third of the post. So on Bluesky,
  paste the URL to generate a link card, then delete the raw URL from the text
  before posting — the card keeps the UTMs and costs zero characters. Only fall
  back to an inline URL if no card generates, and trim the copy to fit.
- **Where the raw URL shows (LinkedIn body, forum posts), it's usually replaced
  by a link-preview card**, or readers click it regardless of length. Put the
  URL on its own line at the end so its length doesn't break up the copy.
- **Avoid third-party link shorteners.** They hide the UTMs, add a redirect hop,
  and some strip the referrer, which defeats the attribution you tagged for. The
  long-but-honest URL is the better trade. If you ever must shorten, use one that
  preserves query params.

## Hashtags

Hashtags are the discovery mechanism that carries a post past my own
followers. They matter most on **Mastodon**, where tags are a primary way
people find posts (there's no algorithmic feed doing it for them). They help a
little on **LinkedIn**. Skip them on **Reddit and the forums** — hashtags read
as spam there; use the venue's own flair/category instead.

The prominent one for anything Elixir-focused:

- **`#ElixirLang`** — the load-bearing tag, and by some distance. Use it on
  every Elixir post. The bare word "elixir" is also potions, cough syrup, and
  drink brands, so the community disambiguated on `#ElixirLang` (mirrors
  `#golang`, `#swiftlang`). This is the one Elixir folks actually follow.

  Measured 2026-07-27, trailing 30 days: **Bluesky 166 posts / 36 accounts**
  (used daily) vs. `#MyElixirStatus` at 17 / 10. On Mastodon it's ~4–5:1 across
  mastodon.social, fosstodon, hachyderm, indieweb, and techhub. Over the longer
  run `#ElixirLang` runs ~5.8 posts/day against `#MyElixirStatus`'s ~0.8.

Add alongside it, when they fit the post:

- **`#MyElixirStatus`** — *optional, and fading.* A community convention left
  over from the Twitter days. **It does not feed elixirstatus.com** — I checked
  on 2026-07-27, and that site is manual-submission-only ("Sign in and post");
  it pushes *out* to Twitter rather than harvesting a hashtag in. The
  elixirstatus traffic I get comes from submitting the link myself, which is
  already its own line in the venue list above. So the tag buys only whatever
  tag-browsing it still attracts, which isn't much — it went three days
  untouched on Bluesky in the week I measured. Free to include on Mastodon;
  **first thing to cut on Bluesky** when the 300-char budget is tight. Dropping
  it cost the Shim post nothing.
- **`#Elixir`** — plain and high-volume but noisy (catches the non-programming
  senses). Fine to include as a second Elixir tag; don't rely on it alone.
- **`#PhoenixFramework`** — for Phoenix / LiveView-specific posts.
- **`#Erlang`, `#BEAM`** — for posts that genuinely touch the BEAM or Erlang,
  not by default.

For the non-Elixir corners of what I write:

- Apple / iOS posts (`ios`, `apple` tags): **`#iOSDev`**, **`#SwiftLang`**.
- Software-craft / practices / AI posts: **`#SoftwareDevelopment`** or
  **`#Programming`**, plus **`#AI`** / **`#LLM`** when AI is the subject (both
  noisy — one is plenty).

A couple of mechanics:

- **CamelCase every multi-word tag** (`#ElixirLang`, not `#elixirlang`).
  Hashtag matching is **case-insensitive** on Mastodon and Bluesky, so this
  costs no discoverability and doesn't split the tag — but screen readers
  announce `#ElixirLang` as two words and `#elixirlang` as one mush. Pure
  upside.
- **Two or three tags is the sweet spot.** A wall of hashtags reads as spam and
  dilutes the ones that matter. Lead with `#ElixirLang`.
- Put tags on their own line at the end of the post, after the link.

So a typical Elixir share carries `#ElixirLang #MyElixirStatus` on Mastodon and
often just `#ElixirLang` on Bluesky, and I reach for the others only when the
post's subject actually calls for them.

## Share Template

**A — announcement-first** (the long-standing default):

> ✏️ New blog: "Fresh Eyes on a Cucumbered Team"
>
> There's a term for what happens when you've been on a team so long you stop noticing its quirks: you've been cucumbered. Here's what fresh eyes can (and can't responsibly) do about it.
>
> https://mikezornek.com/posts/2026/6/fresh-eyes-on-a-cucumbered-team/?utm_source=mastodon&utm_campaign=cucumbered-team
>
> #ElixirLang #MyElixirStatus

**B — hook-first** (lead with the pain; no title, no "New blog:"):

> There's a term for what happens when you've been on a team so long you stop noticing its quirks: you've been cucumbered.
>
> What fresh eyes can — and can't responsibly — do about it.
>
> https://mikezornek.com/posts/2026/6/fresh-eyes-on-a-cucumbered-team/?utm_source=bluesky&utm_campaign=cucumbered-team
>
> #ElixirLang

(Swap `utm_source` per venue; keep `utm_campaign` the same across all shares of
one post. Adjust the hashtags to the post's subject — see Hashtags above; drop
them entirely on Reddit and the forums.)

### Which template — an open test, not a settled rule

On 2026-07-22 the *Guarding Against AI Drift* share went out in both forms by
accident: **hook-first on Bluesky (14 likes, 3 reposts → 38 visitors)** and
**announcement-first on Mastodon (0 favourites, 1 boost → 8 visitors)**. Same
body copy, same tags on the Mastodon side. A 5:1 gap.

That's suggestive, not conclusive — **platform and framing are confounded** in
a single observation, and Bluesky may simply be the better venue for me
regardless of wording. The test is to run **hook-first on both** for the next
few posts and see whether the gap narrows. Until then, B is the one to reach
for; leading with `New blog: "<title>"` spends the first line on a label
instead of the pain, which is the opposite of what an ebomb should do.
