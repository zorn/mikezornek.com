# Page Metadata

How the `<head>` builds `meta description`, Open Graph, and Twitter card tags,
and why the pieces are wired the way they are. Lives in
`themes/reborn/layouts/partials/head.html`.

---

## The description chain stops before `.Summary`

**Preferred:** `.Description` → `site.Params.description`

**Rejected:** `.Description` → `.Summary` → `site.Params.description`

**Why:** `.Summary` is Hugo's auto-extract of the opening prose. On the project
pages it repeats the title ("Franklin Franklin was a project written in...")
and runs past 300 characters. Feeding that to `meta description` trades one bad
snippet for another: search engines discount a weak description and synthesize
their own either way, so the fallback buys nothing and risks worse.

Pages with no `description` front matter therefore emit the site description.
That was **251 of 519 rendered pages** when this was written, almost all of
them the pre-2020 post archive plus every page under `content/projects/`. The
fix was to write the description, not to generate one; issue #155 backfilled
all of them. Today the only page still on the fallback is `404.html`, which has
no front matter to write.

That is the state to keep. A new page without a `description` silently rejoins
the fallback, so the archetype's placeholder is a prompt, not a default to
ship.

---

## `og:description` is allowed to differ from `meta description`

**Preferred:** Let the two tags disagree on pages with no authored description.

**Rejected:** Hand-writing the Open Graph and Twitter blocks so a single
expression feeds all three tags.

**Why:** This looks like sloppiness and isn't. `_internal/opengraph.html` and
`_internal/twitter_cards.html` both use their own chain:

```go-html-template
{{ with or .Description .Summary site.Params.description | plainify | htmlUnescape }}
```

That includes the `.Summary` step we just rejected above, and we don't control
it. So on a page with no authored description, `meta description` says
"Personal website of Mike Zornek..." while `og:description` says whatever the
page opens with.

The two tags have different consumers and different failure modes:

- **`meta description` feeds search engines**, which treat it as a hint. A weak
  one gets discarded and replaced with page text. Nothing is lost by falling
  back to the generic site line.
- **`og:description` feeds social cards**, which render it verbatim. A card
  reading "Personal website of Mike Zornek, a developer and teacher from the
  suburbs of Philadelphia" tells a reader nothing about the link. The page's own
  first two sentences, imperfect as they are, tell them something.

Now that every page has an authored `description` (#155), the divergence is
gone, because both chains start at `.Description` and find it. The tolerance
above is what keeps a future page without one from being a bug rather than a
cosmetic mismatch.

The one thing to keep in step is escaping: `head.html` applies
`plainify | htmlUnescape`, matching the embedded templates. Without the
`htmlUnescape`, `plainify` returns `template.HTML` and Go stops escaping, so a
description containing a bare `&` emits it raw.

---

## Use Hugo's embedded templates, don't hand-roll the tags

**Preferred:** `{{ template "_internal/opengraph.html" . }}` alongside the
existing `_internal/twitter_cards.html`.

**Rejected:** A hand-written partial giving one canonical description
expression across all three tags.

**Why:** Hand-rolling buys consistency on the pages that are going to get
authored descriptions anyway (#155), and costs roughly 35 lines we'd own —
including `og:site_name`, `og:type`, `article:section`,
`article:published_time`, `article:modified_time`, and `article:tag`, which the
embedded template already emits correctly and keeps current across Hugo
upgrades.

The embedded template also reads `_funcs/get-page-images`, which resolves the
`images` front matter and auto-detects page resources matching `*feature*`,
`*cover*`, or `*thumbnail*`. Note the site's `thumb.jpeg` convention does
**not** match `*thumbnail*`, so those posts reach `og:image` through their
`images` front matter and not by auto-detection.

**Narrowed by [og-images.md](0007-og-images.md):** this holds for the Open Graph
template and no longer for the Twitter one. Generated cards need
`summary_large_image`, and `_internal/twitter_cards.html` always emits
`twitter:card` as `summary` when a page has no image, with no way to override it
short of emitting the tag twice. So those four tags are now hand-written. The
reasoning above survives intact: it was about the roughly 35 lines of
`article:*` and `og:*` machinery the Open Graph template owns, and the Twitter
template has none of that.

---

## No truncation in the template

**Preferred:** Emit the description as authored.

**Rejected:** `truncate 160`.

**Why:** Truncation is the consumer's job — Google clips the display around
155–160 characters but reads the whole string, and social cards clip on their
own. Doing it in the template hides bad authoring instead of surfacing it, and
`truncate` cuts wherever it lands rather than where a sentence ends. The
archetype already asks for "tweet-length"; descriptions that overshoot should
be rewritten by hand.

#155 did exactly that for the 42 that had overshot. The working target is **160
characters as a hard ceiling**, and roughly 100–140 where the page has that
much worth saying: long enough to be specific, short enough that Google and the
social cards both show the whole sentence. Shorter is fine when the page is
simple; only the ceiling is a rule.

---

## No fallback `og:image`

**Preferred:** Posts without `images` front matter emit no `og:image` and share
as a text-only card.

**Rejected:** Falling back to `images/zorn_square.png` via `site.Params.images`.

**Why:** The only social-usable asset on the site is a 480×480 avatar. Setting
`site.Params.images` would apply it to the **394 of 447 posts** that carry no
image of their own — the same picture on most of the blog — and would also flip
`twitter:card` to `summary_large_image` for all of them, claiming a large image
where there's only a small square. Generating a real per-post image is the
actual fix, tracked in #103 and now decided in [og-images.md](0007-og-images.md).

Worth knowing: a page that _does_ set `images` gets `summary_large_image`
regardless of the file's dimensions, so pointing `images` at a small square
produces exactly the mismatch described above. `elixir-consulting.md` and
`values.md` both point at the 480×480 avatar today.

---

## The home page's title is `Mike Zornek`, not `Home`

**Preferred:** `title: Mike Zornek` in `content/_index.md`.

**Rejected:** Keeping `title: Home` and special-casing `.IsHome` in the
metadata templates.

**Why:** `og:title` and `twitter:title` both read `.Title`, so the front page
was going to share as "Home". The embedded templates can't be told otherwise
without hand-rolling them, but the title itself has no other consumer: the
`<h1>` in `home.html` is hardcoded ("Who is Mike Zornek?"), the nav highlights
off `sectionHighlight`, and `index.json` ranges `.Site.RegularPages`, which
excludes the home page. So renaming it fixes both tags and changes nothing
visible. The `.IsHome` branch in the `<title>` tag is now redundant, and is
left alone as harmless.

---

## `locale` is `en-US`, not `en-us`

The embedded Open Graph template derives `og:locale` from
`site.Language.Locale` by swapping `-` for `_`. Open Graph wants
`language_TERRITORY` with an uppercase territory, so `hugo.yaml` sets
`locale: "en-US"` to emit `en_US`. The same value feeds `<html lang>`, where
both cases are valid BCP 47.
