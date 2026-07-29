# Open Graph Card Generation

How the site produces the 1200x630 image that Mastodon, Bluesky, LinkedIn,
Reddit, Slack, Discord, and the Elixir Forum render when a link is shared, and
why the pieces are wired the way they are. Companion to
[page-metadata.md](page-metadata.md), which covers the tags themselves.

Background: as of #149 the site emits Open Graph tags but most pages carry no
image, so they share as a text-only card. Issue #103 is the image half.

---

## Every page gets a generated card, plus one static card behind it

**Preferred:** A per-page card rendering that page's own title, and a single
designed static card used as the safety net.

**Rejected:** Only a designed static default card shared by every post.

**Why:** A static card ships in an afternoon and costs nothing forever, but it
adds recognition and zero information: every share of every post looks the same,
which is the objection that already killed the avatar fallback in
[page-metadata.md](page-metadata.md). The point of the card is to tell a reader
what the link is before they click.

The static card is not a consolation prize, it earns its place as the fallback
for `404.html` and for any card the generator cannot produce. Both are designed
as one visual family so a fallback does not read as a different site.

---

## Cards are generated on every build and never committed

**Preferred:** A step in `bin/build.sh` that writes cards into `public/` on
every deploy. Nothing lands in git.

**Rejected:** Generating locally and committing roughly 500 PNGs.

**Why:** A card is a pure function of the page's title, description, and the
design, so there is no state to lose by regenerating. Committing means about
15-20MB of binaries in history, a step to remember on every new post, and worst
of all a silent staleness bug: fix a typo in a title and the committed card
still shows the old one, with nothing forcing a regeneration.

The cost is honest. Render meters build minutes (see
[render-static-site-constraints.md](../docs/render-static-site-constraints.md)),
the publish directory does not persist between builds, and every deploy
regenerates everything. The generation step therefore times itself and prints
the duration, so the Render log reports the real number against that budget
rather than us guessing at it.

If that number turns out to be bad, the documented escape hatch is
`$XDG_CACHE_HOME`, which Render persists between builds. Note the research flags
it as undocumented for static sites specifically, so it is a lead, not a plan.

---

## takumi-js does the rendering

**Preferred:** `takumi-js`, a Rust engine that renders HTML and CSS directly to
PNG, driven from a plain `.mjs` script.

**Rejected:** Hugo's own `images.Text` filter, which would add no dependencies
at all.

**Why:** `images.Text` has no layout engine behind it. It takes TrueType only
(the repo ships Ubuntu as WOFF2), and it does not wrap text, so fitting titles
that run to 106 characters means hand-writing a word-accumulating line breaker
in Go templates with no access to font metrics. Line breaks would be guessed
from character counts and would be visibly wrong on some posts.

The work that actually matters here is design iteration, and a layout engine
makes that cheap while a template-based line breaker turns every design change
into a math problem. `@takumi-rs/helpers` exposes `fromHtml()`, so there is no
JSX and no bundler.

**Corrected after prototyping:** this entry first claimed the card could "reuse
the site header's own classes". Half true. `fromHtml()` returns an empty
`stylesheets` array, so `class="bg-purple-600"` renders unstyled unless compiled
CSS is passed through the `stylesheets` render option. Supplying a stylesheet
does work, so Tailwind is reachable, but it would mean wiring a Tailwind build
into the generator. The card uses inline styles instead, with the site's values
(`#9333ea`, `dark-mosaic.png`, Ubuntu) written out directly. Fewer moving parts,
and the generator stays independent of the CSS pipeline.

Two costs worth naming. The package is young (first published March 2026). And
`@takumi-rs/core` is a native N-API addon: Render's build image has `gcc`,
`g++`, and `make` but no Rust toolchain, so if a prebuilt binary ever fails to
resolve there is no compile-from-source fallback and the deploy fails hard. Pin
the version exactly, and check that `@takumi-rs/core-linux-x64-gnu` is actually
present in `package-lock.json`, because npm has repeatedly shipped bugs that
omit other platforms' `optionalDependencies` from a lockfile generated on macOS.

---

## Every rendered page is in scope

**Preferred:** Posts, projects, one-off pages, the home page, section lists, and
taxonomy term pages all get a card. Only `404.html` falls to the static one.

**Rejected:** Posts and a short allow-list of other pages.

