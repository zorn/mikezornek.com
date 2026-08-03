# Indexing

Which pages are deliberately kept out of search indexes, and why. This is a
different question from crawl policy: `robots.txt` says who may _fetch_ what
(see [ai-crawlers.md](ai-crawlers.md)), and a `noindex` meta tag says what may
be _indexed_. Neither substitutes for the other, and blocking a page in
`robots.txt` actively prevents its `noindex` from ever being read.

The evidence behind everything below, quoted and sourced, is in
[docs/research-search-page-indexing.md](../docs/research-search-page-indexing.md).
Sources were read on 2026-07-31.

---

## `/search/` is `noindex` and out of the sitemap

**Preferred:** `noindex: true` and `sitemap: {disable: true}` in
`content/search/_index.md`.

**Rejected:** leaving it indexable and sitemapped, which is what it was.

**Why:** `/search/` is a utility page. It exists to run a search, not to say
anything, so it has nothing to offer an index. With no query it returns HTTP 200
and the text "Please enter a word or phrase above," which is precisely Google's
own documented example of a soft 404 ("an empty internal search result page"),
and Google says soft 404s "are excluded from Search."

Note what that means: **the page was never going to be indexed either way.** The
choice here is not indexed versus not indexed. It is who decides, and what the
record looks like afterwards. Left alone, Google renders the page, classifies it
a soft 404, and drops it, leaving a soft-404 row in Search Console that is
indistinguishable from a genuinely broken page. With the tag, the same outcome
arrives deterministically and shows up as "URL marked 'noindex'", which reads as
a decision instead of a defect. Google's JavaScript SEO doc adds that it "may
skip rendering and JavaScript execution" on a `noindex` page, so the explicit
version is also the cheaper one to serve.

That is the whole case. It is a tidiness argument, honestly made. Nobody was
being harmed by the old state.

---

## The rule everyone remembers is not current guidance

**Preferred:** argue this from documentation that is live today.

**Rejected:** "Google says don't index internal search results."

**Why:** That sentence is folklore with a real but dated origin. It traces to a
Matt Cutts blog post of **March 10, 2007** and a line added to the old Webmaster
Guidelines at the time. That guidelines page,
`support.google.com/webmasters/answer/35769`, now returns 404, and no equivalent
survives in Search Essentials, the spam policies, the faceted navigation guide,
or the crawl budget guide. All four were checked.

No evidence was found that Google penalizes, demotes, or spam-flags a small site
for one indexable internal search page. The absence is a finding, not a gap in
the research, and it is why the soft-404 argument above carries the decision
rather than a spam argument.

Related things worth not repeating:

- **Google documents that it ignores `<priority>` in sitemaps.** The page used
  to set `sitemap: {priority: 0.1}`, which bought nothing. It is gone.
- **"Submitted URL marked 'noindex'" no longer exists in Search Console.** The
  current Page Indexing report has no Errors section at all and files this under
  _Not indexed_, alongside the note that "it's fine for a URL not to be indexed
  for the right reasons." So a `noindex` URL sitting in a sitemap is untidy, not
  an error. The sitemap removal rests on Google's positive instruction to
  "include the URLs in your sitemap that you want to see in Google's search
  results," and not on avoiding a penalty that isn't there.
- **The crawl budget guide scopes itself out for a site this size** and advises
  against using `noindex` for crawl efficiency anyway. Crawl budget is not a
  reason for anything on a 497-URL site.

---

## Plain `noindex`, never `noindex,nofollow`

**Preferred:** `<meta name="robots" content="noindex">`.

