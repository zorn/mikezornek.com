# Let every crawler in, including AI training crawlers

`robots.txt` allows all user agents everywhere. We do not block AI answer
engines (`OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`) and we do not
block AI training crawlers (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`,
`Applebot-Extended`) either.

**Why:** the point of this blog is for people in the Elixir community to know
who Mike is. A model that has read these posts and can answer "who writes about
Elixir consulting near Philadelphia" is distributing exactly the thing the blog
exists to distribute. Blocking training crawlers would trade that away to
protect writing that is already published for free, in public, with an RSS feed
that serves full post bodies to anyone who asks.

Two facts that shaped the call:

- **Blocking training does not keep you out of AI answers.** Google's AI
  Overviews are built from the ordinary Googlebot index; `Google-Extended` only
  opts out of Gemini model training. So "let the answer engines cite me, keep
  the trainers out" buys much less protection than it sounds like it does, and
  it costs presence in the models people ask career questions of.
- **The old objection was cost, not principle.** Issue #100 ("add thing to
  reduce ai browsing") was about staying under a Render bandwidth cap, and it
  was resolved by enabling billing, not by taking a position on crawlers.

**Considered and rejected:**

- _Answers yes, training no_ — the common writer's position, and a coherent one.
  It is an objection to uncompensated commercial use of scarce or paid work.
  That is not what this blog is.
- _Block the bad citizens_ (`Bytespider`, `Amazonbot`, `Diffbot`) on bandwidth
  grounds — the arithmetic does not justify it. Hobby includes 5 GB/month and
  overage is $0.15/GB, so an aggressive crawler on a site this size costs
  dollars, not tens of dollars. And a crawler badly behaved enough to matter is
  a crawler that ignores `robots.txt`.
- _Explicit per-bot `Allow:` blocks_ — `User-agent: *` already covers them, so
  they add nothing but a list that rots as bots are renamed.

**What would change our minds:** a Render bill where crawler traffic is a
visible line item, or evidence that a specific crawler is republishing posts
in full rather than citing them.

**Consequence:** `robots.txt` stays short. New crawlers need no action — they
are allowed by default, which is the intended posture. If we ever do want to
block one, this file should be updated in the same commit as the `Disallow`.
