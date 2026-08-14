# Declare one Person entity, and reference it from the pages that carry markup

Every page that emits structured data emits a single
`<script type="application/ld+json">` holding a `@graph` with two nodes: a
`Person` describing Mike, and a node describing the page, which points at the
Person by `@id` (`https://mikezornek.com/#mike`) rather than repeating him
inline.

Coverage is deliberately narrow:

| Page            | Page node                                           |
| --------------- | --------------------------------------------------- |
| Home            | `ProfilePage`, whose `mainEntity` is the Person     |
| Blog posts      | `BlogPosting`, authored and published by the Person |
| Everything else | nothing                                             |

**Why an entity rather than per-page facts:** the alternative is a
self-contained `BlogPosting` on each post with the author's name as a plain
string. That gives a search engine 400+ separate claims that someone named Mike
Zornek wrote something, and leaves it to infer they are one person. The `@id`
makes them 400+ pieces of evidence about one node. `sameAs` then bridges that
node to the GitHub, LinkedIn, Mastodon, Bluesky, YouTube, and GoodReads
accounts, which is what lets a search for the name resolve to a person rather
than to a guess.

**Why the Person node is repeated on each of those pages** instead of declared once on
the homepage and referenced from everywhere else: **Google parses each page
independently.** A bare `@id` pointing at a node defined on another URL is
unresolvable at the moment it is read. The `@graph` gets both properties at
once — each page stands alone, and the shared `@id` ties them together for any
consumer that does reconcile across pages. This looks like redundancy and is
not; it is the reason the design works.

**Why the homepage is the `ProfilePage`:** Google's rule is that "the primary
focus of the page must be a single person or organization that is affiliated
with the overall website," and its examples include "'About Me' pages on
blogs." The homepage's `h1` is "Who is Mike Zornek?" followed by a first-person
bio, so it qualifies without inventing a new page. This is also the only type
used here with a documented search feature attached.

**Why nothing on `/values/`, `/contact/`, `/now/`:** a `Person` node hung on
those would assert they are about Mike the way the homepage is. They are not,
and volume is not the goal.

**Why the graph is built with `dict` and rendered by `jsonify`** rather than
written as JSON text in the template: hand-assembled JSON is one apostrophe in
a post title away from emitting a broken block, and a broken block fails
silently.

## Honest expectations

Recorded so nobody later mistakes this for a growth lever.

- **`BlogPosting` on a personal blog earns no visual rich result.** No badge,
  no card, no stars. Google's Article documentation promises "better title
  text, images, and date information" — improvements to an ordinary blue link.
- **The entity/`sameAs` consolidation story is practitioner consensus, not a
  Google citation.** Google documents `sameAs` as recommended; it does not
  publish a page saying `sameAs` builds your knowledge-graph entity.
- **The "AI answer engines read your schema" claim was investigated and
  discarded.** The evidence for it is wall-to-wall SEO marketing with unsourced
  figures. No AI vendor documents parsing JSON-LD.

The case for doing it anyway: roughly thirty lines of template, a standard the
search engines jointly founded, no ongoing maintenance, and no downside. Cheap
permanent hygiene. Do not expect it to move Plausible.

Verified 2026-07-30 against Google's structured data gallery: Article,
Breadcrumb, and Profile Page are all currently supported with no deprecation
notices. The types Google has killed (HowTo, FAQ, sitelinks searchbox) lost
their **visual presentations** — Google stopped drawing the widgets, not
parsing schema.org.

## Considered and rejected

- **`BreadcrumbList`** — URLs are `/posts/YYYY/M/slug/` and the intermediate
  `/posts/YYYY/` levels are not real pages. The breadcrumb would be fictional
  or trivial.
- **A standalone `Service` node on the consulting page** — folded into
  `Person.makesOffer` instead. One entity that offers something beats two nodes
  a search engine has to reconcile into one.
- **A `price` on the `Offer`**, and the "fixed-price two-week sprint" wording
  with it. `params.sprint` has both, and an earlier draft emitted them. The
  problem is half-life: the `Person` node ships on every page the site emits,
  next to `sameAs` and `knowsAbout`, which stay true for years. The shape and
  price of the current consulting offer do not. Worse, a stale price would be
  valid JSON with every required property present, so
  `bin/verify-structured-data.mjs` could never flag it — the same silent
  failure this whole design is built to avoid, at the semantic level instead of
  the syntactic one. And there is nothing on the other side of the trade:
  Google's Search Gallery documents no feature that reads an `Offer` on a
  `Person`; price data earns a rich result only through `Product` and
  `LocalBusiness`. `priceValidUntil` was the alternative, but it converts a
  silent staleness problem into an expiry date nobody is reminded to bump. What
  the `Offer` keeps is the durable claim: this person offers Elixir and Phoenix
  consulting, and here is the page about it.
- **`WebSite` with a `SearchAction`** — Google removed the sitelinks searchbox
  that consumed it.
- **Deriving `knowsAbout` from tag counts** — cute, but the tag vocabulary
  includes `personal`, `gaming`, and `reviews`. The list in
  `params.identity` is written by hand and kept honest.

## Consequences

- Identity copy (`jobTitle`, `description`, `knowsAbout`, region) lives in
  `params.identity` in `hugo.yaml`, not in the template. It is editorial text
  aimed at machines, and it should be as easy to revise as any other site copy.
- `sameAs` reads from `data/profiles.yaml`, the same list the Follow page
  renders, so it can never claim an account the site does not visibly link.
- The `Offer` carries no price, so `params.sprint` stays purely human-facing
  copy and changing the sprint's price or shape needs no thought about schema.
- `bin/verify-structured-data.mjs` runs on every build. Its most important
  check is that **every `@id` reference resolves within the same page**, which
  is the invariant this whole document describes and the one thing reading the
  template cannot confirm.
- **No headline length check**, deliberately. Google's Article docs used to cap
  `headline` at 110 characters, and an early draft of the verifier failed the
  build past that. Google dropped the cap in January 2023; the docs now say only
  "consider using a concise title, as long titles may be truncated on some
  devices." That is advice about taste, not a rule a build should enforce, so
  there is nothing here to enforce it. Write the title the post needs.

## Verified on production

Checked against Google's Rich Results Test on 2026-07-31, the day this shipped.
Both pages crawled successfully and neither returned a warnings section, which
is where Google lists recommended properties it did not find.

| URL | Result |
| --- | --- |
| `https://mikezornek.com/` | Profile page — 1 valid item detected |
| `https://mikezornek.com/posts/2026/7/shim-off-a-dead-elixir-dependency/` | Articles — 1 valid item detected |

The post reports as **Articles** rather than BlogPosting because `BlogPosting`
is a subtype of `Article` and the tool names the feature family, not the schema
type. That is the expected result, not a mismatch.

"Valid item detected" means **eligible**, not that anything visual will appear.
Per the expectations above, the Article eligibility buys better title, image,
and date handling on an ordinary blue link; the homepage Profile page is the
only result here with a documented visual feature behind it. Re-run the test
after any change to `schema/structured-data.html`, since the build check
verifies structure and `@id` resolution but knows nothing about Google's
eligibility rules.
