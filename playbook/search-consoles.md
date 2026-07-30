# Search consoles and index submission

Where this site is registered with search engines, how each registration was
verified, and what to re-check.

This file exists because issue #144 opened with a question nobody could answer:
"Google Search Console — exists, but is the sitemap actually submitted?" That is
not a thing that should require guessing. Neither is the fate of #15 ("add
robots.txt"), which was closed without the file ever landing. **When you do any
of the one-time steps below, update this file in the same sitting.** A checklist
in an issue disappears when the issue closes; this does not.

## What the site publishes for crawlers

| Artifact      | URL                                                           | Notes                                                                                |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Sitemap       | `https://mikezornek.com/sitemap.xml`                          | ~497 URLs, per-page `lastmod`. Hugo generates it.                                    |
| Robots policy | `https://mikezornek.com/robots.txt`                           | Allows everything, advertises the sitemap. See `decisions/ai-crawlers.md`.           |
| RSS           | `https://mikezornek.com/index.xml`                            | Full archive, full post bodies.                                                      |
| IndexNow key  | `https://mikezornek.com/509ce3a92525b2bfc2bdba120987afa2.txt` | Proves domain ownership to IndexNow. Contents must be exactly the key, nothing else. |

**Last verified live: 2026-07-30.** `robots.txt` serves 200 as `text/plain`, its
`Sitemap:` line resolves to a 200 XML document, and it is byte-identical when
fetched under a Googlebot user agent. `/random/` is crawlable and still carries
its `noindex` tag, which is the arrangement that lets the tag be read at all.
The IndexNow key file is not live yet — it ships with this change.

One caching note: Cloudflare fronts these with `s-maxage=300`, so an edit to
`robots.txt` can take up to five minutes to reach crawlers. A stale response
right after a deploy is expected rather than a bug.

## Registrations

Status is what has actually been confirmed, not what was intended.

### Google Search Console

- **Status:** account exists. **Sitemap submission unconfirmed.**
- **To confirm:** Search Console → Indexing → Sitemaps. `sitemap.xml` should be
  listed with a recent "Last read" date and status Success.
- **If missing:** add `sitemap.xml` in that screen. One-time.
- **Also pull while you are in there:** the URL list behind the "Blocked due to
  other 4xx issue" warning (Indexing → Pages → click the reason → Export). That
  report is the only way to diagnose #56 — the problem is not reproducible from
  outside. Verified 2026-07-30: no bot blocking under a Googlebot user agent, no
  rate limiting across a 25-request burst, and missing pages return clean 404s.
  Paste the export into #56.
- **Worth knowing:** Search Console reports are sticky. If the 4xx episode was a
  past incident that has since been fixed, the warning persists until you hit
  Validate Fix. So the export may describe a problem that no longer exists.

### Bing Webmaster Tools

- **Status:** unknown. Assume not set up.
- **Why it matters more than Bing's market share suggests:** Bing's index feeds
  DuckDuckGo and several AI answer engines.
- **To set up:** sign in at <https://www.bing.com/webmasters> and use "Import
  from Google Search Console" — it carries over site verification and sitemaps
  in one step, which is much less work than verifying the domain again.
- **Then:** confirm `sitemap.xml` is listed, and check the IndexNow section for
  submission stats.

### IndexNow

- **Status:** key file ships with the site; script is in the repo. First real
  submission happens the next time a post goes out.
- **How to use:** after a deploy is live, `bin/indexnow.sh <url>`. This is a
  step in `playbook/promotion.md`, not part of the build — see the comment at
  the top of the script for why.
- **Reaches:** Bing, Yandex, Seznam, and Naver share one endpoint. Google does
  not participate.
- **Expect a 202 on first use.** That means accepted, key validation pending. It
  is not an error.

### Kagi

- **Status:** nothing submitted.
- **Why bother:** Kagi was the single largest search referrer in the first
  Signal Log week (14 visitors, more than Google and DuckDuckGo combined).
- **There is no webmaster console.** Kagi is largely a metasearch layer over
  "anonymized API calls to worldwide search engines"
  (<https://help.kagi.com/kagi/search-details/search-sources.html>), so most
  Kagi visibility is downstream of Google and Bing. Fixing those fixes Kagi.
- **But there is one submission path:** Kagi Small Web
  (<https://github.com/kagisearch/smallweb>) accepts personal blog RSS feeds by
  pull request against `smallweb.txt`. This site meets every criterion —
  English, single-author personal blog, posts within 12 months, no ads, no
  popups.
- **The catch:** a self-submission must add **at least two other new sites in
  the same commit.** Pick two personal blogs worth surfacing.

### DuckDuckGo

- **Nothing to do.** No submission tool. Its results come from Bing's index, so
  Bing Webmaster Tools is the lever.

## Outstanding one-time work

- [ ] Confirm `sitemap.xml` is submitted in Google Search Console
- [ ] Export the #56 "Blocked due to other 4xx" URL list and paste it into #56
- [ ] Set up Bing Webmaster Tools via Import from Google Search Console
- [ ] Confirm `sitemap.xml` is listed in Bing Webmaster Tools
- [ ] Open the Kagi Small Web PR (this site plus two others)

## Re-check ritual

Worth ten minutes a couple of times a year, or any time search referrals in the
Signal Log look wrong:

1. `curl -sI https://mikezornek.com/robots.txt` returns 200.
2. `curl -sI https://mikezornek.com/sitemap.xml` returns 200.
3. `curl -s https://mikezornek.com/509ce3a92525b2bfc2bdba120987afa2.txt` prints
   the key and nothing else.
4. Google Search Console: sitemap "Last read" is recent; no new indexing errors.
5. Bing Webmaster Tools: same, plus IndexNow submissions are being accepted.
6. Update the Status lines above with what you found and the date.
