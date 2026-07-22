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
- https://elixirstatus.com
- Elixir Forum? https://elixirforum.com/c/learning-resources/blogs-podcasts/60
- Elixir Discord (#share channel)
- Philly Cocoa Slack
- 30x500 Slack (share as an ebomb)

Some venues post as a thread, not just a body: **Elixir Forum**, **Reddit
r/elixir**, **ElixirStatus**, and the **Elixir Discord #share channel** each
need a title. Reuse the blog post's own title verbatim rather than inventing a
new one. The Discord #share channel is a forum channel, so it also takes post
tags (set `Blog posts` and `Elixir`) in place of hashtags.

## UTM tagging

Tag every shared link with UTM params so Plausible can tell me *which venue*
produced a signup. Without them, the Campaigns tab is blind and I'm back to
guessing where to spend promo effort. The workflow: in Plausible, filter by the
`Newsletter Signup` goal, then read the Campaigns tab to see which source
converted.

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
- `elixir-slack`, `philly-cocoa`, `30x500`

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

- **`#elixirlang`** — the load-bearing tag. Use it on every Elixir post. The
  bare word "elixir" is also potions, cough syrup, and drink brands, so the
  community disambiguated on `#elixirlang` (mirrors `#golang`, `#swiftlang`).
  This is the one Elixir folks actually follow.

Add alongside it, when they fit the post:

- **`#myelixirstatus`** — a community convention left over from the Twitter
  days; posts carrying it get picked up by [elixirstatus.com](https://elixirstatus.com).
  Worth including on Elixir posts for the extra distribution.
- **`#elixir`** — plain and high-volume but noisy (catches the non-programming
  senses). Fine to include as a second Elixir tag; don't rely on it alone.
- **`#phoenixframework`** — for Phoenix / LiveView-specific posts.
- **`#erlang`, `#beam`** — for posts that genuinely touch the BEAM or Erlang,
  not by default.

For the non-Elixir corners of what I write:

- Apple / iOS posts (`ios`, `apple` tags): **`#iOSDev`**, **`#swiftlang`**.
- Software-craft / practices / AI posts: **`#softwaredevelopment`** or
  **`#programming`**, plus **`#ai`** / **`#llm`** when AI is the subject (both
  noisy — one is plenty).

A couple of mechanics:

- **CamelCase multi-word tags** (`#iOSDev`, not `#iosdev`). Mastodon and
  screen readers split on the capitals, so the tag stays readable.
- **Two or three tags is the sweet spot.** A wall of hashtags reads as spam and
  dilutes the ones that matter. Lead with `#elixirlang`.
- Put tags on their own line at the end of the post, after the link.

So a typical Elixir share carries `#elixirlang #myelixirstatus`, and I reach
for the others only when the post's subject actually calls for them.

## Share Template

✏️ New blog: "Fresh Eyes on a Cucumbered Team"

There's a term for what happens when you've been on a team so long you stop noticing its quirks: you've been cucumbered. Here's what fresh eyes can (and can't responsibly) do about it.

https://mikezornek.com/posts/2026/6/fresh-eyes-on-a-cucumbered-team/?utm_source=mastodon&utm_campaign=cucumbered-team

#elixirlang #myelixirstatus

(Swap `utm_source` per venue; keep `utm_campaign` the same across all shares of
one post. Adjust the hashtags to the post's subject — see Hashtags above; drop
them entirely on Reddit and the forums.)
