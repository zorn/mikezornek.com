# Cap the RSS feeds at 50 items, and keep them full-text

Every RSS feed the site generates is capped at the 50 most recent items by
`services.rss.limit` in `hugo.yaml`. Items still carry the complete post body.

Before the cap, `/index.xml` was 1.96 MB of generated XML: 467 items, every one
of them a full post. That is the entire archive in one document.

Be precise about what that cost, because the raw file size overstates it twice
over. Render serves the feed gzipped, so a full transfer was about 520 KB on
the wire, not 1.96 MB. It also sends `ETag` and `Last-Modified`, and a
conditional request returns `304` with a zero-byte body, so a reader polling an
unchanged feed pays essentially nothing. Polling frequency was never the
problem.

What it did cost: the feed changes every time a post ships, and at that moment
every subscriber downloads the whole document again to receive one new item.
520 KB to deliver one post, times however many readers subscribe, on every
publish. Clients that skip conditional requests pay it on every poll instead.
Capping the item count is what shrinks that number, and it is the only lever
here that does.

The cap took the home feed from 1.96 MB to 486 KB, roughly 520 KB to 124 KB
compressed, a 75% cut either way. Across the site's 30 generated feeds (home,
sections, and every tag and series term) it is 6.5 MB to 3.3 MB raw, 1.7 MB to
895 KB compressed.

**Why 50 and not 10 or 20:** the number needs to be larger than the most posts
a reader could plausibly miss between polls, or the feed silently drops posts
for anyone whose reader was offline for a stretch. Recent years run a dozen to
two dozen posts, so 50 is a couple of years of writing. Even 2022, the busiest
year on record at 90 posts, would have needed a reader to go dark for roughly
seven months before anything fell off the end.

**Why full-text stays:** a full-text feed is a real courtesy. It lets people
read in the tool they chose rather than being bounced to a browser, and it is
the thing RSS is actually good at. The payload problem was the item _count_,
not the item _size_, so bounding the count fixed it without taking anything
away from the reading experience.

## Considered and rejected

- **Summaries instead of full text.** The larger payload cut, and the one that
  costs readers the most. Rejected because it trades the feed's best property
  for bytes that capping already recovers.
- **A capped feed plus the full archive at a second URL.** Preserves
  "subscribe and backfill," which approximately nobody does through RSS, in
  exchange for a second output format, a second template, and a second thing to
  keep working. The archive is already browsable, searchable, and in the
  sitemap.
- **Leave it alone.** The most defensible of the three, for the reasons in the
  cost note above: compression and conditional GETs already absorb most of what
  the raw file size suggests. Rejected because what they do not absorb is the
  re-download every subscriber performs on every publish, and because the fix
  is one config line that Hugo's template already honors, which is cheaper than
  continuing to reason about whether it matters. Worth being explicit that
  Render's outbound-bandwidth numbers were never pulled, so nobody knows
  whether feeds were a real share of the 5 GB/month included on a Hobby
  workspace. Measuring first was the plan in the issue; a one-line fix arrived
  before the measurement did, and the measurement is now moot.

## Consequences

- `services.rss.limit` is global. It applies to the home feed, the section
  feeds, and every tag and series term feed. That is the intent: the tag feeds
  for the larger terms were hundreds of KB each for the same reason.
- The template at `themes/reborn/layouts/_default/rss.xml` needed no change. It
  is a 2020 fork of Hugo's embedded RSS template, kept because the embedded one
  emits `.Summary` where this site wants `.Content`, and the limit check it
  copied at the time still reads `.Site.Config.Services.RSS.Limit`. Switching
  back to the embedded template is not an option here: it would silently turn
  the feed into summaries, which is the choice rejected above. The fork has
  drifted from upstream in other ways, tracked separately in #182.
- The home feed draws from all regular pages, not just posts, so the project
  and standalone pages are technically eligible for a slot. In practice none of
  them carry `date` front matter, so Hugo gives them a zero date and they sort
  to the very bottom: the highest-ranked one was item 448 of 467, roughly 400
  places below the 50-item cutoff. The capped feed is 50 posts and nothing
  else, and it no longer ships the `Mon, 01 Jan 0001` pubDates those pages were
  emitting.
- Anyone subscribing now gets the last 50 posts as their backfill instead of
  the whole archive. That is the behavior nearly every blog feed already has.
