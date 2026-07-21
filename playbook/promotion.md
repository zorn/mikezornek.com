# Promotion

After posting something I am particularly proud of I tend to share it for more exposure.

Some of the places include:

- Personal Mastodon
- Personal Twitter
- Elixir Slack (#blogs room)
- LinkedIn
- LinkedIn Elixir Group
- Reddit r/elixir
- https://elixirstatus.com
- Elixir Forum? https://elixirforum.com/c/learning-resources/blogs-podcasts/60
- Philly Cocoa Slack
- IndyHall self promotion channel.

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

- `mastodon`, `twitter`
- `linkedin`, `linkedin-elixir`
- `reddit`, `elixir-forum`, `elixirstatus`
- `elixir-slack`, `philly-cocoa`, `indyhall`

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
- **Where the raw URL shows (LinkedIn body, forum posts), it's usually replaced
  by a link-preview card**, or readers click it regardless of length. Put the
  URL on its own line at the end so its length doesn't break up the copy.
- **Avoid third-party link shorteners.** They hide the UTMs, add a redirect hop,
  and some strip the referrer, which defeats the attribution you tagged for. The
  long-but-honest URL is the better trade. If you ever must shorten, use one that
  preserves query params.

## Share Template

✏️ New blog: "Fresh Eyes on a Cucumbered Team"

There's a term for what happens when you've been on a team so long you stop noticing its quirks: you've been cucumbered. Here's what fresh eyes can (and can't responsibly) do about it.

https://mikezornek.com/posts/2026/6/fresh-eyes-on-a-cucumbered-team/?utm_source=mastodon&utm_campaign=cucumbered-team

(Swap `utm_source` per venue; keep `utm_campaign` the same across all shares of
one post.)