**Rejected:** `noindex,nofollow`, which is what `/random/` used to hardcode
until [#188](https://github.com/zorn/mikezornek.com/issues/188).

**Why:** `nofollow` is documented as "do not follow the links on this page," and
on `/search/` that would include the site's own header and footer navigation.
There is nothing to gain in exchange. The result links are built client-side
after a query runs, and Google may skip rendering `noindex` pages entirely, so
those links were never a crawl path that needed suppressing.

The claim that a long-lived `noindex` eventually behaves like `nofollow` is
**not documented first-party anywhere.** It traces to a John Mueller hangout
remark reported through SEO blogs. It is not a basis for anything here.

---

## The `?q=` URLs are covered, and only by the meta tag

`themes/reborn/assets/js/search.js` reads a `q` parameter and runs the search on
load, so `/search/?q=elixir` is a real, shareable, crawlable URL, and the space
is unbounded. Two things follow.

The meta tag covers all of it, because those URLs are the same document. The
sitemap change covers none of it, because those URLs were never in the sitemap.
Anyone revisiting this should not read "removed from the sitemap" as having done
anything at all about the parameterized space.

Separately, `head.html` emits `<link rel="canonical" href="{{ .Permalink }}">`,
and `.Permalink` on `/search/?q=elixir` is the bare `/search/`. So the parameter
space already consolidated to one URL before any of this, which is a large part
of why the old state was defensible.

---

## `/random/` keeps its standalone head, and copies three tags into it

**Preferred:** `layout: random` stays a standalone document, and hand-copies
`head.html`'s title, description, and `noindex` tags.

**Rejected:** routing it through `baseof.html` so the shared head reaches it.

**Why:** `/random/` is the other utility page, and it expresses the identical
intent through different machinery. Until
[#188](https://github.com/zorn/mikezornek.com/issues/188) that machinery had
drifted: the layout hardcoded `<title>Random Post</title>` and
`noindex,nofollow`, and dropped the `description` the content file authored,
making it the only rendered page on the site without a `meta description`. Bing's
site scan of 2026-08-03 flagged it.

Routing it through `baseof.html` would have fixed all three at once, and is not
possible without moving other pieces first. `content/random.md` sets
`build: {list: never}`, which keeps the page out of `site.Pages` and therefore
out of `og-manifest.json`, so `bin/og-images.mjs` never draws it a card. A page
that emitted `head.html`'s `og:image` would advertise one anyway, and
`bin/verify-og-images.mjs` would fail the build. That is the hazard
`_default/index.ogmanifest.json` already documents, and `/random/` is the page
it was written about.

Even setting that aside, it would be the wrong trade. The page's whole job is to
bounce the visitor to a post; the shared head would have it fetch the CSS
bundle, two preloaded fonts, Plausible, and the theme JS for a document nobody
looks at.

So the standalone head stays, and the three tags that cost nothing to serve are
copied into it. The `noindex` now reads `.Params.noindex` rather than being
hardcoded, which makes the front matter flag this page's mechanism and not just
its declaration. Everything that fetches a subresource stays out.

**The cost, stated plainly:** those tags are a hand-copy, and nothing enforces
that they track `head.html`. A change to the description chain or the title
format has to be made twice. That is the price of the standalone head, and it is
small only because the copied set is deliberately kept to three tags.

Worth knowing if `/random/` is ever revisited: `build: {list: never}` is a much
bigger hammer than the sitemap needs. It removes the page from _every_ page
collection, where `sitemap: {disable: true}` would remove only the sitemap
entry. That difference used to be inert; it is now the thing keeping the page
out of the card manifest, so swapping it is a prerequisite for routing through
`baseof.html`, not an independent tidy-up.

---

## Hugo mechanics, verified against v0.161.1

`sitemap: {disable: true}` in front matter is the surgical tool: the page still
renders to disk and still appears in `site.Pages`, and only its `<url>` entry
disappears. It landed in Hugo **v0.125.0 (2024-04-16)**, confirmed against the
`config.SitemapConfig` struct and the embedded sitemap template at tag
`v0.161.1`. This repo does not override that template, so it applies directly.

The alternatives were tested in a throwaway build rather than assumed:

| Front matter               | In `sitemap.xml`? | Rendered to disk? |
| -------------------------- | ----------------- | ----------------- |
| _(none)_                   | yes               | yes               |
| `sitemap: {disable: true}` | no                | yes               |
| `build: {list: never}`     | no                | yes               |
| `build: {render: never}`   | no                | no                |
| `build: {render: link}`    | **yes**           | **no**            |

`build: {render: link}` is a trap: the page is never written to disk but stays
in the sitemap, because it keeps a `Permalink`. Do not reach for it.

---

## Consequence for the social-card verifier

`bin/verify-og-images.mjs` used to skip any page carrying a `noindex` tag,
using that tag as a proxy for "emits no social tags at all." The proxy held only
while `/random/` was the only `noindex` page on the site. `/search/` renders
through `head.html` and therefore advertises a real card, so the old rule would
have quietly dropped it from coverage the moment this change shipped.

The skip now tests the condition it always meant: a `noindex` page is excused
for having _no_ `og:image`, never for having a broken one. Written up in
[og-images.md](og-images.md).

---

## What this does not decide

Thin tag and series term pages, which is [#174](https://github.com/zorn/mikezornek.com/issues/174).

Issue #175 guessed the two were the same shape of question. They are not, and
the vocabulary is the clearest way to see it. `/search/` is a **utility page**:
it performs an action and has no content of its own. A tag page with two posts
is an **index page with thin content**, which is a different problem argued from
different documents. Nothing about the soft-404 reasoning above transfers to it,
because a term page listing two real posts is not an empty page.

What does transfer is the mechanism. `.Params.noindex` exists now, and
`head.html` can grow an `or` condition if #174 decides some term pages should
carry the tag. Term pages are generated and have no front matter file to write
into, so that work will need a condition in the template regardless.
