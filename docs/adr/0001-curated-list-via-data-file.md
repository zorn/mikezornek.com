# Store the "Start Here" curated list in a data file, not post front matter

The Start Here list (a hand-ranked, newcomer-facing on-ramp of strong technical
posts — see `CONTEXT.md`) is stored as a single ordered `data/selected.yaml`
rather than a `featured:`/`weight:` flag on each post's front matter.

**Why:** curation is fundamentally a *list* decision — ranking and membership
are easiest to see, reorder, and reason about in one place, and each entry
carries an editorial note that has no natural home in a post's own front matter.
A data file gives us that single reviewable source, which both the home-page
"Start Here" section and the top of the blog index render from one definition.

**Considered and rejected:** per-post front-matter flags (consistent with how we
do tags/series/draft, but scatters the ranking across N files as fiddly weight
numbers and leaves nowhere clean for the editorial note).

**Consequence:** entries reference posts by logical path, so moving or renaming a
post's bundle means updating this file. That trade is acceptable — we move posts
almost never, and the template skips any entry whose path no longer resolves.
