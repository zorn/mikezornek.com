---
title: "Search"
description: Search every post on this site by title, tag, and content.
# A utility page: it runs a search rather than saying anything, so it has
# nothing to offer an index. `noindex` is read by head.html; `sitemap.disable`
# keeps the page out of sitemap.xml while it still renders and stays in every
# page collection. The old `priority: 0.1` is gone because Google documents
# that it ignores <priority> entirely. See decisions/indexing.md.
noindex: true
sitemap:
  disable: true
layout: "search"
---
