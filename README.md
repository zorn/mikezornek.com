# MikeZornek.com

Personal website of Mike Zornek, a developer and teacher from the suburbs of Philadelphia.

## Tech Stack

- Static site generated with [Hugo](https://gohugo.io/).
- Styling is done with the help of [Tailwind](https://tailwindcss.com/).
- The site is hosted on [Render](https://render.com/docs/static-sites).
- The main repo is hosted on [GitHub](https://github.com/zorn/mikezornek.com).
- Analytics are tracked using [Plausible](https://plausible.io).
- We track uptime with [updown.io](https://updown.io/uryy)

## Setup

The project expects Tailwind CLI to be installed and we recommend you run the following to get those tools installed:

```bash
npm install
```

To run the site locally use:

```bash
hugo server
```

To make a new post:

```bash
hugo new posts/2025/6/beginner-web-dev-accessibility/index.md
```

## The `reborn` theme.

This site uses a custom theme called `reborn`. It is not built as a drop in theme for other Hugo sites. Feel free to reference it but keep that limitation in mind.
