---
title: "Decision Records, Playbooks, and Other Acts of Kindness"
date: 2026-07-02T01:07:10-04:00
description: You've opened a project you didn't write, hit a wall, and found no one left to ask. The code is there but the why is gone. Here are the small habits that spare the next developer that moment.
draft: true
pain: the practices that keep a codebase healthy are easy to skip under pressure, and the cost lands on whoever inherits the project later
fix: a scannable rundown of the non-code practices that make life better for the next developer -- and why each one is worth the effort
tags:
  - practices
---

You've felt this. You open a project you didn't write, hit a wall, and there's no one left to ask. The code is all there, but the *why* is gone -- it left with whoever wrote it.

Most of the work that prevents that moment never shows up in a code change. It's the stuff you do around the code so the next person -- maybe a teammate, maybe future you -- doesn't get stranded. Here are the practices I reach for most. Think of each one as a small kindness aimed at whoever comes next.

## When "how we keep this running" lives in one person's head

You know the team has a fragile spot when only one person can deploy, or only one person remembers to check the error dashboard. When that person is out sick, things quietly drift.

I fix this with **playbooks** -- articles on how to actually operate the platform.

- **Weekly tasks:** team sync format, check for stale dependencies, review last week's errors
- **Monthly or yearly tasks:** plan/review larger projects, run a security audit, verify backups actually restore
- **Domain-specific:** how to reset staging, how to resolve common errors

I tend to keep the playbooks right in the repo, and in those playbooks I document not only how to do something but also why we do it.

## When you need to understand for investigation or recreate that custom SQL production fix

Six months from now, there will be an issue that pops up that reminds you of something that was patched by hand last winter. You either want details of the manual SQL patch for some performance investigation or need to redo the patch yourself for a second instance that has popped up. You have no idea what the previous developer did last winter.

For those, I keep an **OPS_LOG**: a dated Markdown file that notes what was done and why. Low ceremony on purpose. When the strange patter turns up later, there's a place to look before anyone starts guessing, and it has useful details.

In fact, what I often do is open a PR that updates the `OPS_LOG` with an UPCOMING tasks list for review before the work is executed.

## When you can't remember why you chose this approach

Even on your own code, the reasoning fades. Six months on, you stare at an architecture choice and can't recall what you were weighing, or what you ruled out and why.

So I write **decision documents**. Formally, these are [architecture decision records](https://github.com/architecture-decision-record/architecture-decision-record); I just call them "decisions" -- less intimidating, more likely to actually get written. For any choice that's non-trivial and hard to reverse, I capture what I considered, what I picked, and what I deliberately skipped. The payoff is often in the writing itself. More than once, drafting the decision has changed my mind about the decision.

## When the same thing has two different names

Management says "X," developers say "Y," and they mean the same thing -- but nobody notices (or just lives with the uncomfortable translation in their heads) until the mismatch costs real time in a planning meeting or a bug report.

The fix comes from domain-driven design: **ubiquitous language**. [More info.](https://github.com/SAP/curated-resources-for-domain-driven-design/blob/main/knowledgebase/concepts/strategic-concepts/ubiquitouslanguage.md) Get everyone meaning the same thing by the same word. I mostly do this by asking a clarifying question whenever I catch a term being used in two ways, documenting it, and otherwise nudging people to align during discussions. It's slow, it's never fully finished, but the small wins still pay back the time and attention to detail.

## When a finished PR sits for days

An open pull request is work the company has already paid for that currently has zero beneficial impact. The longer it waits, the staler and riskier it gets.

I treat **code review** as a priority: if there's a PR in the queue, I review it before starting new work of my own. I prefer it when this is the team norm, but that does not always happen.

A few habits that help:

- **Default to suggestions, flag the exceptions.** Most of my comments are things to consider. When something genuinely blocks, I prefix it `Blocking:` so intent is never ambiguous.
- **I avoid GitHub's changes requested status.** It makes me a hard gate on merging. If the author and other reviewers are satisfied, that's their call -- not mine to enforce from the outside. I post my review with Approving or Commenting.

> Aside: PR communication styles vary a lot between teams. Saying what you mean up front saves a surprising amount of friction, especially with people who are new to you. People tend to read words on a screen in a much stronger voice than those words might be intended. The key is to be up front about the intent.

> Aside: AI-assisted coding has made review harder in one specific way. Ask why an approach was chosen and the author may not know -- an agent wrote the first pass and the reasoning never got internalized. Decision docs help here, because writing one forces the issue a PR comment doesn't.

## Lead by example, not by mandate

You don't need authority to do any of this. If a team already has a locked-in process, I never walk in and overwrite it. Where I have room, I just start doing these things myself. The valuable ones get picked up. The ones that don't tell me something too.

***

Getting features and fixes out the door is the table-stakes expectation. The goal is to elevate your software engineering presence on the team. These are some paths to do so. 

What did I miss? Let me know.
