---
title: "A Place for Everything: How I Track Work"
date: 2026-07-03T01:07:10-04:00
description: "A window into how I track work: issue statuses, types, and pull request conventions, with sample PR templates you can copy. Take a look around and keep what's useful."
draft: true
pain: curious developers like to read how others work and get inspired
fix: a window into my own opinionated system -- issue tracking, a status flow, issue types, and PR conventions -- to discover and cherry-pick from
---

When I have management responsibility on a project and influence to shape workflows, this is how I typically manage issues and pull requests. None of this is the One True Way -- it's just the system I've arrived at, and I find writing it down useful both for myself and for blog readers who enjoy reading about such things to evolve their own flows. 

Aside: If I'm joining a team that already has a working software lifecycle, I don't inject any of this out of the blue. I might ask a lot of questions about their process and why they landed there, but any changes are more gradual through team discussion and choice.

## Issue Tracking

I like to keep issues in GitHub Issues and present progress / scheduling via GitHub Projects. I choose GitHub as close to the code/repo as possible. Two reasons:

- Knowledge stays next to the code it's about, instead of drifting off into a separate tool that's easy to lose. (I find people shift documentation tools a lot, and switching out of GitHub seems doubtful -- though that wind might be changing these days.)
- Stakeholders get visibility -- they can see what's in flight, watch epic-level progress, and gauge risk against a schedule.

## Issue Statuses

I tend to organize issues by status, and I use more stages than most. The extra granularity makes it easy to see, at a glance, exactly where work actually is:

- **Opportunities** -- unshaped ideas for work
- **On Deck** -- prioritized, well-shaped, and understood
- **In Progress** -- started
- **Needs Review** -- finished (not merged) but awaiting peer review
- **Done (Merged)** -- merged but not yet deployed
- **Deployed (Shipped)** -- deployed to customers
- **To Be Verified** -- deployed work explicitly awaiting business review before it's considered complete
- **Verified** -- reviewed by business stakeholders and considered correct and complete
- **Canceled** -- dropped and no longer being considered

The naming here is deliberate. I use **Opportunities** instead of "Backlog" because "backlog" implies a pile of work you're obligated to get through. "Opportunities" can sit around indefinitely and may never be prioritized -- and that's fine. It gives ideas a home for public consideration and discussion without the quiet guilt of an ever-growing backlog.

The risk is that the Opportunities column gets too big to browse. When that happens, you clean it up and close issues. That's allowed.

## Issue Types, for navigating a large list of opportunities

Statuses tell you *where* work is; types help you navigate *what* it is, especially when an Opportunities list gets long.

- **Task** -- a specific thing to do, including non-code work
- **Bug** -- an unexpected problem or behavior
- **Feature** -- new functionality
- **Enhancement** -- an improvement to existing behavior
- **Enhancement: UI** -- interface changes that improve usability without new behavior
- **Security** -- work related to platform security
- **Code Refactor / DevOps** -- code-quality changes and developer quality-of-life improvements
- **Documentation** -- improvements or additions to captured knowledge

## Pull requests that tell a story

Pull requests are where issues are actually resolved, so I like to tie the two together explicitly.

A PR should [reference the issue it fixes](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) so it closes automatically on merge. If the work moves an issue forward but shouldn't close it, I just say `Related to: #123`.

A few things I lean on:

- **Use a PR template.** A template helps everyone remember the things reviewers tend to need. It's a default, not a rule -- if a particular change is better presented some other way, ignore the template and present it that way.
- **Shape the PR as a story.** Explain the problem or the enhancement request, then walk through the change and how it resolves that problem. Give clear instructions on how to verify the change -- and if the default dev environment doesn't have the data needed to demonstrate it, include code to seed that scenario.
- **Open PRs early as drafts.** I tend to push a PR early in my own dev cycle so people can see what I'm working on. The "draft" state indicates I'm not requesting review yet. Only when it's marked "open" -- and I formally request review -- am I actually looking for eyes.

### A sample template

Templates can be as light as you like. Here's about the simplest one I use:

```markdown
Fixes #<issue-number> / Related to #<issue-number>

## How to test/verify

Please include instructions for manually reviewing this changed behavior.
```

Other teams I've worked with prefer a template that prompts the author to check their own work before handing it off -- a short list of questions to ask yourself before you ask for anyone else's time:

```markdown
Fixes #<issue-number> / Related to #<issue-number>

## Problem Statement

## About the Change

## How to Test and Verify

## Author checklist

- [ ] Is the code well tested?
- [ ] Are typespecs explicit, or are the new types too generic?
- [ ] Have you considered the performance characteristics of the new code?
- [ ] Did you document any new decisions?
- [ ] Are there changes to ubiquitous language or naming that others should know about?
- [ ] Does this need a documentation or changelog update?
- [ ] Are there any follow-up issues worth opening before this is forgotten?
```

The exact questions matter less than the habit they encourage: a moment of self-review before a PR becomes someone else's responsibility. Don't waste your peer's time. Respect them by giving them the context and tools they need to do a good review. It should not need saying, but keep the PRs as small as possible. Learn to break down your changes.
