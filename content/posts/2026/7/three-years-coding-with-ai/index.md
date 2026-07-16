---
title: "My Notes on Three Years of Coding with AI"
date: 2026-07-16T13:08:11-04:00
description: Notes on how my use of AI has changed over three years, the Matt Pocock skills I've been trying recently inside LocalCents, and what's working and what isn't.
images:
  - posts/2020/6/book-dreaming-in-code/thumnb.jpeg
pain: the AI tooling changes so fast that it's hard to know if you're using it well, and most of us aren't comparing notes about what's actually working
fix: share the honest version of my own three years so a peer can measure it against theirs
tags:
  - ai
  - software-craft
---

I want to talk through how my use of AI has changed over the last three years. Not because I've got it figured out. I don't. But the tooling is moving fast enough that I don't think any of us can keep up on our own, and the way I've always sorted through a confusing stretch of this industry is by comparing notes with my peers.

So think of this as the version of that conversation I'd have with you if we grabbed a coffee. Here's what I've been doing, what's working, and what isn't.

## The slow start

For me, AI started to feel like a real thing around 2023, but I didn't use it much at first. The clearest artifact I have from that year is a [dumb little blog post where I had it write a rap song for Alexa](https://mikezornek.com/posts/2023/3/elixir-rap-song/). That was about the level of seriousness I brought to it.

In 2024 the first genuinely useful thing showed up: Copilot autocomplete inside VS Code. I started with it in my personal projects, then it followed me to my full-time job. That job ran on a locked-down machine with firm rules about what we were allowed to use, but they had an explicit contract with Microsoft, so everything went through Copilot. There was a lot of encouragement to experiment. In practice it mostly came out as autocomplete. Agents were starting to get a little bit of ground back then, but we weren't really leaning on them.

