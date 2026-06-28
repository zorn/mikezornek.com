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
```

### Hugo configuration

`hugo.yaml` at the root. Notable settings:
- `outputs.home` includes JSON (powers the search index at `content/search/`)
- `build.buildStats` + `build.cachebusters` keep Tailwind in sync with Hugo's used-class list via `hugo_stats.json`

### CI

GitHub Actions runs Lighthouse CI (`lighthouse.yaml`) on every push to `main`, auditing a few key URLs against the budget in `.github/workflows/budget.json`.
