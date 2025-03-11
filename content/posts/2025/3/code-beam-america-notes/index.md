---
title: "Conference Notes: CodeBEAM America (San Francisco) 2025"
date: 2025-03-10T09:56:13-08:00
description: I had a great time at the CodeBEAM conference. The content was high quality and well presented. Here are some of my notes and links.
images:
  - posts/2025/3/code-beam-america-notes/codebeam-banner.jpg
---

After a run of bad luck where I had to cancel Elixir-related conferences at the last minute (once because of the smoke storms that hit NY, and once because I got COVID before the conference), this week I enjoyed some time at [CodeBEAM America 2025 in San Francisco](https://codebeamamerica.com/).

I had a great time at the conference. The content was high quality and well presented. The in-person attendees totaled around 100 people, with another 150 online. I got some well-enjoyed real-world face time with a few old friends, online book club peeps, and maybe even some future clients.

## Notable Talks

A few notable talks that landed for me:

* Jenny Bramble and Adrian Dunston did an excellent talk, "Detective Hat: Investigating Production Issues," reviewing how to approach production incidents, communicate with your peers, question assumptions, and ultimately learn from the experience. The pair was well prepared, and the content well delivered.
* James Arthur code dropped [`Phoenix.Sync`](https://hexdocs.pm/phoenix_sync/readme.html) built on the back of [ElectricSQL](https://electric-sql.com/). I recently learned of Electric while [catching up on the Local-first Conf videos](https://www.youtube.com/watch?v=ZlHWSpIYixk) just a few weeks ago. It was cool to learn that Electric is built using Elixir back then, but seeing some Phoenix-specific tooling drop was even more exciting. Kicking these tires will be high on my priority list.
* Eric Saxby had a talk called "Acceptable Upgrades," jam-packed with great code organization and testing strategies. I captured many handwritten notes, but the last one was to get the slides, as I could not capture them all.
* Jason Axelson followed this up with another test-focused talk titled "Choosing an effective testing structure," which had a bunch of great tips and library suggestions.
* Digit did a talk titled "Nerves ❤️ Flutter" reviewing how the SmartRent Thermostat/Smart Home hub was built, and it was awe-inspiring. The [`nerves_flutter_support`](https://github.com/nerves-flutter/nerves_flutter_support) repo was made public as well to help people build on this.
* Mitchell Hanberg gave us an update on the new Elixir Language Server, now named [Expert](https://expert-lsp.org/). The now [blessed official team](https://elixir-lang.org/blog/2024/08/15/welcome-elixir-language-server-team/) has been hard at work building a new language server foundation built on the best of the previous three projects. A release still feels a few months away, but the update and teaser were much appreciated.
* Kevin Barrett and Sloane Perrault did a talk, "CRDTs and the BEAM: Eventual Consistency Through Acronyms." Having CRDT in the title, this was a session I've had circled on my calendar for months. The talk was an excellent review of how they are utilizing CRDTs to power the delivery of [screen.garden](https://screen.garden/), which allows real-time collaboration of standard Obsidian Markdown.

## Conference Format

* The talks were a mix of 40-minute and 25-minute sessions with ample time for hallway track discussions. A great balance.
* There was a great 40-minute block each day for "Birds of a Feather" sessions. Early in the day, people voted on topics, and then the round tables where we ate lunch were signed for spontaneous discussions. I attended a table on WebAssembly, learning about [`wasmx`](https://github.com/wasmx) on the first day, and then a table talking about [Ash Framework](https://www.ash-hq.org/) and [Igniter](https://hexdocs.pm/igniter/readme.html) on the second day. 

## Vibes

* While the majority of attendees seemed work-aligned with Elixir, there was also a healthy mix of Nerves, Gleam, and Erlang folks.
* Everyone was very friendly and welcoming. There were people who had history and clumped together, but at the same time, I observed many people making space for new people to enter the circle and join in.
* Presenting in pairs was popular and more so impressively executed. Everyone seemed well in sync with their presenting partner.
* The chaos of the real world was not front and center in most talks (which is fine with me as I enjoy the escape), but it did leak through at times. I recall a specific moment when Ingela Anderton Andin was doing an OTP update. She was remote, presenting from her home in Sweden over video. There was some chatter at the end about how the conference would love to see her return in person in the United States in the upcoming year. There was an uneasiness in her reaction. Acknowledging without fully verbalizing the state of international relations. Seeing the forthcoming calendar of BEAM-related events, many happening in Europe, I had a similar response. I don't know if United States citizens will be welcome there in 6 months.

## Followup Learning Projects

* Related to some discussion and possible project work, I bought the [Ash book](https://pragprog.com/titles/ldash/ash-framework/) and started reading it on the plane ride home. I've worked with Ash before, but using the book to refresh my memory. I may even consider porting some of the [Flick](https://github.com/zorn/flick) domain to Ash as a space to play around.
* People were hyped about [Cursor](https://www.cursor.com/) well over GitHub Copilot for AI codegen things. I need to experiment more with it.
* Need to tinker with `Phoenix.Sync`.
* I totally forgot about [`burrito`](https://github.com/burrito-elixir/burrito). It was mentioned during Digit's talk, and I should totally check it out in relation to building local-first software. 

> Burrito is our answer to the problem of distributing Elixir CLI applications across varied environments, where we cannot guarantee that the Erlang runtime is installed, and where we lack the permissions to install it ourselves. In particular, we have CLI tooling that must be deployed on-premise by consultants into customer environments that may be running MacOS, Linux, or Windows.

***

While I disliked the travel, and boy was I grumpy after the travel day on Wednesday, the conference was a tremendous success. This was my first time at a CodeBEAM event, and I highly recommend it.
