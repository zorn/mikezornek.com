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

Pages with no `description` front matter therefore emit the site description,
exactly as they did before. The fix for those is to write the description, not
to generate one. See the open issue for authoring the missing ones.

---

## `og:description` is allowed to differ from `meta description`

This looks like sloppiness and isn't. `_internal/opengraph.html` and
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

Once every page has an authored `description`, the divergence disappears on its
own, because both chains start at `.Description`.

---

## Use Hugo's embedded templates, don't hand-roll the tags

**Preferred:** `{{ template "_internal/opengraph.html" . }}` alongside the
existing `_internal/twitter_cards.html`.

**Rejected:** A hand-written partial giving one canonical description
expression across all three tags.

**Why:** Hand-rolling buys consistency on ~34 pages that are going to get
authored descriptions anyway, and costs roughly 35 lines we'd own forever —
including `og:site_name`, `og:type`, `article:section`,
`article:published_time`, `article:modified_time`, and `article:tag`, which the
embedded template already emits correctly and keeps current across Hugo
upgrades.

The embedded template also reads `_funcs/get-page-images`, which resolves the
`images` front matter and auto-detects page resources matching `*feature*`,
`*cover*`, or `*thumbnail*`. Note the archetype's `thumb.jpeg` convention does
**not** match `*thumbnail*`.

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

---

## No fallback `og:image`

**Preferred:** Posts without `images` front matter emit no `og:image` and share
as a text-only card.

**Rejected:** Falling back to `images/zorn_square.png` via `site.Params.images`.

**Why:** The only social-usable asset on the site is a 480×480 avatar. Setting
`site.Params.images` would apply it to the 179 posts that carry no image of
their own — the same picture on most of the blog — and would also flip
`twitter:card` to `summary_large_image` for all of them, claiming a large image
where there's only a small square. Generating a real per-post image is the
actual fix and is tracked separately.

---

## `locale` is `en-US`, not `en-us`

The embedded Open Graph template derives `og:locale` from
`site.Language.Locale` by swapping `-` for `_`. Open Graph wants
`language_TERRITORY` with an uppercase territory, so `hugo.yaml` sets
`locale: "en-US"` to emit `en_US`. The same value feeds `<html lang>`, where
both cases are valid BCP 47.
