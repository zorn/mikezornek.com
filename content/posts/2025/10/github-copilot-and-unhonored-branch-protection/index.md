---
title: "Github Copilot and Unhonored Branch Protection"
date: 2025-10-15T10:40:25-04:00
description: GitHub Copilot commits directly to `main` and ruins my night.
---

I was using the GitHub Copilot web chat experience yesterday for client work. I needed to migrate some issues from a third-party CSV export into GitHub Issues. (It mostly worked, but there was still a lot of data massaging after the fact, which the chat could not do.)

Early in the process, the chat took my command of `make the issues` to make markdown files in an `issues` folder on the `main` branch instead of making actual GitHub Issues.

This repo **has** branch protection rules that should disallow direct commits on `main`, but I guess [because I am an organization admin](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#about-branch-protection-rules), it just does it.

This series of events kicked off unwanted deploys and commits. It was a solid reminder about the dangers of putting these MCP chat servers anywhere near production systems.

I'm starting to get marketing from Render as to the availability of its own [MCP services](https://render.com/docs/mcp-server), and I'm very hesitant to use them.
