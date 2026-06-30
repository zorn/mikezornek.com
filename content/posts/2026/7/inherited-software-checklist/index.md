---
title: "Stabilizing Inherited Software: My First-Week Checklist"
date: 2026-07-01T01:07:10-04:00
description: "Inherited a live codebase with no one left who built it? Here's the checklist I run through in week one — before touching a single feature."
draft: true
pain: for a consultant adopting a new project, it can be overwhelming and not sure where to start
fix: provide a checklist for stabilizing live software during the first week of an adoption/handoff engagement
---

Not every [consulting engagement](/elixir-consulting/) starts with joining a team that's humming along. Sometimes it starts with a handoff: the developers who built the software have moved on, but the software itself is still live, still has users, and still needs to keep working. There's no team culture to learn -- there might not be much of a team at all. This is how two of my recent client projects went. 

The goal in week one on these projects isn't to improve anything. It's narrower than that: get to a place where you can react safely if something breaks. Everything below is in service of that one goal.

## Get the app running locally

You can't safely change what you can't run. This sounds obvious, but on inherited software it's rarely trivial.

- Get repo access (GitHub or wherever the code lives)
- Reproduce the dev environment exactly -- asdf-pinned versions, a Docker Compose setup, whatever the project actually uses
- Make sure you are using specific database versions, not just "latest." You'd be amazed what little bugs show up from a minor version mismatch

## Run the app as a user

Before touching the code, build a real domain understanding of what the software actually does for the people who use it.

- Take lots of annotated screenshots, ask questions as they come up
- Put those questions (and their answers) in a shared, durable place -- a Google Doc or, better, GitHub Issues/Discussions, so there's a paper trail and other people can chip in beyond whoever you happened to be on a call with
- Use this discovery work as an opportunity to create valuable artifacts: your questions, improved onboarding docs, etc. Future developers (and AI tools) benefit from the knowledge extraction you are doing
- Be deliberate as a team about where knowledge goes and why. I tend to prefer GitHub Issues and Discussions as they live next to the code, and are less likely to disappear. Also, searching a term in GitHub surfaces the related conversations, not just the code

## Explore the codebase

- Pick a feature and trace how it's actually implemented, end to end
- Document your questions as you go, and circle back to capture the answers
- If you have a peer or time with the previous developer available, have them walk you through their recent work

## Understand how the app is deployed and how releases work

This is the highest-stakes item on the list, and on adoption projects it's the one I prioritize most. If something breaks in production and you don't understand the release process, you can't react -- and reacting safely is the whole point of week one.

- Make a small, low-risk change and push it through the full release cycle yourself, start to finish, as early as you can
- Once you've been through onboarding yourself, look back at what you just did. What would have made it faster or clearer for the next person? Contribute that back to the docs

## Create learning projects

This project will almost certainly include some technology you're less experienced with. Name it explicitly rather than quietly muddling through. Ask others on the team (or in the broader community) for advice on a skill-up path, and give yourself room to actually follow it.

## Meet your peers

- Set up introduction calls -- try to talk to everyone, even if it's a short, purely social call. You'll be working with these people for a while; it's worth actually getting to know them
- Ask two questions in particular: what's working well on this project, and where are the opportunities for improvement

## Re-sync with whoever hired you

By this point you'll have a much more detailed picture of the environment you've stepped into than you did on day one.

- Set up a follow-up conversation with the person who hired you, or whoever you ultimately answer to
- Get your open questions answered
- Reaffirm and evolve a clear list of expectations and responsibilities. On some engagements I own the full stack end to end; on others I'm explicitly scoped to a specific area and asked not to touch the rest. Make sure that scope is actually agreed on, not assumed

## Why all of this, before any of the fun stuff

None of this is glamorous. It's not refactoring, it's not new features, it's not the kind of work that makes for an exciting commit history. But when it comes to inherited software, confidence comes first. You earn the right to improve something by first proving -- to yourself and to the team -- that you can be trusted to react safely when it breaks. Everything else follows from that.
