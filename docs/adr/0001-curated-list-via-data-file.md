# Store the "Start Here" curated list in a data file, not post front matter

The Start Here list (a hand-ranked, newcomer-facing on-ramp of strong technical
posts; see `CONTEXT.md`) is stored as a single ordered `data/start-here.yaml`
rather than a `featured:`/`weight:` flag on each post's front matter.

**Why:** curation is fundamentally a *list* decision: ranking and membership
are easiest to see, reorder, and reason about in one place, and each entry
carries an editorial note that has no natural home in a post's own front matter.
A data file gives us that single reviewable source, which both the home-page
"Start Here" section and the top of the blog index render from one definition.

**Considered and rejected:** per-post front-matter flags (consistent with how we
do tags/series/draft, but scatters the ranking across N files as fiddly weight
numbers and leaves nowhere clean for the editorial note).

**Consequence:** entries reference posts by logical path, so moving or renaming a
post's bundle means updating this file. That trade is acceptable: we move posts
almost never. An entry whose path no longer resolves fails the build: both
templates that render this list (`partials/start-here-list.html` and
`_default/index.llmstxt.txt`) call `errorf` rather than skip the entry.

**Also considered and rejected (#176):** skipping an unresolvable entry instead,
on the theory that a renamed bundle should degrade the homepage rather than
block every deploy. That was the original behavior here, and reversing it is
deliberate, not an oversight to re-raise. The list is short and hand-picked, so
losing one entry is proportionally large and completely invisible: no warning,
no build noise, just a shorter list nobody notices for months. Same class of
silent failure that `bin/verify-og-images.mjs` and `bin/verify-structured-data.mjs`
exist to catch. The skip traded a loud, immediate, self-inflicted problem (a
deploy that stops on the same commit where the post moved, naming the exact path
to fix) for a quiet permanent one (a broken curated list in production), which
is the wrong direction. Note the one sharp edge: an entry pointing at a draft
resolves under `hugo server -D` but not in a production build, so that mistake
surfaces at deploy time rather than locally.
