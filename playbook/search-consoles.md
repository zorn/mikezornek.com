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
| RSS           | `https://mikezornek.com/index.xml`                            | 50 most recent items, full post bodies. See `decisions/feeds.md`.                    |
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

- **Status:** verified 2026-07-31 under the **zorn@zornlabs.com** Google
  account, as a **Domain property** (`sc-domain:mikezornek.com`), which covers
  http, https, and all subdomains at once.
- **Verification is a DNS TXT record at the apex,** `@` on mikezornek.com in
  Hover. It must be `@`, not `*`. A wildcard TXT never answers for the apex
  itself, so Google reads it as no record at all and verification fails. That
  mistake cost an evening. Hover took about three minutes to publish the record
  before `dig +short TXT mikezornek.com` returned it.
- **Sitemap: submitted, but it was stale.** The answer to the question that
  opened #144 is that a sitemap had been submitted on 2020-08-22, pointing at
  `http://mikezornek.com/sitemap.xml`. That URL now 301s to https. Google last
  read it 2023-01-15 and knew about 430 pages, against 497 in the live sitemap.
  The https URL was submitted 2026-07-31 and the http row removed. Google read
  it the same day: status Success, 497 discovered pages, matching the live file
  exactly. Resubmission is read within minutes, not the day or two the indexing
  reports need.
- **The lesson worth keeping:** "a sitemap is listed" is not the same as "the
  right sitemap is being read." Check the Last read date and the discovered page
  count against `curl -s https://mikezornek.com/sitemap.xml | grep -c "<loc>"`,
  not just the green Success label.
- **The #56 4xx export is not available yet.** Indexing → Pages reads
  "Processing data, please check again in a day or so" as of 2026-07-31, because
  the Domain property was verified the same day and its reports have not
  backfilled. Check again after 2026-08-02; tracked in #177. That report is the
  only way to
  diagnose #56, since the problem is not reproducible from outside: verified
  2026-07-30 that there is no bot blocking under a Googlebot user agent, no rate
  limiting across a 25-request burst, and that missing pages return clean 404s.
- **Open question about where the 4xx warning came from.** This property's
  reports were empty on the day it was verified, so the warning quoted in #56
  must have been seen somewhere else, most likely an older URL-prefix property
  (`http://mikezornek.com/`) under an account nobody can currently find. The
  2020 sitemap submission points the same way. If the new property never shows a
  4xx warning once it backfills, that is a real possibility rather than a
  reporting glitch, and #56 may simply be describing a property that is gone.
- **Worth knowing:** Search Console reports are sticky. If the 4xx episode was a
  past incident that has since been fixed, the warning persists until you hit
  Validate Fix. So the export may describe a problem that no longer exists.

### Bing Webmaster Tools

- **Status:** set up 2026-07-31 by signing in at
  <https://www.bing.com/webmasters> with Google, on the same zornlabs.com
  identity as Search Console. The property is `https://mikezornek.com/`.
- **Why it matters more than Bing's market share suggests:** Bing's index feeds
  DuckDuckGo and several AI answer engines.
- **"Import from Google Search Console" does not import the sitemap.** It
  carries verification across, which is the tedious part, but the Sitemaps
  screen was still empty afterward (0 rows) and the home page banner asks you to
  submit one. `https://mikezornek.com/sitemap.xml` was submitted by hand on
  2026-07-31 and was processing at the end of the session. Confirm it landed and
  reads 497 URLs.
- **Bing has no equivalent of Google's Domain property,** so the property is
  scheme-specific. Check it says `https://`. An `http://` property would repeat
  the mistake that left the Google sitemap unread from 2023 to 2026.
- **Reports take up to 48 hours** to populate after setup, same idea as Google's
  backfill.
- **Then:** check the IndexNow section for submission stats, but not until the
  key file is actually live. See below.

### IndexNow

- **Status:** key file and script are in the repo, but **the key is not live
  until this branch merges to `main`.** Confirmed 404 on 2026-07-31. First real
  submission happens the next time a post goes out after that deploy.
- **Do not let Bing generate a key for you.** Bing's IndexNow screen offers to
  mint one. Taking it would leave Bing expecting a key the site does not serve,
  since `509ce3a92525b2bfc2bdba120987afa2` is already committed in `static/`.
- **Check it is live before the first submission:**
  `curl -s -o /dev/null -w "%{http_code}" https://mikezornek.com/509ce3a92525b2bfc2bdba120987afa2.txt`
  should print 200.
- **How to use:** after a deploy is live, `bin/indexnow.sh <url>`. This is a
  step in `playbook/promotion.md`, not part of the build — see the comment at
  the top of the script for why.
- **Reaches:** Bing, Yandex, Seznam, and Naver share one endpoint. Google does
  not participate.
- **Expect a 202 on first use.** That means accepted, key validation pending. It
  is not an error.

### Kagi

- **Status:** nothing submitted, and nothing needs to be. Kagi referrals are
  already arriving without any registration.
- **Kagi was the single largest search referrer** in the first Signal Log week
  (14 visitors, more than Google and DuckDuckGo combined). Check the current
  number with this saved Plausible filter:
  <https://plausible.io/mikezornek.com?f=is,channel,Organic%20Search&f=is,source,Kagi>
- **There is no webmaster console.** Kagi is largely a metasearch layer over
  "anonymized API calls to worldwide search engines"
  (<https://help.kagi.com/kagi/search-details/search-sources.html>), so most
  Kagi visibility is downstream of Google and Bing. Fixing those fixes Kagi.

**Two surfaces, do not confuse them.** The referrals above come from Kagi _main_
search, which takes no submission. Kagi Small Web is a separate, much smaller
discovery surface, and being in main search does not put you in it.

- **Small Web: already listed, nothing to do.** `https://mikezornek.com/index.xml`
  is line 25664 of `smallweb.txt` in
  <https://github.com/kagisearch/smallweb>. Verified on `main` 2026-07-31. How
  or when it got added is unknown, so do not assume it was deliberate.
- **If it ever disappears,** the list takes personal blog RSS feeds by pull
  request against `smallweb.txt`, and this site meets every criterion: English,
  single-author personal blog, posts within 12 months, no ads, no popups. The
  catch is that a self-submission must add **at least two other new sites in the
  same commit**, so it is a small chore, not a one-liner.

### DuckDuckGo

- **Nothing to do.** No submission tool. Its results come from Bing's index, so
  Bing Webmaster Tools is the lever.

## Outstanding one-time work

- [x] Confirm `sitemap.xml` is submitted in Google Search Console (2026-07-31:
      was stale on the http URL, resubmitted as https, reads Success at 497
      pages)
- [ ] After 2026-08-02, once Page indexing backfills: export the #56 "Blocked
      due to other 4xx" URL list and paste it into #56, or record that the
      warning does not appear on this property. Tracked in #177.
- [x] Set up Bing Webmaster Tools via Import from Google Search Console
      (2026-07-31, https property, signed in with Google)
- [ ] Confirm the hand-submitted `sitemap.xml` finished processing in Bing and
      reads 497 URLs. Tracked in #179.
- [x] Confirm the IndexNow key file returns 200 before the first
      `bin/indexnow.sh` run (2026-07-31, after #168 deployed:
      `/509ce3a92525b2bfc2bdba120987afa2.txt` returns 200 as `text/plain` with
      the matching key)
- [ ] Watch the first real `bin/indexnow.sh` run on the next post publish. The
      key file is confirmed, but nothing past it has met the live endpoint.
      Tracked in #180.

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
