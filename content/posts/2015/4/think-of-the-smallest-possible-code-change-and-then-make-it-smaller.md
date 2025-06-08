---
title: Think of the Smallest Possible Code Change, and Then Make It Smaller
date: 2015-04-16T03:23:25+00:00
aliases: /2015/04/15/think-of-the-smallest-possible-code-change-and-then-make-it-smaller/
categories:
  - Coding
  - Tips
---

I&#8217;m working on a client project right now. We do peer review of the code via pull requests. It works great, but the quality of the reviews you get are very dependent on the size of the pull request you make.

Take for example, one of my recent pull requests, which had the following git characteristics:

    1,780 additions
    1,618 subtractions
    24 files changed

Not my largest pull request ever but still way larger than what I&#8217;d prefer. I got zero feedback. It was merged on first pass. Now take one I did the next day:

    80 additions
    1 subtraction
    7 files changed

We had 10 conversation posts on this pull request, discussing three distinct recommendations and/or questions. Questions on things I was already doing for a few pull requests already but I guess slipped by.

I don&#8217;t blame the reviewer, I blame myself. It&#8217;s really hard to be detail focused when there is so much to review.

So keep those pull requests small and focused. You&#8217;ll get better feedback and you&#8217;ll probably get integrated faster too!