**Why:** The marginal cost of one more card is milliseconds and a manifest row.
The marginal cost of a _rule_ about which pages qualify is permanent: a branch
in the template, a paragraph here, and a thing to re-litigate every time a page
type is added. "Every page has a card" is a sentence nobody has to think about
again.

**Corrected after prototyping:** this entry first claimed taxonomy term pages
have no front matter and therefore no description. Wrong. Every term has an
`_index.md` with an authored description (19 of 19 tags, 3 of 3 series), all
backfilled by #155. Their problem is the opposite end, and it is recorded below
under composed titles: their _titles_ are bare terms.

The layout still has to survive a missing description, because the archetype
invites exactly that state on a new post before its description is written. It
does: the title centres in the body and reads as deliberate rather than cut off.

---

## A page that already emits an `og:image` is skipped

**Preferred:** The generator skips any page that already resolves an image
through `_funcs/get-page-images`.

**Rejected:** Skipping pages that set `images` front matter.

**Why:** These are not the same set, and the difference is a real bug. Hugo
prefers page resources matching `*feature*`, `*cover*`, or `*thumbnail*` _before_
consulting `.Params.images`. So
`content/posts/2019/1/professional-ios-projects-code-consistency-with-swiftlint/`
has no `images` front matter at all and still emits an `og:image`, because its
`book-cover.jpg` matches the `*cover*` pattern. Written the rejected way, that
page would get an auto-detected cover and a generated card competing for the
same tag.

The underlying principle is that an authored image wins. Someone deliberately
pointed at `mom.jpg` on the post about their mother's passing. A generator that
overrides authored intent is a generator you end up fighting, and once the front
matter field stops meaning anything there is no per-page escape hatch left.

Two consequences worth recording. First, 53 posts set `images` to files that
resolve fine but are the wrong shape for a social card (sampled: 3088x2316,
2250x2700, 502x362), and setting `images` forces `summary_large_image`
regardless of the file, so those claim a landscape card and get cropped
arbitrarily. That is a content audit, tracked separately, not something to
smuggle in here. Second, `elixir-consulting.md` and `values.md` are the
exception: both point `images` at the 480x480 avatar, which is not an authored
choice so much as a workaround from before generated cards existed. Their
`images` lines come out so they take generated cards instead.

Sequencing mattered on that last one: removing those two lines before the
generator existed would have left both pages with no `og:image` at all, which is
worse than a mismatched square. They came out in the same change that added the
generator.

---

## The card carries title, description, and a brand lockup

**Preferred:** Title dominant, description subordinate beneath it, brand lockup
present.

**Rejected:** Title only. Also rejected: adding the publication date, tags, or a
series label.

