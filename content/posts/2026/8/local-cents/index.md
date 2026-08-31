---
title: "Building LocalCents: A Local-first Expense Tracker with Automerge CRDTs"
date: 2026-08-31T09:33:15-04:00
description: "An educational side project building LocalCents, a local-first expense tracker, and what I learned wiring Automerge into Elixir, Phoenix, and Tauri, including how to surface sync conflicts to users."
tags:
  - elixir
  - rust
  - side-projects
  - ai
  - apple
---

I previously blogged about [What is Local-first Software?](/posts/2025/2/what-is-local-first-software/) back in February of 2025. While my interest has been steady, I never had a real opportunity to get my hands dirty with the technology. Over the past few months, I've been tinkering on an educational side project, a simple expense tracker called [LocalCents](https://github.com/zorn/local_cents/), and have some interesting things to share.

## Local-first Software

I won't rehash the entirety of [my previous blog post](/posts/2025/2/what-is-local-first-software/), but to put it succinctly, local-first software is all about empowering the user. It values:

- local data, and thus quick responses to user commands
- using multiple devices to accomplish your work, and the deterministic syncing tech that makes it work (even during long offline separation)
- seamless collaboration with others without a centralized server
- long-term usage through true data ownership

Many CRDT (conflict-free replicated data type) tools work toward these ideals, but the one I follow most closely is called [Automerge](https://automerge.org/).

Automerge comes from the same folks at Ink & Switch who wrote [the first essay](https://www.inkandswitch.com/essay/local-first/) that coined the term _local-first_. Automerge is a CRDT persistence layer written in Rust. It compiles to WASM and has native support for JavaScript as well as other languages and frameworks.

## LocalCents, a local-first expense tracker

My project LocalCents is an [Elixir](https://elixir-lang.org/) / [Phoenix](https://www.phoenixframework.org/) application (my core competency). I bundle it into a macOS application binary using [Tauri](https://tauri.app/) (a Rust-based app wrapper library and ecosystem) and use [ElixirKit](https://github.com/livebook-dev/elixirkit) to send messages back and forth between Elixir and Tauri/Rust. To get Automerge working inside my Elixir binary, I use [Rustler](https://github.com/rusterlium/rustler).

Here are some screenshots of LocalCents in action on macOS:

{{< figure src="1-library.png"
   alt="The LocalCents Library window listing two expense books, 'Business Expenses' and 'Family Expenses,' each with a last-updated timestamp and an Open button, above a 'New Book' button."
   caption="Each document is a &ldquo;book.&rdquo; You can have multiple books; each is a separate document." >}}

{{< figure src="2-expense-listing.png"
   alt="The 'Business Expenses' book showing a list of expense rows, each with a date, description, an optional category pill such as 'Coworking Space' or 'Office Supplies,' and a dollar amount, above 'Categories' and 'New Expense' buttons."
   caption="A list of expenses in the app." >}}

{{< figure src="3-expense-editing.png"
   alt="The expense list dimmed behind a slide-out 'Edit Expense' pane with fields for date, description, cost, and category, plus 'Delete' and 'Save' buttons."
   caption="An editor pane for an expense." >}}

At face value, not a ton of interesting things are happening here. The repo contains a `./scripts/two-peer-demo.sh` script that sets up a more interesting scenario.

The long-term idea is that LocalCents would run on multiple devices or even a website. This script simulates this by running two instances of the app: one as a macOS application binary and another as a web server accessible via a browser.

As you make changes on one device, those changes will broadcast over WebSocket to other connected peers, who apply them immediately. To help demonstrate collisions, the macOS app has a `Developer > Enable Offline Mode` toggle. With the macOS app offline, you can then make changes that will collide, like changing coffee to $3 on macOS and $5 on the web.

{{< figure src="4-two-instances-of-local-cents.png"
   alt="The LocalCents macOS app on the left, titled 'Sync Demo (Offline),' beside a browser window on the right running the same book at localhost:4001. The shared expense list matches except for the Coffee row, which reads $3.00 in the offline macOS app and $5.00 in the browser." >}}

Once you bring the macOS app back online, the changes will be exchanged and a winner chosen.

Aside: This is a key design aspect of CRDTs. When a conflict happens, a deterministic winner must be chosen. In the case of Automerge, the winner is determined through an `operation_id` (counter, actor) which is a kind of [Lamport clock](https://en.wikipedia.org/wiki/Lamport_timestamp).

One of the areas I was most interested in while working on LocalCents was whether and how I might surface these conflicts to users. There are lots of high-risk domain changes where, if there were conflicting edits across devices or users, I would want some audit trail. For LocalCents, this takes the form of a notification bell warning.

{{< figure src="5-edit-conflict-warning.png"
   alt="A notification bell in the top corner of the app shows a red badge with a count of 1. An open 'Synced changes' popover lists an auto-resolved item: 'Synced edits to Cost — LocalCents kept one.'" >}}

Upon interacting with the bell, you are sent to a new _Conflicts_ tab of the edit pane where you can observe the collision, the value chosen, and the value dismissed. If you prefer the dismissed value, you can choose it to remain as the real value.

{{< figure src="6-edit-conflict-chooser.png"
   alt="The 'Conflicts' tab of the Edit Expense pane for the Cost field. A 'Kept by LocalCents' card shows the value 5 from one device; an 'Other edits' card shows the value 3 from another device with a 'Make this the value' button, and a 'Dismiss conflict' link below." >}}

Another collision can come in the form of outright deletion. For Automerge, the delete always takes precedence, but again, I offer a warning to a user who has edited an entity that was deleted by another while offline. They can choose to revive the deleted entity or accept its removal.

{{< figure src="7-delete-conflict-warning.png"
   alt="The 'Synced changes' popover shows a 'Needs your decision' item for the Coffee expense: 'Deleted on another device — your edit is still here,' with 'Restore' and 'Keep deleted' actions." >}}

## Final Thoughts and Observations

LocalCents was dreamed up as an educational side project to tinker with Automerge, and it has come to a close. Some final observations:

- Automerge is really cool tech, and since it is built using Rust / WASM, it can be integrated into a variety of environments. The problem space we chose was pretty basic, and there are some concerns, such as access controls, that can be harder to build into a distributed tool like Automerge. Ink & Switch are working on this through [Keyhive](https://www.inkandswitch.com/project/keyhive/), though it feels a little bleeding edge.
- Tauri seems equally helpful if you need to do something cross-platform. My biggest red flag would be its iOS support, which still [relies on CocoaPods](https://tauri.app/start/prerequisites/#ios) (which [is deprecated](https://blog.cocoapods.org/CocoaPods-Support-Plans/)). I want to see them transition to newer Swift library toolkits. Also, if you are looking to build as close to a native-feeling app as possible, you'd probably use the many Tauri tools to implement features like [system-level context menus](https://v2.tauri.app/learn/window-menu/) (in my project I faked them with CSS).
- While I did not go into detail, I used [a full GenServer architecture](https://github.com/zorn/local_cents/blob/main/docs/book-runtime-architecture.md) to manage the Automerge document binary. So much of my day-to-day is simple CRUD through a context powered by PostgreSQL/Ecto. It was fun to have built something more BEAMy.
- This project used ElixirKit to talk back and forth between the BEAM and Rust, but [there](https://github.com/elixir-desktop/desktop) [are](https://github.com/burrito-elixir/burrito) [many](https://github.com/GenericJam/mob) [others](https://github.com/bartblast/hologram) you can look to for inspiration.
- This was also the first time I really truly embraced [Phoenix Storybook](https://github.com/phenixdigital/phoenix_storybook) and managing an isolated component system (internally called `Bond`). It worked, but I recommend extracting components rather than building them out in advance, especially early in the project. I found I built things I did not use and then had to remove them.
- I used AI a ton in this project. It was a good learning experience (and fueled many other [blog posts](/tags/ai/)), but it did take away my true understanding of how Automerge and Rust work. I knew enough to get the demo to work but fear the loose ends I don't see. For comparison, when I see non-Elixir people using AI on Elixir projects I contribute to, tons of Elixir norms are broken. How many am I breaking in my work here for Automerge and Rust?

## What's Next?

[LocalCents](https://github.com/zorn/local_cents/) was intentionally sketched out as a short-term educational side project. I paused some of my OpenTelemetry research to focus on a single side project, and so I may rekindle that in the near term. I'm also starting to dream about a proper product again. I could imagine a future where I lean on Automerge for such a thing, and it could be in the accounting space, which I frequent in my own work as well as in client work. To support that, I'm reading [an early draft](https://www.youtube.com/watch?v=vOhC1y-1Lz0) of The Mom Test (second edition), which is a great book on customer research.

If you have any questions about the project, [let me know](/contact), and check out the [repo on GitHub](https://github.com/zorn/local_cents/).
