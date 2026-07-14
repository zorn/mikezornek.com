---
title: "What Is Good Code?"
date: 2026-07-14T10:32:42-04:00
description: We all nod along to "good code" but rarely define it. Here are the four attributes I look for, and the practices that protect each one.
pain: As one evaluates what kind of software development practices to embrace, they need to understand the why. Why are we doing this? What is good code?
fix: Provide a foundation of why related to good code, some title-only practices and offer context on when to deploy them.
tags:
  - software-craft
  - practices
---

Everything I do to keep a codebase healthy (the CI checks, the standards files, the review habits) is in service of something I've never actually defined: *good code*. The practices only make sense once you can name what they're protecting. So let's start there, and connect the *what* to the *why*.

## Solves a problem

An obvious starting point, but if we are not helping people accomplish some kind of goal then WTF are we doing?

This includes software being deployed and available to users. If you are endlessly [chasing perfection](https://jawns.club/@zorn/116914095006092357) and not shipping then you have lost the plot. In fact, the learning you will do once you can observe users attempting to solve their problem with your code is probably more valuable than the other quality attributes we are about to cover.

**Enabling practices:** user research, marketing/finding your people, one-button deployments, interface design, product usage observability, accessibility, localization

## Is accurate, reliable and secure

When the user hits those buttons, we meet the intent of the system. We do the work correctly and the work happens with good performance characteristics.

We only do what the user needs. We don't burden the user with features or complexities they do not need. Embrace YAGNI (you aren't going to need it).

We need to treat all user input with care. Losing user content, intent, or progress needs to be protected against via fault-tolerant system design.

We protect the integrity of the system through industry security norms.

**Enabling practices:** testing, telemetry, monitoring/alerting, error reporting, customer support, customer education, security audits, disaster recovery

## The system can be understood and the code is readable

We read code way more than we write code. New contributors will join the project and historic developers will move on (or forget what their past selves did). You will learn a lot about the system you have designed by writing/explaining it to other people.

If we had to name enemy number one of good code it would be complexity. No one intentionally builds a complex system. It happens one small change at a time. You need to ruthlessly fight for simplicity and regularly push back on code entropy.

**Enabling practices:** automated code format and pattern enforcement, human code review, documentation, ubiquitous language, decision documents, code standard definitions, refactor time

## Easy to change

Over time you will identify sharp edges and misunderstandings of your system design. You need the tooling, confidence and time to refactor and improve the system.

**Enabling practices:** testing, context boundaries, structured pull requests and CI validations, type checking

***

**Aside:** Does all code need to be good code? Not really. There are plenty of environments where you are exploring a design or just need a one-off script that will be thrown away. Investing in the production practices is overkill at that point. That said, software entropy is real, and the longer you delay introducing production practices that support these good-code values the harder it will be to add and instill the longer-term culture you want.

If you are looking for a follow-up book recommendation I highly recommend *A Philosophy of Software Design, 2nd Edition* by John Ousterhout. It is one of the best combinations of high-quality advice and focused delivery on the topics of software complexity.
