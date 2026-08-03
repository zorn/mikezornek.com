# Headings

Every indexable page renders exactly one `<h1>`, and the layout is what renders
it. Markdown in `content/` starts at `##`.

---

## The layout owns the h1, not the content

**Preferred:** Each layout emits `<h1>{{ .Title }}</h1>`. Markdown bodies open
at `##`.

**Rejected:** Letting each markdown file write its own `#` heading.

**Why:** Content-owned h1s are opt-in, and the opt-in did not happen. A Bing
Webmaster Tools scan in August 2026 flagged missing and duplicated h1s; a full
audit of the build found **38 indexable pages with no `<h1>` at all** and
**6 with more than one** (issue #186; the issue says 39, counted before the
alias stub at `/posts/page/1/` was excluded).

The 38 came from two templates that rendered no heading of their own:

- `_default/list.html` — `/posts/` plus its 22 pagination pages (`page/2`
  through `page/23`; `page/1` is an alias redirect) opened straight into the
  post cards.
- `_default/onepage.html` — rendered only `.Content`, so `/follow/`, `/now/`,
  `/talks/`, `/values/`, and eleven `/projects/*` pages had nothing above the
  body text.

Worse than the gap was the inconsistency it produced. Three different answers to
the same question were live at once: `contact.md` reached for a
`{{< sr-only-title >}}` shortcode, `elixir-consulting.md` got an incidental h1
from the styling inside `{{< consulting-quote >}}`, five project pages wrote a
`#` in markdown, and the rest wrote nothing. `dex.md` opened with `## Dex`,
duplicating its own front-matter title one level too deep with no h1 above it.

`_default/single.html` and `_default/taxonomy.html` already worked this way, so
this is the existing pattern finishing its spread rather than a new one.

The cost is real and was accepted: the fix visibly changed 15 pages that used to
open with body text, and it required sweeping every markdown file that had been
supplying its own heading. That sweep is a one-time price. The alternative,
asking every future page to remember an `#` line, is a recurring one.

---

## The `sr-only-title` shortcode is gone

**Preferred:** Delete it. `onepage.html` renders a visible h1 for every page.

**Rejected:** Keep it around for pages that want the heading hidden.

**Why:** It existed to give `/contact/` an h1 that screen readers announce but
sighted readers do not see. Once the layout renders the heading unconditionally,
the shortcode's only remaining job is suppressing a heading the page should
have, and a second way to declare an h1 is exactly the ambiguity this decision
removes. `/contact/` now shows "Contact" like every other page.

Two layouts still declare a visually hidden h1 directly, and both are
deliberate:

- `home.html` — `<h1 class="sr-only">Who is Mike Zornek?</h1>`. The home page's
  visual identity is the hero block, and there is no page title to draw in its
  place.
- `search.html` — `<h1 class="sr-only">{{ .Title }}</h1>`. The search form is
  the whole page; a drawn "Search" heading above a box that says "Search blog
  posts..." is redundant to a sighted reader but the page still needs a
  top-level landmark to announce.

`/search/` is `noindex`, so it sits outside the "every indexable page" scope
above. It gets a heading anyway, because the reason for the rule is screen
reader navigation as much as search engines, and `noindex` does not make a page
unreachable. The one page with no `<h1>` on the whole site is `/random/`, which
is not a page: it is a bare redirect shim whose body exists only as a fallback
link if its script does not run.

---

## Paginated list pages repeat the same h1

**Preferred:** The same `<h1>Blog</h1>` on all 23 list pages.

**Rejected:** `<h1>Blog (page 2)</h1>` on `/posts/page/2/` and up.

**Why:** Numbering them looks like an improvement and buys nothing here. The
two arguments for it both fail against how this site is actually built:

- **Crawler disambiguation.** Every `/posts/page/N/` already emits
  `<link rel="canonical" href="https://mikezornek.com/posts/">` and none of
  them appear in `sitemap.xml`. A crawler is never asked to reconcile 23
  competing top-level signals, because they all collapse to `/posts/`. For the
  same reason nobody arrives on page 7 from a search result.
- **Reader orientation.** `partials/pagination.html` already renders
  "7 of 23" directly above and below the cards, on every paginated page.

What numbering does cost is a mismatch. The page number would land in the `h1`
only: `<title>` and `og:title` come from `head.html`, which has no paginator
awareness, so page 7 would read "Blog (page 7)" in the body and "Blog" in the
browser tab and share card. An `h1`/`title` disagreement is itself something
Bing Webmaster Tools reports, which would be a poor trade for work prompted by
a Bing scan. Numbering the heading is only worth revisiting alongside a
`head.html` that numbers the title with it.

---

## Cards on a list page are h2

**Preferred:** `list.html` and `taxonomy.html` pass `headingLevel "h2"` to
`post-card.html`.

**Rejected:** The partial's `h3` default.

**Why:** The cards sit directly under the page h1, so `h3` skips a level. The
partial defaults to `h3` for callers that nest it under a section heading; a
list page is not one of those. `taxonomy.html` already passed `h2` for this
reason.

---

## Known gap: skipped levels inside old posts

Seven posts in the pre-2023 archive jump levels inside the body (`h1` → `h3`,
`h2` → `h4`). Those are markdown authoring artifacts, not a template problem,
and they do not affect the h1 count. Untouched for now.

`/search/` skips a level too, once results render: its `h1` is followed by the
`h3` each result uses. Left alone deliberately. The result headings take their
size from the prose defaults rather than a utility class, so promoting them to
`h2` would visibly enlarge every result, and that is a design change on a
`noindex` page rather than the heading fix this work was scoped to.
