# AGENTS.md

## About the project

Personal website of Mike Zornek ([mikezornek.com](https://mikezornek.com)), built with Hugo and a custom theme called `reborn`. The site is hosted as a static site on Render; `bin/build.sh` is the production build script used by Render.

## Commands

```bash
# Install JS/CSS dependencies (Tailwind, Prettier plugins)
npm install

# Run local dev server (rebuilds on change)
hugo server

# Create a new blog post (draft by default)
hugo new posts/2026/6/my-post-title/index.md

# Format HTML templates and other files
npx prettier --write .
```

There are no test commands — this is a content site with no automated test suite.

## Architecture

### Theme: `themes/reborn/`

The site uses a fully custom Hugo theme (`reborn`) that is not designed as a reusable drop-in. Key subdirectories:

- `themes/reborn/layouts/` — all Hugo templates (base layout, list/single/home pages, partials, shortcodes)
- `themes/reborn/archetypes/default.md` — template used when running `hugo new`
- `themes/reborn/assets/js/` — any theme JS

### CSS: `assets/css/main.css`

Tailwind v4 is configured here via `@import "tailwindcss"`. The file also loads the Typography plugin and pulls class names from `hugo_stats.json` (Hugo's build stats, used for Tailwind's content scanning). The comment at the top of `main.css` notes this CSS logically belongs in the theme but couldn't be hosted there — keep it here.

### Content structure

```
content/
  posts/YYYY/M/post-slug/index.md   # blog posts
  projects/project-name.md           # project pages
  now.md, values.md, contact.md, …  # one-off pages
```

Post front matter fields (from the archetype):

```yaml
title: "Post Title"
date: 2026-06-28T12:00:00-04:00
description: something tweet-length
images:
  - posts/2026/6/post-slug/thumb.jpeg
draft: true
pain:   # optional: the problem this post addresses
fix:    # optional: the resolution
tags:   # optional: list of tag terms (feeds the tag taxonomy)
  - elixir
series: # optional: series name this post belongs to
```

### Taxonomies: tags & series

`hugo.yaml` defines two taxonomies — `tag`/`tags` and `series`/`series` — and
most posts set them in front matter (see above). They power discovery UI in the
theme: `partials/browse-taxonomies.html`, `partials/series-nav.html`, and
`partials/term-pills.html`. `capitalizeListTitles: false` keeps term titles as
authored (e.g. `ios`, `ai`), so write tag/series values in the exact casing you
want displayed. When adding a post, prefer reusing existing tag/series terms
over inventing near-duplicates.

### Hugo configuration

`hugo.yaml` at the root. Notable settings:
- `outputs.home` includes JSON (powers the search index at `content/search/`)
- `build.buildStats` + `build.cachebusters` keep Tailwind in sync with Hugo's used-class list via `hugo_stats.json`

### CI

GitHub Actions runs Lighthouse CI (`lighthouse.yaml`) on every push to `main`, auditing a few key URLs against the budget in `.github/workflows/budget.json`.

### Deploys

Render deploys the static site on push to `main`. To push a commit that should
**not** trigger a production deploy (e.g. a draft or WIP), include the marker
`[skip render]` (or `[render skip]`) in the commit message — Render skips the
build. Use it for work-in-progress that isn't ready to go live.

## Repository docs & conventions

Beyond `content/`, a few top-level directories capture how this blog is run and
written. Consult (and maintain) them when relevant:

- `decisions/` — decision records, one file per topic, explaining choices and
  their reasoning so they aren't rediscovered later. Notably `word-choice.md`
  codifies house-style spellings/word forms (e.g. `lifecycle`). **Check this
  before writing or editing prose** and follow the preferred forms; add a new
  entry when a new style decision comes up.
- `playbook/` — repeatable process docs. `promotion.md` lists where and how
  Mike shares a new post (Mastodon, LinkedIn, Elixir Slack/Forum, Reddit, etc.)
  and a share-template format.

## Distilled book & article knowledge (external Library)

A curated library of distilled book and article summaries — covering
programming, software design, and business development — lives at
`/Users/zorn/ProjectRepos/notebook/Library/` (in the adjacent `notebook`
repo). Read access is granted via account-level Claude settings, so no
per-project permission is needed.

When a task touches a topic one of these notes covers — writing or editing a
post, reasoning about programming or business ideas, or looking for a source to
cite — consult the Library before answering:

1. Read `Library/About.md` — the index of everything on the shelf.
2. Read the relevant note(s) in full.
3. Treat each note's "Big ideas" / "How to apply" sections as authoritative
   reference for that source's domain.

These notes are Mike's original distillations, not the source text — useful as
reference and as raw material for posts, never to be quoted as if verbatim.
