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
audit of the build found **39 indexable pages with no `<h1>` at all** and
**6 with more than one** (issue #186).

The 39 came from two templates that rendered no heading of their own:

- `_default/list.html` — `/posts/` plus its 23 pagination pages opened straight
  into the post cards.
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

`home.html` still emits `<h1 class="sr-only">Who is Mike Zornek?</h1>`. That one
stays: the home page's visual identity is the hero block, and there is no page
title to render in its place.

---

## Paginated list pages number their h1

**Preferred:** `<h1>Blog (page 2)</h1>` on `/posts/page/2/` and up.

**Rejected:** The same `<h1>Blog</h1>` on all 24 pages.

**Why:** Twenty-four pages sharing one heading tells a reader arriving from
search nothing about where they landed, and gives a crawler 24 identical
top-level signals to reconcile. The page number is the only thing that
distinguishes them, so it belongs in the heading. Page 1 stays unadorned.

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
