---
title: "ElixirConf US 2026 Recap"
date: 2026-09-14T09:39:25-04:00
description: "Notes from watching ElixirConf US 2026 on a virtual ticket, and some talks I'd point you to first."
tags:
  - conferences
  - elixir
  - ai
---

[ElixirConf US 2026](https://elixirconf.com) happened last week in Chicago. I could not attend in person, but I did follow along with a virtual ticket.

A virtual ticket is basically live stream access to the talks. There was no real mingling for virtual attendees, which feels like a missed opportunity.

Here are the talks that stood out for me. There is [a playlist on YouTube for the conference](https://www.youtube.com/playlist?list=PLVqsKC3zWaDc). Historically the full talks show up six to nine months after the show, with the keynotes going up early. This year the keynotes, the lightning talks, and a handful of full talks are already posted, so maybe that lag is shrinking. If you have a ticket, you can watch everything archived on the [Swapcard site](https://app.swapcard.com/event/elixirconf-us-2026).

## Recommended Talks

**The Graveyard of Good Ideas by Quinn Wilton**

<https://www.youtube.com/watch?v=ovlQ81rBc-4>

A wonderful talk that mixes rich storytelling with deep technical ideas about protocols, contracts, and developer tooling.

**Keynote: Exoskeletons, not Autopilots by Zach Daniel**

<https://www.youtube.com/watch?v=7smgEJkgqO8>

Zach recently took a new job at a healthcare platform and shares a wide mix of how he has been using AI, both for coding and for the broader product work. I want to watch this one again to pull out more ideas for my own side project.

**It's Alive! Agent Self-Determination With Elixir (and NixOS) by Chris Ertel**

Chris explored some curious, and somewhat scary, ideas about how agents can self-propagate and customize live systems.

**A Dev Environment for Every Branch by Jason Axelson**

Jason shared his [Fast Worktree](https://github.com/axelson/fast-worktree) tooling, which he uses to solve the problems that show up when you try to run agents in parallel. I've hit the same problems and will look to his code for inspiration.

**Hologram: Building Local-First Apps in Pure Elixir by Bart Blast**

I enjoyed the chance to catch up on [Hologram](https://hologram.page), which I've seen post consistent updates over the summer. I'm not sure it fits the goals of my current local-first project, but it's good to know what else is out there for local-first tooling.

**Lightning Talk: Verified PubSub by Brian Meeker**

<https://www.youtube.com/watch?v=Vb1Rr9d6h9E>

Brian pitched a [Verified PubSub concept](https://github.com/CuriousCurmudgeon/verified_pubsub), in the spirit of [Verified Routes](https://phoenix.hexdocs.pm/routing.html#verified-routes). I've always found PubSub to be one of the softer corners of Phoenix development, so the idea of more compiler help to verify behavior sounds wonderful.

**Paying Down Tech Debt with AI by De Wet Blomerus**

A helpful review of how De Wet thinks about tech debt, and some of the wins he has had using AI to address it. It lines up with a lot of what I've been [writing](/posts/2026/7/guarding-against-ai-drift/) [here](/posts/2026/9/finding-flaky-tests/) lately.

**Stop Routing; Start Flowing: Guided Workflows in LiveView by Matt Milton**

Matt shares his approach to building complex workflows and wizards, and explains how complexity bubbles up from naive routing approaches. I strongly agree with his demo: adding a real state machine drastically improves confidence and readability.

**What Expertise Looks Like by James Gray**

James, a friend from the Elixir Book Club, walked through how he and his team solved some nasty large-query problems. It's a good model for how to think through and solve big, messy problems.

***

With multiple tracks, there are plenty of talks I have not gotten to yet. I hope to pair them with lunches over the coming week.

I did not get much socializing out of the virtual ElixirConf, but I am going in person to [ExMex](https://exmexconf.com/) in Austin this November, and I'm looking forward to catching up with folks there.