The other 2024 memory is from outside of work entirely. I [built a new gaming computer](https://mikezornek.com/posts/2024/12/new-gaming-pc/), which I hadn't done in a while, and I kept running into strange error codes and questions about things like configuring a Windows bootloader. I'd ask ChatGPT for advice. I'd call it about 50% successful at the time. But even when it was wrong, the vocabulary it handed me was usually enough to point me in the right direction, which turned out to be worth a lot on its own.

## Cursor, and learning to ask questions

Rolling into 2025, my main use was still mostly autocomplete. It was especially good at the repetitive stuff. I write a lot of test files, and my habit is to write out the test descriptions I care about, implement the first one by hand, and by the time I'm on the second, third, and fourth, autocomplete is quietly filling in the logic. Better still, it was following the little "zornisms" of how I like to write things.

The turning point that year was attending [CodeBeam America in San Francisco](https://mikezornek.com/posts/2025/3/code-beam-america-notes/). I came away with a much better sense of how people were actually using Cursor day to day, and I went home and started experimenting with it myself. Cursor was a nicer autocomplete tool, sure, but the part I got the most out of was the embedded chat window. It became a place to explore ideas, ask questions about the codebase, and generally poke around. It felt less like a code generator and more like a pairing partner I could ask a bunch of questions while I worked a problem out.

## The part that made me uneasy

Also in 2025, I started running into pull requests from peers that were clearly generated with AI, and I found that genuinely hard to deal with.

The PRs tended to be much bigger than I'd want. And reviewing them was awkward in a way I didn't expect. Normally I'd ask a coworker why they chose an approach, or whether they'd considered some alternative, but it felt strange to post that kind of question knowing they hadn't really written the code themselves. It didn't help that I'm often a part-time, asynchronous member of these teams, without a lot of shared hours to build the kind of trust where that conversation comes easily. It reinforced a bias I already had against generated code.

Around the same time I watched some [conference keynotes](https://www.youtube.com/watch?v=ojL_VHc4gLk), including ones from Chris McCord of the Phoenix project, where the demo was to hand a prompt to the tool, flip on all the dangerous permissions, and let it run loose in a sandbox. Kick it off at the top of the talk, do the talk, and reveal a working Tetris game in LiveView at the end. I know a lot of people loved that, and I kind of get why. It just didn't look like the work I actually do. If there's real value in a throwaway prototype, then fine. But it didn't match my sense of what software engineering is, or how much my own experience shapes the quality of what I build, and I walked away more skeptical than excited.

## Deciding I couldn't sit it out

As 2026 arrived, it became clear to me that I needed more hands-on time with these tools, whether I liked the vibe of them or not. It was a fairly plain bit of self-reflection: if I want to keep working as a software engineer, I can't really picture a version of the next few years where I opt out of AI entirely and still find steady client work.

Interestingly, my last two significant client projects were both for non-technical founders who didn't have strong feelings about AI when I signed on. They didn't come in with opinions about how I used it. I made a point of being clear anyway, that I was using Cursor, and later Claude, and I put that in writing in my contracts. And even then, for a long stretch, I wasn't using it to generate much code. I used it to understand things: asking questions about the codebase, reading through crash logs, digging into performance issues. Introspection, not production.

## Getting serious with Claude Code

Around May of 2026, after grinding through the winter doldrums, I decided to actually push on this. I installed Claude Code and started tinkering more seriously.

Even early on I was careful about letting it write code. Some of my first settings files flat-out disallowed Claude from committing, because every commit is something I intend to read. I've loosened that a little since then. I let it commit to feature branches now, but I'm still reading the code closely. The "turn it loose and don't look" style just doesn't sit right with my quality standards.

Those early Claude days still leaned more toward introspection than generation. But that balance has flipped over the last eight weeks or so, June into July, as I decided to run more experiments. The main one was to take a little side project I'd been poking at, [LocalCents](https://github.com/zorn/local_cents/), and use it as a place to really lean on AI code generation, and more specifically on AI *workflows*, to turn ideas into working code.

## Borrowing someone else's workflow

Here's a small evolution worth naming. Back on Cursor I never invested much in maintaining a proper agents file. We had one at work that a coworker built, but I didn't put much of myself into it. When I moved to Claude, I made a point of writing a better one. The one wrinkle I added is that I keep my content in `AGENTS.md` and symlink `CLAUDE.md` to it, so if I keep hopping between tools, they all find the same starting point.

Once I wanted to get more serious, the natural next step was skills. A skill is basically a prepackaged bit of markdown describing the work to be done, sometimes with scripts alongside it, sometimes just plain prose. Rather than invent my own from scratch, I went looking for people who'd already been at it. Two collections stood out.

One thing worth saying before I go further: skills are also a real security vulnerability. You're letting a third party inject their own instructions, and sometimes their own commands, straight into your AI's context. If you're not careful about whose skills you install and what's actually in them, you're opening yourself up to a lot of problems.

One collection I looked at was [superpowers](https://github.com/obra/superpowers), from Jesse Vincent, which I'd seen some proof-of-concepts use at work. It's powerful and very opinionated: the skills fire automatically and march you through a fixed workflow. It wants to run the show its own way.

The other was [Matt Pocock's skills](https://github.com/mattpocock/skills), and that's the one I connected with. It lined up better with the engineering vocabulary and practices I already use, and it leans on skills I invoke deliberately (grill me on this, turn it into a spec, break it into tickets) rather than ones that drive on their own. I'd rather stay the one holding the wheel, with skills that help me execute my own engineering point of view.

## The skills that are working

Matt has a lot of skills and I haven't touched all of them, but let me talk about the ones I get real value from.

The big one is `/grill-with-docs`. You bring it an idea you want to build, it reads through your existing code and setup, and then it interrogates you with follow-up questions to fill in the blanks. What I like is that it leans on practices I already respect: [architectural decision records](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions), and the idea of a [ubiquitous language](https://martinfowler.com/bliki/UbiquitousLanguage.html) from domain-driven design. As you work through it, you're also pulling in related skills like domain modeling, and the session leaves behind real artifacts. Additions or edits to your ubiquitous language. Decision records that capture the things that are hard to change or that had interesting trade-offs worth remembering.

From there the flow usually runs into skills like `/to-spec` and `/to-tickets`, which break the work down further. That's another habit I'm glad to see baked in, this push toward small, well-scoped units of work.

Now, Matt wants small units for a specific reason. He's aiming to hand each one to an agent running unattended, and small pieces keep the context window tight and, as he puts it, out of "the dumb zone," which is roughly anything past 40% of the token budget. My reason is simpler and a little more old-fashioned: I want small units because I'm still reading all of the code.

I also lean on his `/research` skill, which usually kicks off as a subagent. In the middle of some other work I can say "go research this," point it at a couple of sources I trust or just describe them, and it goes off and comes back with a written artifact: here's what I looked at, here's what I found. It's been great for settling my own coding-style questions. Just the other day I was staring at a LiveView hook event where I had a plain `params` argument, wondering whether it should be `book_params` or `expense_params`. I sent research off across community docs, real projects, and generators, and it left behind [a written note on what the norm actually is](https://github.com/zorn/local_cents/blob/main/docs/research/params-variable-naming-convention.md), which then shaped my choice. I've done the same for documentation conventions, just trying to understand how the community phrases inline docs so I'm following the grain rather than fighting it.

## Where I do things differently

Matt and a chunk of the people using his workflow are really into unattended, away-from-keyboard work. He's got a tool called [Sandcastle](https://github.com/mattpocock/sandcastle) for orchestrating a whole collection of agents to implement a spec across a batch of tickets. That's not where I am. 

The few times I've tried running multiple agents at once, using git worktrees to keep them apart, it felt pretty clunky. So while worktrees are clearly part of where this is heading, I haven't found a version of the multi-agent flow that feels good to me yet.

Most of my work is still a single agent in a single session. I talk through the problem, I watch it build, and then I do a lot of manual code review. I comment on the PR the same way I would on a human coworker's, both before and after, and then I hand it right back to the agent: here's the feedback, address this. Sometimes that's a change I want. Sometimes it's just a question about why it did something a certain way.

I also lean on two layers of automated review before I dig in myself: a local pass with Claude, and the Copilot review that's wired into the pull request. The Copilot one earns its keep. It regularly flags things worth addressing, both structural issues and outright crashing bugs.

Underneath all of it, I still have strong opinions about what the code should be. I'll write up the specific guardrails in a follow-up post soon™, but the short version is that I'm constantly nudging the tool with extra CI checks and coding-standards files that spell out what I want. Some of it is small. When you write an Elixir typespec, [name the arguments](https://github.com/zorn/local_cents/blob/ebc46e1ee9bcf24378b1d1ccc503db98ae5de0e7/CODING_STANDARDS.md?plain=1#L47-L70) instead of leaving a row of anonymous `String.t(), String.t(), String.t()`. Some of it is about naming conventions. A Phoenix component might have a simple `title` attribute where passing a string is obvious. But a `date` attribute is trickier: if it's called `date`, you'd expect a date value, and if you actually want a formatted string you need a convention for it. In LocalCents that convention is a `_display` suffix, so `date_display` tells you to pass the formatted string rather than the raw date.

Yes, this is nitpicky, and how much you care depends on the lifespan of the project and how many people touch it. For me, I value readability and consistency, and I've come to think the *current* state of the codebase matters more than ever. A human reviewer used to carry the context that module A was the old way and module B is the new, so follow B. An AI doesn't carry that unless you are very explicit. Left alone, it'll find the old pattern and treat it as the house style. So keeping the codebase aligned with what I actually consider [good code](https://mikezornek.com/posts/2026/7/what-is-good-code/) has become a bigger part of the job, not a smaller one.

## The skill I'm not sold on, and making it mine

Not everything has clicked. The one Matt skill I haven't enjoyed is the `/code-review` one. Structurally I don't have a problem with what it looks for. My issue is what you're left with when it finishes: not a clear, scannable to-do list of things to fix, but a long, paragraph-style collection of findings. It's hard to scan, and hard to turn into clear feedback, and it's near the top of my list of things to change.

Which gets at something Matt himself talks about, including in [his talk on software fundamentals](https://www.youtube.com/watch?v=v4F1gFy-hqg). A curious, opinionated developer can get a lot out of a public community skill to get started, but will probably end up building their own. I fully expect that. I'd be surprised if, three to six months from now, I'm still running his skills one-for-one. I can already feel myself wanting to fork pieces of them to fit my own workflow and even my own vocabulary.

The vocabulary thing is a good example. For years I've kept a folder called `decisions` in my projects. Matt's skills call these ADRs, architectural decision records. It's a tiny thing, but I really do prefer just saying "decision." Wrapping it in a heavy, formal term puts a weight on the file that I don't think belongs there, and I suspect it quietly discourages people from writing them. I want people documenting their trade-offs and considerations, and I don't want the ceremony of an acronym in the way. Every time I say "ADR" my brain has to spend a beat unpacking the three letters. I'd rather just say "decision," or "decision document," or point at the "decisions folder."

> As a counterpoint to myself: one thing you gain by embracing the acronym ADR is that it carries a lot of built-in software-engineering assumptions the LLM will pick up on, where it might read a plain word like "decision" more generically.

## What I still use AI for most

For all the talk about code generation, the biggest value I get out of AI is introspection. Understanding how an existing system works. Chasing down a performance problem. Having it brainstorm the unhappy paths of software specifications.

## What I want to try next

I want to keep working through more of Matt's skills. I've given a good chunk of them real time on LocalCents, but there are others I haven't gotten deep into. The one I'm most interested in is `/wayfinder`, which he describes as `/grill-with-docs` on steroids. The way I understand it: `/grill-with-docs` is a single session of back-and-forth that leaves you with a couple of artifacts. `/wayfinder` is a more thorough investigation, where you build out a larger decision-and-research tree as GitHub issues, and only once the map is plotted do you turn it into a proper spec and tickets. The research nodes and prototype nodes are what intrigue me most, the idea of having it sketch a few throwaway prototypes to compare three or four different takes on a UI. My current work is still finishing an MVP-level epic, but once that's wrapped I want to give `/wayfinder` a serious try.

Beyond that, and beyond just going deeper on Claude Code's more advanced features, two things are on my mind. I want to look into the [Pi](https://pi.dev/) harness, which as I understand it is more of an open-source, vendor-neutral coding harness. And longer term I'm really interested in what I can do with local models. I'm uneasy about being this dependent on a third party for something so central to my work, and I'd like to see how far local models can take me. That needs beefier hardware than my M1 Max, so it's a slower experiment, but it's one I want to keep chipping at.

Related to that swapping, I want to add some observability to my agent sessions. Right now I don't keep any real record of what a given session cost or how it ran. I'd like to start tracking metadata over time: the runtime, the token cost, which models I used, and some way to categorize the kind of work. Part of it is just wanting a clearer picture of what all this actually costs me. But it also lays a foundation for the harness and model swapping I just mentioned, because those are exactly the numbers that should drive those calls, and right now I'm mostly going on feel.

One last small thing I never expected to care about: I've loved using voice entry in Claude Code to talk through changes. It's been powerful enough that I now find myself wanting to dictate everywhere, GitHub issue comments and all, so I'm looking into some assistive tools to do more of it across the board.

If you'd like to hear other people's notes and not just mine, German Velasco has been recording a series of pairing conversations where developers walk through their actual AI workflows. They're a good companion to this post: [Pairing with Claudio Ortolina on his AI Workflow](https://www.youtube.com/watch?v=wyxksxePBCU) and [Pairing with Tomasz Tomczyk on his AI Workflow](https://www.youtube.com/watch?v=9c3J4J8U6a8).

So those are my notes. I'd really like to hear yours. What's working in your setup, what did you try and drop, what are you seeing that I'm not? [Let me know.](/contact/)
