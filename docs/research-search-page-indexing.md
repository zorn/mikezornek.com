# Research: should `/search/` be `noindex`?

Primary-source research input for [issue #175](https://github.com/zorn/mikezornek.com/issues/175).
This file is **evidence, not a decision.** The decision (if one is made) belongs in `docs/adr/`.

**Sources accessed 2026-07-31.** Everything below is either quoted from a first-party
source (Google Search Central, Google Search Console Help, sitemaps.org, Hugo docs,
Hugo source, Bing) or explicitly flagged as weak, dated, or absent. No SEO blogs are
cited as authority.

---

## What this settles

1. **Google has no current documented policy against indexing a site's own internal search
   page.** The rule people remember ("use robots.txt to block search results pages") comes
   from a **March 10, 2007** Matt Cutts blog post and a line that was added to the old
   Webmaster Guidelines back then. That guidelines page (`support.google.com/webmasters/answer/35769`)
   now returns **404**, and the line does not appear anywhere in today's Search Essentials
   or spam policies. Treat it as folklore with a real but dated first-party origin.
2. **The one live, on-point Google doc is about soft 404s, not spam.** Google lists
   "an empty internal search result page" as an example of a soft 404. `/search/` with no
   query currently renders exactly that ("Please enter a word or phrase above."). This is the
   strongest documented argument for keeping `/search/` out of the index — and it argues just
   as well for taking it out of the sitemap.
3. **"Submitted URL marked 'noindex'" is not a thing in Search Console anymore.** The current
   Page Indexing report has no "Errors" section and no status by that name. It says
   "URL marked 'noindex'" under _Not indexed_, and states outright that non-indexed URLs can
   be fine. So a noindexed URL sitting in the sitemap is **not** a documented error. It is
   still contrary to Google's own sitemap guidance ("Include the URLs in your sitemap that
   you want to see in Google's search results"), which is a tidiness argument, not an error.
4. **`noindex,nofollow` is documented to stop link following; plain `noindex` is not.**
   The "long-lived noindex eventually behaves like nofollow" claim is **not documented
   anywhere first-party** — it traces to a John Mueller hangout remark, not to Google docs.
5. **Hugo mechanism is settled and exact for v0.161.1:** front matter `sitemap: {disable: true}`
   exists, was introduced in **Hugo v0.125.0 (released 2024-04-16)**, and drops the page from
   `sitemap.xml` while still rendering it and keeping it in all page collections. Verified
   against Hugo's source at tag `v0.161.1` and by an empirical local build. This repo uses
   Hugo's embedded sitemap template (no override), so the mechanism applies as documented.
6. **`?q=` is real.** `search.js` reads a `q` query parameter and auto-runs the search, so
   `/search/?q=anything` is a linkable, crawlable, indexable URL that renders results. Any
   decision should cover the parameterized form, not just the bare `/search/`.

---

## Local check: does `/search/` read a query from the URL?

**Yes.** File: `/Users/zorn/ProjectRepos/mikezornek/themes/reborn/assets/js/search.js`

- Param name: **`q`**
- Read at line 32: `var searchQuery = param("q");`
- `param()` (lines 227–229) does a naive `location.search` split:
  ```js
  function param(name) {
    return decodeURIComponent(
      (location.search.split(name + "=")[1] || "").split("&")[0],
    ).replace(/\+/g, " ");
  }
  ```
- Lines 31–39: if `q` is present, the input is prefilled and `executeSearch(searchQuery, false)`
  runs immediately on load. If `q` is absent, `#search-results` is set to
  `<p class="search-results-empty">Please enter a word or phrase above.</p>`.

Consequences for this decision:

- `https://mikezornek.com/search/?q=elixir` is a fully functional, shareable, crawlable URL.
  Nothing in the site links to one today (checked: `search-form.html` uses a GET form, so a
  submitted search _does_ produce `?q=` in the address bar and can be copied/shared/linked
  from off-site). The URL space is effectively unbounded.
- The bare `/search/` — the URL that _is_ in `sitemap.xml` — renders **no results at all**,
  matching Google's own soft-404 example (see Q1 below).
- Results are rendered client-side from `/index.json` after loading Fuse.js and Mark.js from
  `cdnjs.cloudflare.com` (see `themes/reborn/layouts/_default/search.html`). Rendering is
  required before any result link exists in the DOM.
- Lines 109–111 build outbound links to `duckduckgo.com` and `google.com` scoped searches,
  but only after a query runs, so a crawler hitting bare `/search/` never sees them.

---

## Q1 — What does Google actually document today about indexing internal site-search result pages?

### Current documentation: essentially nothing prohibitive

- **Spam policies** — no mention of internal search result pages. Checked in full; the closest
  concept is "Doorway abuse," described as "Generating pages to funnel visitors into the actual
  usable or relevant portion of a site," which does not describe a site search page.
  https://developers.google.com/search/docs/essentials/spam-policies
- **Search Essentials** (top-level: Technical requirements / Spam policies / Key best practices) —
  no mention of search results pages or auto-generated pages.
  https://developers.google.com/search/docs/essentials
- **Faceted navigation guide** — recommends `robots.txt` for _faceted_ URLs
  ("Use robots.txt to disallow crawling of faceted navigation URLs. Oftentimes there's no good
  reason to allow crawling of filtered items…") but says **nothing** about internal site search.
  https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation

### The one live, on-point doc: soft 404s

Google's crawling-errors documentation lists, as an example of a soft 404:

> "An empty internal search result page"

https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors

Related definition, same doc family: a soft 404 is "a URL that returns a page telling the user
that the page does not exist and also a `200 (success)` status code," and such pages "are
excluded from Search."

**This is the only current first-party Google statement that actually bears on this site's
`/search/` page**, and it fits precisely: bare `/search/` returns 200 with no results and the
text "Please enter a word or phrase above."

Note what it does _not_ say: it does not distinguish a parameterized results URL from a
results-rendering page, and it does not say to noindex anything. It says Google may classify
the empty variant as a soft 404 and drop it.

### Crawl budget guide — explicitly not applicable to this site

> "This guide describes how to optimize Google's crawling of very large and frequently updated
> sites. If your site doesn't have a large number of pages that change rapidly, or if your pages
> seem to be crawled the same day that they are published, you don't need to read this guide."

Who it's for: "Large sites (1 million+ unique pages)…", "Medium or larger sites (10,000+ unique
pages) with very rapidly changing content (daily)…". mikezornek.com is ~497 URLs. **The crawl
budget argument does not apply here by Google's own scoping.**

That said, its advice is worth recording because it cuts _against_ using `noindex` for
crawl-efficiency reasons:

> "Don't use `noindex`, as Google will still request, but then drop the page when it sees a
> `noindex` meta tag or header in the HTTP response, wasting crawling time."

https://developers.google.com/crawling/docs/crawl-budget
(canonical URL; `…/search/docs/crawling-indexing/large-site-managing-crawl-budget` redirects there).
Last updated 2026-07-22 UTC.

### The legacy origin, dated

The "don't let your search results get indexed" guidance is real but **dated 2007** and comes
from a Google employee's **personal blog**, not documentation:

- Matt Cutts, "Search results in search results," **published March 10, 2007**, quoting
  Vanessa Fox (then of Google):

  > "Typically, web search results don't add value to users, and since our core goal is to
  > provide the best search results possible, we generally exclude search results from our web
  > search index."

  and the guideline line that was added to the Webmaster Guidelines as a result:

  > "Use robots.txt to prevent crawling of search results pages or other auto-generated pages
  > that don't add much value for users coming from search engines."

  https://www.mattcutts.com/blog/search-results-in-search-results/

- **That guideline line is gone.** The old Webmaster Guidelines page
  `https://support.google.com/webmasters/answer/35769` returns **HTTP 404** (verified
  2026-07-31). The guidelines were replaced by Search Essentials in October 2022
  (https://developers.google.com/search/blog/2022/10/search-essentials), and the current
  Search Essentials and spam policies contain no equivalent line.

- I could **not** find any "Search results in search results" post on
  `developers.google.com/search/blog` — `…/blog/2007/09/search-results-in-search-results`
  returns 404 and no such post surfaces in a site-scoped search. If a Google-hosted version
  ever existed, it did not survive the migration to Search Central.

**Weak-evidence flag:** anyone citing "Google says don't index search results" today is citing
a 19-year-old blog post from an employee's personal site plus a guidelines line that Google has
since deleted. That is not the same as current documented policy. It is also not evidence that
Google _reversed_ the position — Google simply stopped saying anything.

---

## Q2 — A `noindex` URL listed in an XML sitemap

### Is it an ERROR in Search Console? No — not as documented today.

The current **Page Indexing report** help doc:

- Has **no section literally titled "Errors."** Statuses are grouped as _Indexed_,
  _Not indexed_, and warnings ("Improve page appearance").
- Has **no status named "Submitted URL marked 'noindex'."** That name is legacy Index Coverage
  report vocabulary and does not appear in the current doc.
- The status that does exist is **"URL marked 'noindex'"**, listed under _Not indexed_:
  > "When Google tried to index the page it encountered a 'noindex' directive and therefore did
  > not index it."
- And explicitly:
  > "It's fine for a URL not to be indexed for the right reasons—for example, an expected
  > robots.txt rule on your site, a noindex tag on the page, a duplicate URL, or a 404 for a
  > page that you've removed and have no replacement for."
  > "Non-indexed URLs can be fine. Read and understand the specific reason for each non-indexed
  > URL to confirm that the page shouldn't be indexed."

https://support.google.com/webmasters/answer/7440203

The report does offer a **sitemap filter** ("All known pages," "All submitted pages,"
"Unsubmitted pages only," specific sitemaps), so a noindexed sitemap URL _is_ attributable to
the sitemap — but it is surfaced as a reason, not an error.

**Sitemaps report** help doc: lists parsing errors ("URLs not accessible," "URL not allowed,"
"Invalid URL") and **contains no error or warning about submitting noindex URLs.**
https://support.google.com/webmasters/answer/7451001

**Verdict:** the widely repeated "Search Console will throw an error if you sitemap a noindex
URL" is out of date. It was true of the older Index Coverage report's _Error_ bucket; the
current documentation neither uses that name nor classifies it as an error. **Evidence
flagged as: previously true, no longer documented.**

### What Google says a sitemap should contain

> "Include the URLs in your sitemap that you want to see in Google's search results. Google
> generally shows the canonical URLs in its search results, which you can influence with sitemaps."

> "Google ignores `<priority>` and `<changefreq>` values."

https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
(Last updated 2026-07-08 UTC.)

Directly relevant: `content/search/_index.md` sets `sitemap: {priority: 0.1}`. **That value is
documented as ignored by Google.** It buys nothing today.

### sitemaps.org

> "The Sitemap protocol enables you to provide details about your pages to search engines."

> `<priority>` — "The priority of this URL relative to other URLs on your site. Valid values
> range from 0.0 to 1.0."

> `<changefreq>` — "How frequently the page is likely to change. This value provides general
> information to search engines and may not correlate exactly to how often they crawl the page."
> … "Please note that the value of this tag is considered a _hint_ and not a command."

https://www.sitemaps.org/protocol.html

sitemaps.org imposes no rule about noindex URLs. The only constraint quoted is host scoping:
"All URLs in a Sitemap must be from a single host."

**Net:** listing a noindexed URL is not an error under either spec. It is simply
self-contradictory — the sitemap says "I want this in search results," the meta tag says the
opposite. If `/search/` gets `noindex`, removing it from the sitemap is the consistent move,
and the priority 0.1 line can go with it since Google ignores it anyway.

---

## Q3 — `noindex` vs `noindex,nofollow`

Google's robots meta tag spec, verbatim (https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag,
last updated 2026-03-24 UTC):

> **`noindex`** — "Do not show this page, media, or resource in search results. If you don't
> specify this rule, the page, media, or resource may be indexed and shown in search results."

> **`nofollow`** — "Do not follow the links on this page. If you don't specify this rule, Google
> may use the links on the page to discover those linked pages."

> **`none`** — "Equivalent to `noindex, nofollow`."

Also:

> "Keep in mind that these settings can be read and followed only if crawlers are allowed to
> access the pages that include these settings."

> "robots `meta` tags and `X-Robots-Tag` HTTP headers are discovered when a URL is crawled. If a
> page is disallowed from crawling through the robots.txt file, then any information about
> indexing or serving rules will not be found and will therefore be ignored."

And from the noindex how-to (https://developers.google.com/search/docs/crawling-indexing/block-indexing,
last updated 2025-12-10 UTC):

> "`noindex` is a rule set with either a `<meta>` tag or HTTP response header and is used to
> prevent indexing content by search engines that support the `noindex` rule, such as Google.
> When Googlebot crawls that page and extracts the tag or header, Google will drop that page
> entirely from Google Search results, regardless of whether other sites link to it."

> "Specifying the `noindex` rule in the robots.txt file is not supported by Google."

> "You can also combine the `noindex` rule with other rules that control indexing. For example,
> you can join a `nofollow` hint with a `noindex` rule: `<meta name="robots" content="noindex, nofollow" />`."

### Documented consequence of `nofollow` on the page's own links

Exactly what the spec says: Google will not follow the links on the page, so it will not use
them to discover the linked pages. For `/search/` that means the nav/footer/header links and
any client-rendered result links would not be used as discovery paths. **Practically irrelevant
here** — every post is already in `sitemap.xml` and reachable from `/posts/`, tag pages, and the
home page. But it is a real, documented difference, and it's why `/random/`'s existing
`noindex,nofollow` is more aggressive than it needs to be.

### The "long-lived noindex eventually behaves like nofollow" claim

**Not documented anywhere first-party.** I checked:

- The robots meta tag spec — no statement about noindex pages' links changing behavior over time.
- The block-indexing (`noindex`) doc — same, nothing.

The claim traces to **John Mueller in a Google Webmaster Hangout** (commonly cited as 2017, and
restated in later years including 2019), reported only through third-party write-ups
(seroundtable, WebmasterWorld, various SEO blogs). There is no Google documentation page,
no Search Central blog post, and no help-center article stating it.

**Report it as: a dated verbal statement by a Google employee, not documented policy.**
It should not carry weight in the decision. If the concern it addresses (link discovery) mattered,
it would already be handled by the sitemap.

---

## Q4 — Bing

### What I could retrieve

Bing's Webmaster Guidelines are served from a JavaScript single-page app
(`https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a`). The article body is
**not present in the static HTML** and could not be retrieved as text by either fetch or curl
(HTTP 200, 125 KB, body is app scaffolding and localization strings only). Both attempts
returned only the page title "Bing Webmaster Tools - Help Documentation."

**No first-party Bing statement about internal site search result pages was found.** Searching
Bing's blog and help index surfaced nothing on the topic. Record this as **absent evidence**,
not as "Bing has no opinion."

### What is retrievable, and is genuinely first-party

Bing's own webmaster app strings (extracted from `bing.com/webmasters/help`, 2026-07-31) confirm
Bing honors the tag and how it reports it:

- On `noindex` support:

  > "You have a `<meta name="robots" content="NOINDEX">` on your pages: If your pages contain
  > `<meta name="robots" content="NOINDEX">` in the page's source code we will not add them to
  > the index."
  > (Appears in Bing's "Why is my site not in the index?" and "Not crawling" help text.)

- On removing a URL:

  > "To remove a URL from your site from the Bing index. There are three ways: Method 1: Remove
  > the Page from Your Site and Return a 404. Method 2: Add a NOINDEX meta tag to the page.
  > Method 3: Remove the URL using the Block URLs tool."
  > https://www.bing.com/webmasters/help/how-can-i-remove-a-url-or-page-from-the-bing-index-37c07477

- **On noindex URLs in a submitted sitemap** — Bing Webmaster Tools has a _Sitemap Index Coverage_
  category literally titled **"No-index tag"** / **"URLs with NOINDEX tag"**, described as:

  > "These URLs have 'noindex' tag and are not indexed by Bingbot."

  It is presented as a coverage breakdown category with sample URLs, **not as an error**.
  This is the closest Bing analogue to the Search Console question in Q2, and the answer is
  the same: informational, not an error.

- Bing's dedicated reference page for robots meta support (retrievable URL, body not
  extractable): https://www.bing.com/webmasters/help/robots-meta-tags-and-attributes-that-bing-supports-5198d240

**Weak-evidence flag:** the Bing quotes above are first-party (they come from Bing's own
product), but they are UI help strings, not the Webmaster Guidelines document. I was unable to
read the Guidelines document itself.

---

## Q5 — Hugo mechanism (exact for v0.161.1)

Installed locally: `hugo v0.161.1+extended+withdeploy darwin/arm64`.

### The definitive mechanism: Hugo's embedded sitemap template

At tag `v0.161.1`, `tpl/tplimpl/embedded/templates/sitemap.xml` begins:

```gotemplate
{{ range where .Pages "Sitemap.Disable" "ne" true }}
  {{- if .Permalink -}}
<url>
  <loc>{{ .Permalink }}</loc>...
```

Source: https://github.com/gohugoio/hugo/blob/v0.161.1/tpl/tplimpl/embedded/templates/sitemap.xml

Two filters, and they are the whole story:

1. the page must be in `.Pages` (the page collection), and
2. `Sitemap.Disable` must not be `true`, and
3. `.Permalink` must be non-empty.

**This repo has no `layouts/sitemap.xml` override** (checked: no sitemap template anywhere
outside `public/`), so the embedded template above is what runs. Any of the three levers works.

### `sitemap: {disable: true}` — CONFIRMED, exists, and is the right tool

The config struct at `v0.161.1`, `config/commonConfig.go`:

```go
// SitemapConfig configures the sitemap to be generated.
type SitemapConfig struct {
	// The page change frequency.
	ChangeFreq string
	// The priority of the page.
	Priority float64
	// The sitemap filename.
	Filename string
	// Whether to disable page inclusion.
	Disable bool
}
```

Docs (https://gohugo.io/configuration/sitemap/):

> **`disable`** — "Whether to disable page inclusion. Default is `false`. Set to `true` in front
> matter to exclude the page."

> "These are the default sitemap configuration values. They apply to all pages unless overridden
> in front matter."

Also documented at https://gohugo.io/methods/page/sitemap/ and
https://gohugo.io/content-management/front-matter/.

**Version introduced: Hugo v0.125.0, released 2024-04-16.**

- Commit `6738a3e7` "tpl/tplimpl: Optionally exclude content from sitemap," authored 2024-04-01,
  PR gohugoio/hugo#12329, commit message: "Define global inclusion/exclusion in site
  configuration, and override via front matter. For example, to exclude a page from the sitemap:
  `[sitemap]` / `disable = true # default is false`. Closes #653. Closes #12282."
- Verified by ancestry: the commit is **not** an ancestor of `v0.124.1` and **is** an ancestor of
  `v0.125.0` (GitHub compare API returns `ahead` vs `v0.124.1`, `behind` vs `v0.125.0`).
- Named in the v0.125.0 release notes: "tpl/tplimpl: Optionally exclude content from sitemap [6738a3e]"
  https://github.com/gohugoio/hugo/releases/tag/v0.125.0

v0.161.1 is far past that. **Available.**

### `build: {list: ...}` and `build: {render: ...}` — exact semantics

Verbatim from https://gohugo.io/content-management/build-options/:

> **`list`** — "When to include the page within page collections. Specify one of:
> `always`: Include the page in _all_ page collections. For example, `site.RegularPages`,
> `.Pages`, etc. This is the default value.
> `local`: Include the page in _local_ page collections. For example, `.RegularPages`, `.Pages`, etc.
> `never`: Do not include the page in _any_ page collection."

> **`render`** — "When to render the page. Specify one of:
> `always`: Always render the page to disk. This is the default value.
> `link`: Do not render the page to disk, but assign `Permalink` and `RelPermalink` values.
> `never`: Never render the page to disk, and exclude it from all page collections."

> **`publishResources`** — "Determines whether to publish the associated page resources.
> `true`: Always publish resources. This is the default value.
> `false`: Only publish a resource when invoking its `Permalink`, `RelPermalink`, or `Publish`
> method within a template."

**The Hugo build-options doc never mentions `sitemap.xml`.** The sitemap consequences are
implied by the embedded template, not stated. So I verified them empirically.

### Empirical verification (local, Hugo v0.161.1)

Minimal throwaway site, one page per option, `hugo` build, then read `public/sitemap.xml` and `ls public/`:

| Front matter                              | In `sitemap.xml`? | Rendered to disk? |
| ----------------------------------------- | ----------------- | ----------------- |
| _(none — baseline)_                       | **yes**           | yes               |
| `sitemap: {disable: true}`                | **no**            | **yes**           |
| `sitemap: {disable: true, priority: 0.1}` | **no**            | **yes**           |
| `build: {list: never}`                    | **no**            | **yes**           |
| `build: {render: never}`                  | **no**            | **no**            |
| `build: {render: link}`                   | **yes** ⚠️        | **no** ⚠️         |

Notes that matter for implementation:

- **`sitemap: {disable: true}` is the surgical option.** The page still renders to
  `/search/index.html`, still appears in `site.Pages` / `site.RegularPages` (so it can still be
  linked from nav, still counted, still available to any template), and only the `<url>` entry
  disappears. This is exactly what `/search/` needs.
- **`build: {list: never}` also removes it from the sitemap** (because the sitemap ranges over
  `.Pages`) and still renders the page. This is what `/random/` uses today, and it explains why
  `/random/` is absent from `sitemap.xml`. But it is a bigger hammer: the page vanishes from
  _every_ page collection, which would also drop it from the JSON search index at `/index.json`
  and from anything else iterating `site.Pages`.
- **`build: {render: link}` is a trap.** The page is _not_ written to disk but _is_ still listed
  in `sitemap.xml`, because it retains a `Permalink`. Never use it here.
- **`build: {render: never}` removes it from the sitemap by removing the page entirely** — no
  HTML output at all. Not viable for a page you want people to use.

### Complete list of first-party-documented ways to keep a page out of `sitemap.xml`

1. **`sitemap: {disable: true}` in front matter** (or globally in `hugo.yaml` under `sitemap:`,
   overridden per page). Hugo ≥ v0.125.0. https://gohugo.io/configuration/sitemap/
2. **`build: {list: never}` in front matter** — excludes from all page collections, and the
   embedded sitemap template ranges over a page collection.
   https://gohugo.io/content-management/build-options/
3. **`build: {render: never}` in front matter** — page is never written and is excluded from all
   page collections. Same doc.
4. **Override the sitemap template** at `layouts/sitemap.xml` (or in the theme) and filter
   however you like. https://gohugo.io/templates/sitemap/
5. **`disableKinds: [sitemap]` in site config** — nuclear; disables sitemap generation entirely.
   https://gohugo.io/configuration/all/

Options 1 and 2 are the only two that keep the page live for humans. Option 1 is the one that
does nothing else.

### Note on the existing `sitemap: {priority: 0.1}`

Hugo will happily emit both `disable: true` and `priority: 0.1`; `disable` wins and no `<url>`
is emitted (verified above). But since **Google documents that it ignores `<priority>` entirely**
(Q2), the `priority: 0.1` line in `content/search/_index.md` is dead weight either way.

---

## Q6 — Can a JavaScript-rendered search page be indexed at all?

Yes, and Google documents it clearly
(https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics):

> "Google processes JavaScript web apps in three main phases: 1. Crawling 2. Rendering 3. Indexing"

> "All pages with a `200` HTTP status code are sent to the rendering queue, no matter whether
> JavaScript is present on the page."

> "Once Google's resources allow, a headless Chromium renders the page and executes the
> JavaScript. Googlebot parses the rendered HTML for links again and queues the URLs it finds
> for crawling. Google also uses the rendered HTML to index the page."

So client-side rendering is not itself a bar to indexing — `/search/?q=…` result pages _could_
be indexed on their merits.

One directly relevant caveat, same doc:

> "When Google encounters the `noindex` tag, it may skip rendering and JavaScript execution,
> which means using JavaScript to change or remove the robots `meta` tag from `noindex` may not
> work as expected."

> "If you _do_ want the page indexed, don't use a `noindex` tag in the original page code."

Implication for this decision: if `/search/` gets a server-rendered `noindex`, Google may not
render it at all — so its JS-generated result links are definitely not a discovery path, with or
without `nofollow`. That further reduces the case for adding `nofollow`.

---

## Loose ends / things deliberately not resolved here

- **The `?q=` URL space is not covered by anything decided so far.** A `noindex` on the
  `/search/` template would apply to `/search/?q=…` too (same document), which is probably the
  point. Removing `/search/` from the sitemap does nothing about `?q=` URLs, which were never in
  it. Worth stating explicitly in whatever decision gets written.
- **The Bing Webmaster Guidelines body could not be read.** If this matters to the decision,
  it needs a human with a browser, not another fetch.
- **`/random/` uses `noindex,nofollow` + `build: {list: never}`.** Nothing found in this research
  justifies `nofollow` over plain `noindex`, and `sitemap: {disable: true}` would be a narrower
  tool than `list: never` if `/random/` ever needs to be back in page collections. Out of scope
  for #175, but noted since the two pages will inevitably be compared.
- **No evidence was found that Google penalizes, demotes, or spam-flags a small site for having
  one indexable internal search page.** The absence is real: I looked in the spam policies,
  Search Essentials, the faceted navigation guide, and the crawl budget guide. The only live
  documented risk is the soft-404 classification of the empty variant, and the documented
  consequence of that is simply that Google drops the page from Search — i.e. roughly the same
  outcome as `noindex`, arrived at without any action.
