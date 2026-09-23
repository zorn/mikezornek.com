---
title: "When a Pull Request Balloons, Extract"
date: 2026-09-23T09:50:11-04:00
description: "My refund feature's pull request grew past 3,000 lines. Instead of shipping it whole, I've been pulling out the bug fixes and tests into their own PRs."
pain: "My pull request for a refund feature has grown past 3,000 lines through QA fixes, and I don't trust anyone, including me, to review it well"
fix: "Pull unrelated bug fixes, tests, and small changes out into their own PRs, trading time for reviewer confidence"
bob-promise: "Next time a PR diff gets out of hand, you'll know how to shrink it instead of asking someone to rubber-stamp it"
tags:
  - practices
  - software-craft
  - consulting
---

On my part-time client project, I've been working toward a feature for arbitrary refunds on an order. Because of the client's domain and the large matrix of ways an order can be paid for, developing and QA'ing this feature has been really challenging.

When I started, I was on the right track. I split the implementation into three phases:

1. Add test coverage to the code to verify and maintain existing behavior.
2. Build out the headless/core business logic, allowing this new work to be merged in without impacting current behavior.
3. Work on the UI that uses the new business logic, completing the feature.

Phases one and two merged without much fanfare. Phase one was quick. Phase two added the logic, so it took a little longer, and the review was mostly reading through the tests to make sure they walked through the logic appropriately.

Phase three is where things got away from me. I got the UI working fairly quickly, but I've been doing a ton of manual QA testing, and through that I keep spotting inconsistencies and gaps. My PR has ballooned to over 3,000 lines. At that size, a code review can't do its job. Reviewers will miss things, or they will rubber-stamp it without much attention. I see other people merge large PRs, but doing that wouldn't sit right with me.

Instead, I've been extracting unrelated bug fixes, tests, and other small things into their own PRs. Looking back at the commit history, I pulled out:

- A text button component that the refund UI needed.
- Some bug fixes related to tips and fees.
- IDs on various checkboxes, which let me add test coverage to an existing refund UI panel that had none.

Each is small enough to review properly on its own, and each one shrinks the remaining diff. It is a tradeoff of extra coding time for improved confidence, but considering how important it is to get code that moves money right, it's a trade I'm happy with.

If you ever find yourself in a PR diff that has gotten out of hand, take a breath and start extracting. Your reviewers and your future self will thank you.
