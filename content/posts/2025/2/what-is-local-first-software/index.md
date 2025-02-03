---
title: "What is Local-first Software?"
date: 2025-02-03T09:11:28-05:00
description: We believe that data ownership and real-time collaboration are not at odds with each other. It is possible to create software that has all the advantages of cloud apps, while also allowing you to retain full ownership of the data. We call this type of software local-first software.
images:
  - posts/2025/2/what-is-local-first-software/offline-mode.jpg
---

Local-first software is a term that came out of a research lab called Ink & Switch back in April 2019. In a [wonderful paper](https://www.inkandswitch.com/local-first), they explored some ideas that resonated with me.

In today's post, I want to talk a bit about the problems local-first software solves and explore an abbreviated definition of how to identify local-first software. I'll close with some resources to learn more and a quick review of my next side project.

Let's start by talking about the problem.

## The Problem

Over the last twenty years, the balance of power between software users and software providers has become incredibly one-sided. 

Modern companies, through the software they provide, have tremendous leverage against their users. This power shift comes primarily through ubiquitous centralized data. The outcome of this is that the user is disenfranchised through loss of data sovereignty, privacy, security, and long-term software availability. 

Why did users give up this power so easily? For collaboration. Collaboration is the killer feature of the modern web, and frankly, it was much easier to build when we agreed to centralize the data.

I can only speak for myself, but I don't think we as a whole really knew what we were building in those early days. We used language like "connecting people," and it was never about gatekeeping. But as collaboration and social networking features started to mature, we found ourselves in a world that was off balance.

## The Solution

Local-first software aims to describe an approach to software that better empowers users. From [the paper](https://www.inkandswitch.com/local-first/):

> We believe that data ownership and real-time collaboration are not at odds with each other. It is possible to create software that has all the advantages of cloud apps, while also allowing you to retain full ownership of the data, documents and files you create.
> 
> We call this type of software **local-first software**, since it prioritizes the use of local storage (the disk built into your computer) and local networks (such as your home WiFi) over servers in remote datacenters.

Later in [a conference talk](https://www.youtube.com/watch?v=NMq0vncHJvU), Martin Kleppmann provided a more succinct definition:

> In local-first software, the availability of another computer should never prevent you from working.

He expanded:

> **If it's local-only, it's not local first.**  
> (Local-first implies multiplayer, or at least multi-device among a user's devices)

> **If it doesn't work with the wifi off, it's not local-first.**  
> (Local-first implies offline support.)

> **If it doesn't work when the app developer goes out of business and shuts down their servers, it's not local-first.**

For more, I highly recommend reading the [original paper](https://www.inkandswitch.com/local-first) and watching [the recent conference talk](https://www.youtube.com/watch?v=NMq0vncHJvU). 

## The Technologies That Seeds this Dream

If you have ever been involved in data distribution, data integrity, syncing, merging, resolving conflicts, or any of the other nightmares that surround this story, you might read the definition of local-first and walk away thinking it's a pipe dream. Yes, this is a very challenging technical problem, but exciting advancements exist in Conflict-free Replicated Data Types (CRDTs).

Wikipedia [summarizes](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type):

> In distributed computing, a conflict-free replicated data type (CRDT) is a data structure that is replicated across multiple computers in a network, with the following features:
> 
> 1. The application can update any replica independently, concurrently and without coordinating with other replicas.
> 2. An algorithm (itself part of the data type) automatically resolves any inconsistencies that might occur.
> 3. Although replicas may have different state at any particular point in time, they are guaranteed to eventually converge.

Over the last decade, research and development on these algorithms have matured, making real-world production deployments possible.

Multiple implementations of these algorithms exist, with [Automerge](https://automerge.org) being a popular starting point.

If you want to learn more about Conflict-free Replicated Data Types I recommend watching [CRDTs and the Quest for Distributed Consistency](https://www.youtube.com/watch?v=B5NULPSiOGw) and the follow up [CRDTs: The Hard Parts](https://www.youtube.com/watch?v=x7drE24geUw)

To be clear, local-first does not require specifically CRDTs, nor does using CRDTs make your software local-first.

## Why this Excites Me

In my senior years, I have become very cynical and negative about the technical industry I participate in. Overall, I question whether all of this has made our lives better. When I compare the positive and the negative, I have trouble finding balance.

I am also a realist, understanding that I am a grain of sand on the beach of civilization. I try to focus on the things I can positively impact and not get overwhelmed by the things outside my control.

Thinking about my work, I align with the problems and solutions local-first software promotes. When I consider how I want to spend my day coding, do I want to code yet another centralized system some private equity firm can crunch and mold to its will and profits above all others? Or do I want to contribute, even a small slice, to the creation of long-lived software that empowers users?

## What's Next?

With work on [Flick](https://github.com/zorn/flick) slowing down, I'd like to define my next side project, and I think it will be a local-first research project. I want to define a time box and outline experiments and prototypes to test out some of these ideas and see how they can work in practice. In the end, I hope to have a software deliverable of some value and a series of blog posts explaining what I've learned along the way. I'm still shaping what this will be, but I thought I'd start the journey with a definition of local-first.

## Resources

- [Local-first software, You own your data, in spite of the cloud](https://www.inkandswitch.com/local-first/).
- [CRDTs and the Quest for Distributed Consistency](https://www.youtube.com/watch?v=B5NULPSiOGw)
- [CRDTs: The Hard Parts](https://www.youtube.com/watch?v=x7drE24geUw)
- [The past, present, and future of local-first - Martin Kleppmann (Local-First Conf)](https://www.youtube.com/watch?v=NMq0vncHJvU)
- [Automerge](https://automerge.org/)
- [localfirst.fm, a podcast about local-first software development](https://www.localfirst.fm/)
