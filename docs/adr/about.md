# About these decisions

Decision records capture the details of important choices made while building
this blog — the context, the choice, and the consequences worth remembering —
so nobody has to rediscover the reasoning later. When a future contributor
(including future me) looks at the code and wonders "why on earth was it done
this way?", the answer lives here.

## When to write one

Write a decision when **all three** of these are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful.
2. **Surprising without context** — a reader will look at the code and wonder
   why it was done this way.
3. **The result of a real trade-off** — there were genuine alternatives and one
   was picked for specific reasons.

If a choice is easy to reverse, skip it; it will just get reversed. If it isn't
surprising, nobody will wonder why. If there was no real alternative, there is
nothing to record beyond "we did the obvious thing." A choice that fails this
test but still needs writing down is usually a coding standard or a glossary
term, not a decision — `docs/word-choice.md` is where the house-style word forms
live.

## Scope and length

Each file covers one **topic**, and a topic often carries several related
decisions — `0008-indexing.md` records five, from `/search/` being `noindex` to
why `/random/` keeps its own head. That is the house convention, and it is why
these records run longer than the one-to-three-sentence ideal a brand-new record
should still aim for. Favor brevity when you can; let a topic grow only when the
decisions inside it genuinely belong together.

## Immutable, with pointers

Decision records are **immutable**. Never rewrite one to match how the code
works today — that turns a record of *why we chose* into a competing statement
of *what we do*, and the two drift. When a new decision narrows, extends, or
overturns an older one, say so in the new record **and add a pointer to the top
of the old one**, directly under its title:

```md
> **Narrowed by [0008-indexing.md](0008-indexing.md)** — the second verifier
> skip now tests the condition it always meant.
```

Non-semantic fixes (broken links, renamed paths, typos) are always fine; they
change nothing the decision asserts.

## Naming

Files take a four-digit sequential prefix in creation order, then a short
kebab-case slug (`0009-thin-term-pages.md`). Take the next number after the
highest existing one. `about.md` and `__template.md` are not decisions and carry
no number.

## Where reference material goes

Evidence, environment constraints, and glossary terms are not decisions and live
in `docs/` beside this folder — `research-search-page-indexing.md` (the sourced
evidence behind `0008-indexing.md`), `render-static-site-constraints.md` (the
hosting environment), and `word-choice.md` (house-style spellings).

## The records

- [0001-curated-list-via-data-file.md](0001-curated-list-via-data-file.md) — why the "Start Here" list is a data file, not per-post front matter
- [0002-page-metadata.md](0002-page-metadata.md) — meta description, Open Graph, and Twitter card tags
- [0003-llms-txt.md](0003-llms-txt.md) — the generated `/llms.txt`, and why it is cheap optionality rather than a channel
- [0004-structured-data.md](0004-structured-data.md) — the JSON-LD entity the home page and blog posts declare
- [0005-feeds.md](0005-feeds.md) — why the RSS feeds cap at 50 items, stay full-text, and how the forked template stays in sync
- [0006-ai-crawlers.md](0006-ai-crawlers.md) — who `robots.txt` lets in, and why that includes AI training crawlers
- [0007-og-images.md](0007-og-images.md) — generating the social card image each page shares with
- [0008-indexing.md](0008-indexing.md) — which pages are kept out of search indexes, and why that is separate from crawl policy