This entry decides _what is on the card_. Where it sits and how big it is are
settled separately, under [the card layout](#the-card-layout): the lockup grew
from a small corner mark into a full-width band, because that is what mirrors
the site's own header.

**Why:** The description is on the card because of where the traffic actually
comes from. LinkedIn and Reddit render the image and title but never
`og:description`, and by the first measured week (see
[../playbook/promotion.md](../playbook/promotion.md)) those are the reach engine
(Reddit, 150 visitors) and the only venue that produced a signup (LinkedIn, 41).
On those two, the card is the only surface where the description reaches a
reader at all.

The cost is real and was weighed: Mastodon, Bluesky, Slack, Discord, and
Discourse all show `og:description` as text right below the card, so there the
sentence appears twice. The costs are not symmetric, though. Duplication is
noise, absence is information loss. This is why the description must read as
clearly subordinate (smaller, lower contrast): where it is redundant it should
land as texture, not as competing copy.

The date is left off deliberately. The archive runs back to 2012 and older posts
get reshared, so a date stamp turns every such share into "this is six years
old" before anyone reads a word. Tags and series are navigation, not persuasion,
and would crowd a canvas that already has to survive a 106-character title next
to a 160-character description. A `series` eyebrow was considered and left to
the prototype: it is populated on 158 of 448 posts, so the layout would have to
work both with and without it. `pain` and `fix` were considered and ruled out
outright, being populated on only 14 posts each.

---

## The title auto-fits and is never truncated

**Preferred:** The title steps down a ladder of sizes, using takumi's
`measure()` to pick the largest that fits its box within three lines. The
description sits at a fixed size and clamps to two lines.

Both limits are enforced, and the title's needs saying twice: a size has to fit
within three lines _and_ within an absolute box height. Testing only the box
would let the smallest size through at five lines, since smaller type fits more
lines into the same space. The clamp is CSS `line-clamp`, which takumi supports;
it cuts cleanly at two lines but renders no ellipsis, so the description ends
mid-sentence rather than on an "...". Given descriptions are already summaries
and the house ceiling is 160 characters, that is a fair trade for not
hand-rolling truncation.

**Rejected:** One fixed title size for every card, clamped with an ellipsis.

**Why:** Titles range from about 20 to 106 characters, so one size cannot serve
both ends. The asymmetry between title and description is the point: a truncated
title is a broken promise. "Using Schemaless Changesets to Separate Concerns
Between the Web..." reads as a bug and loses the actual claim. A truncated
description does not, because it is already a summary and readers expect
summaries to trail off.

So the title gets whatever space it needs and pays in point size, while the
description gets fixed type and pays in length. The accepted cost is that cards
are not typographically identical across the archive: short titles render big
and long ones render small.

---

## The Twitter block is hand-rolled, Open Graph stays embedded

**Preferred:** Keep `{{ template "_internal/opengraph.html" . }}`, add an
`og:image` only when the page has none, and hand-write the four `twitter:*`
tags.

**Rejected:** Leaving `_internal/twitter_cards.html` in place. Also rejected:
dropping the Twitter tags entirely.

**Why:** The two embedded templates behave differently on a page with no image.
`_internal/opengraph.html` emits nothing for `og:image`, so ours can be added
with no duplication. `_internal/twitter_cards.html` always emits a
`twitter:card`, and it says `summary`. There is no way to override it without
emitting the tag twice.

Leaving `summary` in place next to a 1200x630 image reproduces exactly the
"claiming a large card where there is only a small square" mismatch that
[page-metadata.md](page-metadata.md) rejected, just inverted.

This narrows that file's "use the embedded templates, don't hand-roll" entry
rather than contradicting it. That entry's stated reason was the roughly 35
lines of `og:site_name`, `og:type`, `article:section`,
`article:published_time`, `article:modified_time`, and `article:tag` that
hand-rolling would make us own. Every one of those is an Open Graph tag. The
Twitter template emits four tags, none of them `article:*`, and none of them
likely to change across Hugo upgrades. The reasoning holds, its scope was just
broader than its justification.

Dropping the Twitter tags outright was tempting, since X sent 4 visitors in the
measured week, dead last and an order of magnitude below Bluesky. It was
rejected because `twitter:card` is no longer read only by X: several crawlers
sniff it as a size hint, and removing it means trusting each consumer's
fallback. Owning four lines buys an unambiguous answer.

---

## Card URLs are versioned

**Preferred:** `/og/v1/<page path>.png`, so `/posts/2026/6/fresh-eyes/` becomes
`/og/v1/posts/2026/6/fresh-eyes.png`.

**Rejected:** Co-locating an `og.png` inside each page's directory. Also
rejected: `/og/<page path>.png` with no version segment.

**Why:** Co-location fails on half the archive. 216 of 448 posts are flat `.md`
files with no directory of their own, so it would need two different rules. One
tree has one rule, is trivially inspectable, and can be deleted wholesale.

The version segment exists because LinkedIn caches link previews per exact URL
effectively forever, and the only reliable bust is changing the URL. Nobody
ships an OG card design once. Without the segment, the day the design changes
every previously-shared post keeps serving LinkedIn's cached copy of the old
one, with no lever short of appending `?v=2` to individual shares by hand.
Bumping `v1` to `v2` in one partial re-mints every URL on the site at once.

A single Hugo partial computes this URL, and both `head.html` and the
generation manifest call it, so the emitted tag and the written file cannot
drift.

---

## One card failing falls back, the step failing stops the deploy

**Preferred:** A card that fails to render gets the static card's bytes written
to its path and logs a warning. The step itself failing exits non-zero. More
than five fallbacks in one run also fails the build.

**Rejected:** Failing hard on any single card failure. Also rejected: letting
the step fail soft and deploying anyway.

**Why:** The invariant that matters is that every `og:image` URL the site emits
resolves. A card that is off-brand is cosmetic. A card that 404s is a broken
share, which is the exact condition #103 exists to remove.

So one pathological post must not take the site offline, and this is the static
card doing its literal job as the safety net. But a systematic failure (takumi
not loading, a missing manifest, an unreadable font) means shipping hundreds of
pages whose `og:image` points at nothing, which is worse than not shipping.
`bin/build.sh` already sets `errexit` for precisely this posture, matching the
dev-server-URL guard.

The count threshold exists because a warning in a Render log nobody reads is not
a signal. One weird post is tolerated; a regression that quietly degrades
dozens of cards is not.

---

## PNG, with a size trigger rather than a size rule

**Preferred:** PNG. Measure real sizes during the prototype and treat a median
above 150KB as the trigger to revisit.

**Rejected:** JPEG. Also rejected: WebP.

**Why:** Texture is expensive because it is visual noise, and noise is what PNG
compresses worst. Measured on a full-bleed early draft, isolating each effect:

|                               | file   |
| ----------------------------- | ------ |
| solid purple, no text shadow  | 32 KB  |
| solid purple, text shadow     | 103 KB |
| full-bleed texture, no shadow | 109 KB |
| full-bleed texture and shadow | 262 KB |

Texture and shadow each roughly triple the file and compound when combined. The
banded design that won keeps the texture to a 200px strip rather than the whole
canvas, which is why the shipping cards land at **131 to 152 KB** across the
whole stress set. The count is stable because the avatar dominates the file and
the text barely moves it, so no page is going to surprise us later.

JPEG was rejected on a prediction that turned out to be wrong in a useful
direction. The estimate here was that it would "roughly halve" the size. At q85
the same card measured **328 KB, larger than the 262 KB PNG**, because
high-frequency noise is precisely what JPEG cannot compress: it spends bytes
fighting the texture. So the conclusion survives and the reasoning is replaced.
WebP came in at 173 KB, small and crisp, and is still rejected because consumer
support is spotty and LinkedIn in particular is unreliable with it. Being clever
about format on the venue that produced the only signup is a bad trade.

Bandwidth is not the reason for the trigger: cards only cost bandwidth when
fetched, and crawlers fetch once then cache, so a post shared across all venues
draws single-digit MB against Render's 5GB monthly allowance. Deploy time was
the reason, and at 30ms a card it is not currently a problem either.

---

## The card layout

Settled over four prototype rounds. The layout lives in `bin/og-card.mjs`, which
both the build step (`bin/og-images.mjs`) and the preview harness
(`bin/og-preview.mjs`) import, so what you preview is what ships.

A **200px band** across the top carrying the site's `purple-600` under
`dark-mosaic.png`, then the copy on near-white (`#faf9fb`) below. In the band, a
**120px avatar** inside a white ring at 92% opacity, then the wordmark **"Mike
Zornek" at 72px** with the header's text shadow. In the body, the title at the
auto-fit size in `#1c1420`, and the description at 27px in `#5b5266`.

The band mirrors the site's actual structure (purple header, content beneath),
which is what makes a share feel continuous with the page it lands on. The
wordmark deliberately outweighs the avatar: at feed scale the name is what
carries, and a 72px avatar was measured too small to read as a face at all.

**The white half stays empty.** Three watermark treatments were tried and all
rejected: a mosaic at 94% veil was invisible while still costing 44 KB, the same
at 88% was visible but pushed the card over budget, and an oversized avatar at
10% read as a ghost rather than a mark and squeezed the title onto a third line.
Emptiness turned out to be the better answer, and the cheaper one.

---

## The build verifies its own output

There is no test suite in this repo, so `bin/verify-og-images.mjs` stands in for
one. It runs on every build, after generation, and fails it if any page
advertises a social image that is not on disk, or emits no `og:image` at all.

That is the invariant this whole effort rests on: an off-brand card is cosmetic,
a card that 404s is a broken share. It is also the failure mode nothing else
catches. `images` front matter is a plain string that Hugo runs `absURL` over
without confirming a file exists, so a wrong path builds green and only shows up
on someone else's website. **Three posts had been shipping broken `og:image`
URLs this way**: two with a doubled `posts/` segment, and a third with a wrong
bundle name that a hand search had missed and the verifier found immediately.

Two kinds of page are skipped, both deliberately. **Alias redirect stubs**: Hugo
writes a bare refresh page for each `aliases` entry, around 190 of them for the
pre-2020 URL scheme, with none of the theme's head partial. **Pages marked
`noindex`**: `/random/` has a standalone layout that never loads `head.html` and
bounces the visitor onward, so it emits no social tags and needs no card. A page
telling crawlers not to index it is not a page anyone shares.

---

## Four things that will bite whoever touches this next

All four cost real debugging time, and none is documented upstream.

**Prettier silently breaks these Hugo templates.** `prettier-plugin-go-template`
reflows a comment's closing `*/ -}}` onto two lines, and Go's lexer only accepts
the whitespace-trim marker directly after the `*/`. The reflowed version fails to
parse with "comment ends before closing delimiter", which takes down the entire
site build, not just the one template. Worse, it happens at format time rather
than edit time, so the break appears in a commit that looks like whitespace.
`themes/reborn/layouts/partials/og/` is in `.prettierignore` for this reason,
alongside the two templates already listed there for a related mangling.

**A `data:` URI as a background image renders nothing, silently.** No error, no
warning, just a flat background where the texture should be. Images have to be
passed through the `images` render option keyed by `src`, and the markup then
references that `src`. The first probe reported six passes and one of them was a
no-op whose output was byte-identical to a blank canvas.

**`measure()` needs the fonts handed to it, same as `render()`.** Measure without
them and it silently falls back to a different face, with metrics that are not
close: the archive's longest title measures 260px unfonted against 195px in
Ubuntu, a whole extra line, enough to pick the wrong size off the ladder. What
makes it nasty is that a `Renderer` retains fonts once it has drawn something, so
only the very first card of a run measures wrong. With today's content that first
card is the static one, whose title is short enough to land on the same size
either way, so the defect produced byte-identical output and would have waited
for a wording change to appear.

**takumi does not clip a repeating background to its element's box.** It paints
whole tiles and lets the overflow spill onto whatever sits underneath. On a
full-bleed element this is invisible because the canvas clips it, but the 200px
band leaked texture roughly 180px down into the white body, and it read as an
intentional gradient rather than as a bug. The fix is to size the tile so it
divides the box evenly: the mosaic is natively 300x295 and the card is 1200
wide, so a 300px tile width always gives exactly 4 columns, and only the height
needs choosing per band.

---

## Some titles are composed, and only some

**Preferred:** The generator substitutes a title for **tag term pages** and the
**home page**. Everything else renders `.Title` as authored.

**Rejected:** Composing titles for series terms and section pages too. Also
rejected: reading `.Title` everywhere with no exceptions.

**Why:** The rule follows the failure, not the page type. Tag terms fail because
`capitalizeListTitles: false` means their title is a bare lowercase word, so the
card reads `elixir` and nothing else, which lands as a stray fragment rather
than a destination. `Posts tagged elixir` fixes it.

Series terms do not fail, because their titles are authored and capitalised
(`Journals`, `31 Days 31 Products`, `Exercism Elixir Track`) and read fine
alone. Section pages (`Blog`, `Projects`, `Tags`, `Series`) are bare nouns and
were considered, but they read acceptably and composing them would mean the
generator inventing copy for pages that already have authored titles. Keeping
the exception list to the two pages that genuinely break keeps authored titles
authoritative everywhere else.

The home page is the other exception, for a different reason: its title is
deliberately `Mike Zornek` (see [page-metadata.md](page-metadata.md)), which is
the same words as the wordmark printed directly above it on the card. It
substitutes **"Elixir, Phoenix, and the craft of shipping software"** instead.

That change had a knock-on. The home page's description restated the same
subjects almost word for word, so the card would have said one thing twice, and
it named iOS, which is historic: the `ios` tag runs 2012 to 2020 and stops. So
`content/_index.md` now reads "Blogging since 2012 from a developer and teacher
in the suburbs of Philadelphia, plus Elixir consulting and a pile of side
projects", and `posts/_index.md`, `tags/_index.md`, and `tags/ios/_index.md` were
reworded to date the iOS material rather than present it as current. A post count
was considered for the home description and dropped: front matter is data, not a
template, so any number in it is frozen on write and drifts from the day it
ships. The same constraint is already recorded in `hugo.yaml` for the consulting
price.

---

## Still open

- **The composite variant.** A page's own image inside the 1200x630 frame, title
  alongside or over a scrim. Worth revisiting for `elixir-consulting.md`
  specifically, where a portrait does trust-building work a text card cannot.
- **The 53 mis-shaped authored images.** A content audit, tracked separately.
- **A `series` eyebrow on post cards.** Populated on 158 of 448 posts, so the
  layout has to work both ways. Not attempted yet.
