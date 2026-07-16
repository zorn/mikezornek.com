---
title: "Pitch Three Years of Evolving Ai Workflows"
date: 2026-07-16T10:33:48-04:00
description: something tweet like
images:
  - posts/2020/6/book-dreaming-in-code/thumnb.jpeg
draft: true
pain: 
fix: 
---

## Raw notes (to be rebuilt)

### 2023 — AI starts to get serious

- AI started to become serious for me around 2023. Didn't use it too much in the beginning.
- Made a kinda dumb little blog post where I had it write a rap song for Alexa. https://mikezornek.com/posts/2023/3/elixir-rap-song/

### 2024 — Copilot autocomplete + ChatGPT as a helper

- Started using Copilot autocomplete inside VS Code. First in personal projects, then later at my full-time career job.
- The career job was on a very isolated computer with firm rules about what systems we could use. They had an explicit contract with Microsoft, so everything went through Copilot.
- They encouraged a lot of experimentation, but it mostly ended up being about autocomplete. Agents were starting to get a little ground back then, but we didn't really use that much.
- Another 2024 use: building my gaming computer. https://mikezornek.com/posts/2024/12/new-gaming-pc/ Hadn't built a computer in a while; ran into bizarre error codes, had questions about configuring a Windows bootloader. Asked ChatGPT for advice. About 50% successful at that point. Even when it wasn't successful, the terminology it gave me was usually helpful enough to steer me in the right direction.

### 2025 — Autocomplete matures, then Cursor (CodeBeam America)

- As 2024 turned into 2025, main use case was still mostly autocomplete. Particularly helpful for repetitive chunks of code.
- Example: I write a lot of test files. I'd start by writing out the different test descriptions I was interested in, build the implementation of the first test, and by the second/third/fourth, autocomplete was particularly helpful at filling out the test logic — and following the "zornisms" of my particular coding style.
- Big moment: attending the CodeBeam America conference in San Francisco in 2025. https://mikezornek.com/posts/2025/3/code-beam-america-notes/ Walked away with a deeper understanding of how people were using Cursor. Came home and immediately started experimenting with Cursor more myself.
- Cursor was a better autocomplete tool, but it also had the embedded chat window. Got a lot of value out of that for exploration of ideas, asking questions about the codebase, finding out information. As much about a pair-programming-partner style — asking lots of questions while working through the problem.

### 2025 — First friction: reviewing peers' AI-generated PRs

- As 2025 continued, I started seeing pull requests posted by peers that were clearly AI-generated. This was a real challenge.
- The PRs tended to be way larger than I'd have liked. Hard to review. Normally I'd ask someone why they chose a particular approach, or whether they'd considered other options — but it felt awkward to post that knowing they didn't write the code themselves.
- Compounding it: I'm a part-time, asynchronous member of the team. Not a lot of time overlap with these people, no deep shared understanding of what we're doing. Found it particularly challenging. It reinforced a personal bias against generated code.

### 2025 — The "let it run loose" demo that didn't land for me

- Around this time (2025) I remember seeing keynotes from Chris (of the Phoenix project) demonstrating tooling he'd built: throw in a prompt, turn on all the dangerous permissions, and let the bot run loose and build something (e.g. a Tetris game in Phoenix LiveView). He'd kick off the demo at the start of his talk, do his talking, then show what the AI had built at the end.
- I personally found that demonstration not exciting. It didn't fit into the day-to-day work I do.
- My thinking: if there's value in building a throwaway prototype, maybe this could be good — but it didn't align with my sense of what software engineering really is, or how my personal experience influences the quality of the things I build. Walked away from that demo not particularly excited.

### 2026 — Deciding I had to go deeper (and doing it on client work)

- Rolling into 2026, it became apparent I needed to do more exploration into these AI tools. A personal introspection: if I'm going to remain in the software industry as a software engineer, I need more hands-on time with these tools.
- Found it very challenging to envision a future where I could choose complete AI avoidance and continue to find active client work.
- Surprisingly, the last two significant client projects have both been for non-technical founders who didn't have a particularly strong feeling about AI when I took the job. At the start of those projects they didn't have a lot of opinions about how I used AI.
- I was very clear in expressing it: I am using Cursor, and later, I am using Claude. Needed to make that clear in my legal contracts.
- Even then, for a long time I wasn't using it to generate lots of code. More for introspection — asking questions about the codebase, looking into crash logs, investigating performance issues. [note cut off: "Um, you..."]

### 2026 — Getting serious with Claude Code (May → present)

- Around May 2026, after working through the doldrums of winter, I started to get more serious about experimentation. Installed Claude Code and started to tinker with it more.
- Even in the early days I was very careful about letting it generate code. Early settings files basically disallowed Claude the ability to commit — because every commit is something I'm going to read.
- I still kind of do that, though I now let Claude commit to feature branches, but I'm still aggressively reading the code. People who just YOLO code don't align with my vision / philosophy / values.
- Those early Claude days still leaned more toward introspection than code generation. But that's flipped over the last ~8 weeks (June into July).
- During this time I wanted to increase the volume of experiments. One plan: take a little side project I'd been tinkering with — LocalCents ("local sense") — and really start using AI code generation, and more specifically AI *workflows*, to convert my idea into actual code.

### 2026 — AGENTS.md, then getting serious about skills

- Evolution of my use with Claude: when I was on Cursor, I didn't invest a lot of time into a really proper agents file. We had one at work built by a coworker, but I didn't spend much time on it.
- As I started working with Claude, I made a point to spend more time on a better agents file. The one specialty: I store my content inside `AGENTS.md` and symlink `CLAUDE.md` to it — so if I keep jumping between different AI tools, they'll all find that starting point.
- When I decided to get more serious, a natural next step was thinking about skill use. Skills = a prepackaged markdown phrasing/explanation of the work needed to be done. Sometimes a skill has scripts alongside it; some are just plain markdown files.
- Wanted to get more serious with skills, so I looked around to piggyback on people who'd already been doing this (skills have been around a little while). Found two:
  - **superpowers** (https://github.com/obra/superpowers) — some POCs at work were using it. Seemed more like you install it and don't think about it much. More set-it-and-forget-it / vibe-coding style.
  - **Matt Pocock's skills** (https://github.com/mattpocock/skills) — I was more interested in this. Better aligned with the engineering vocabulary and practices I was already using. Matt's were also much more self-invoked.
- I was way more interested in creating/using skills that help execute an engineering perspective, rather than the "set it and forget it and walk away" style.

### 2026 — The Matt Pocock skills I actually get value from

- Matt has a lot of skills; I haven't been using all of them. Want to talk specifically about the ones I get a lot of value out of.
- **Grill with Docs** — a skill/workflow that has the AI present you with a lot of questions to fill in the blanks. You come to the skill with an idea you want to build; the AI browses your existing code structure and environment, then comes up with follow-up questions to fill in the blanks.
- What I really like about Grill with Docs: it piggybacks on community engineering practices like Architectural Decision Records (ADRs) and ubiquitous language from Domain-Driven Design. As you work through it, you're also working with skills like domain modeling, and these create artifacts:
  - additions/changes to your ubiquitous language
  - decision records documenting things that are hard to change or have interesting trade-offs that were considered
- The general workflow: go from Grill with Docs into tools like **to-spec** and **to-tickets**, which further break down the work. Another practice I'm very happy to see — finding ways to create small units of work.
- Matt's motivation for small units of work: he wants to put an agent in AFK mode to go off and implement it, keeping a smaller context window and staying out of "the dumb zone" (as he describes it) — basically more than ~40% of token usage.
- My motivation is different: I'm interested in small units of work because I still read the code.

### 2026 — Where I diverge: manual, single-agent, heavy review (not AFK orchestration)

- Matt and a core group utilizing his workflow prefer to create AFK work. Matt specifically has a thing called **Sandcastle** (https://github.com/mattpocock/sandcastle) — he uses it to orchestrate a collection of agents to implement his spec across tickets/issues.
- I'm still doing a lot of this more manually. Most of the time I work with a single agent in a single session: talk through a problem, watch it build the code.
- I do lots of code commentary before and after the PR. I add comments on the PR just as I would to a historic human's code, then ship it right back to the AI agent: "address this feedback." Sometimes it's things I want to change; sometimes it's just questions about how or why they did something a certain way.
- I still have very strong opinions about what the code is and how it should work. (Future blog post will detail the guardrails.) I'm constantly nudging it through additional CI checks or coding-standards files that articulate what I want. Examples:
  - When creating an Elixir typespec, name the arguments — don't say `string, string, string`, say what those three arguments are via named typespec arguments.
  - Variable/attribute naming: a Phoenix component might have a simple `title` attribute (assumed to be a string). Another attribute might be a `date` — if you say `date`, the expectation is you pass a date value. But to present a *formatted* date you need a pattern. In LocalCents the pattern is `_display` — if you see `date_display`, you know to pass a formatted string of the date, not the date value itself.
- These are nuanced and nitpicky, and how much you care depends on the project's lifespan, number of contributors, etc. For me: I value strong code readability standards and consistency.
- More than ever, the *current state of the codebase* is really important. In the past a human had the awareness that "module A is the old style, module B is the new style, follow B." But unless you have strong rule sets telling the AI to follow a certain pattern, it will find the old way and use *that* as the standard. So more than ever, I want to keep the codebase up to date with what I consider good code.

### 2026 — The research skill

- Another Matt skill I enjoy: the **research** skill. In short, it often kicks off as a subagent. In the middle of your work you can just say "I want to research this idea," give it a couple of sources you find valuable (or just describe them), and it goes off, does research, and comes back with an artifact: "this is what I researched, and this is what I found."
- I find it particularly helpful for thinking about my own coding patterns.
- Example: the other day I wanted awareness about a particular variable name. Inside a LiveView hook event you often have an argument for parameters; my codebase just had `params`. Should I name it `book_params` or `expense_params`? Kicked off a research task across blog/logic documentation as well as actual projects and generators out there, figured out the community norm, and that influenced my own coding style.
- Did a similar thing for documentation patterns — understanding community norms around phrasing/wording for inline docs and making sure we followed those norms.

### 2026 — The skill I don't love: code review

- Probably the one Matt skill I haven't been fully enjoying: the **code review** skill. Not a disagreement with its underlying structure or what it looks for — but the way it packages up the findings and presents the prompt for you to decide what to fix vs. not fix is very clunky and hard to read. Considering future changes to it.

### 2026 — Public skills as a starting point; I expect to fork my own

- Saying aloud (and I've seen Matt say this in presentations): the curious/opinionated developer can get a lot of value out of a public community skill to get started, but will probably end up crafting their own.
- I expect that to happen. He'd be shocked if over the next 3–6 months I was still using Matt's skills one-for-one. I think I'll slowly start to extract or fork some of these skills to serve my own needs — my own workflow preferences, even terminology.
- Example — terminology: historically I keep a folder called `decisions`. In Matt's skills they're all referred to as **ADRs** (Architectural Decision Records).
  - Such a small thing, but I'd prefer to just say "decision." Framing it as an "architectural decision record" puts a lot of weight on the file that shouldn't be there and inhibits people from creating them.
  - I want to encourage people to document their trade-offs and considerations. Putting it behind a heavy term (plus a folder and day-to-day verbiage of "ADR") is added complexity.
  - Every time I say "ADR" my brain has to take those three letters, pause, and unpack the abbreviation. I hate that. I'd rather just say the full word: "decision," "decision document," or the "decisions folder."

### 2026 — Closing thoughts: introspection is still the biggest value; I still read the code

- Closing thought: while I am using AI (and more sophisticated models) to generate code, the largest value I get out of it is still **introspection** — either introspecting the existing system to understand how something works, or to understand a performance characteristic that isn't working as well as we want.
- I do still read the code. I'm not at the point of leaning hard into *not* reading the code.
- One exception: I created an AI-generated script that lives in my personal notebook to cross-post to Bluesky. After I post to Mastodon, I copy/paste the URL and say "cross-post this to Bluesky," and it handles the post plus attachments and the alt text for those attachments. I generated it, validated that it works (it's written in Elixir because it asked me), but I've never really looked at the code.
- Why that's fine: it's a one-off, extremely tight scope. If it breaks, it doesn't have a big impact on my day. It's not code contributed by multiple people, doesn't need to be observed in production via telemetry, doesn't need security updates over time, etc.
- When we talk about **production systems and production code**, that's where I want to read the code — make sure it's being the best engineering citizen it can be, including following my personal preferences on coding styles, context boundaries, and how we want to test things.
- You can document some of this to suggest to the AI agent how you want generated code to be. But firsthand: just because I have a coding-standards rule saying something should be followed doesn't mean it's always followed. You end up being the policeman — watching things and making sure everything's going right.

### 2026 — The honest emotional / ethical note

- Another thing to say aloud: I had a happy hour with a friend and tried to summarize my mental state about the current situation. I can't say I'm very happy about how this has gone.
- I got into coding and had a level of enjoyment about it — it was a completely different world. Where we've ended up regarding code generation, the moral and ethical issues surrounding AI code generation, surveillance capitalism, and so on (without getting too deep into the weeds) — it's a mess.
- I've blogged about this before: https://mikezornek.com/posts/2026/5/moral-struggles-of-ai-coding/

### 2026 — What's next / upcoming AI experiments

- Close with some upcoming AI things I'd like to keep experimenting with.
- **Continue experimenting with Matt's other skills.** Given a lot of them good experiment time on LocalCents, but there are others I want to get deeper into.
  - Specifically **Wayfinder** — a new skill Matt recently created. He describes it as "Grill with Docs on steroids."
  - My view: Grill with Docs is a single session where we talk and go through a lot of Q&A about a topic; the outcome is a couple of artifacts (ADRs, ubiquitous-language changes).
  - Wayfinder is more like "let's take time to do a more thorough investigation of new work." As you work through it, you create artifacts as GitHub issues describing a very large decision/research tree. You work through that, and only after finishing plotting the map do you convert it into a proper specification or tickets before going to implementation.
  - The **research nodes** and **prototype nodes** of Wayfinder seem particularly powerful — e.g. having the AI sketch a throwaway prototype demonstrating three or four different approaches to a UI.
  - For my current thread of work I'm still finishing my main epic (an MVP-level of work). Once that's done, I'll probably give Wayfinder a deeper try.
- **Broader experiments** (beyond more general experimentation with Claude Code and its advanced features):
  - I'd really like to look into the **pi.dev** harness (https://pi.dev/) — my understanding is it's more of an open-source, vendor-neutral coding harness. Could be particularly interesting.
  - Longer term I'm very interested in seeing what I can accomplish with **local models**. Very hesitant about being so reliant on a third party for this stuff. Want to see how far I can get with local models.
  - That requires beefy local hardware I don't have — my current computer is an M1 Max — but it's something I want to keep experimenting with.

### 2026 — Closing thought: the changed feeling of the work (and burnout risk)

- Another closing thought: being a programmer has always required a certain level of continuous education as the technology changes.
- But the amount and volatility of the AI tooling changes — plus the fact that when you're working on actual work (accomplishing some goal for somebody), you're also spending a lot more cognitive time on complex problems *and* policing the AI — gives it a different feeling of work.
- It can very much feel exhausting at times. That has concerns for a job that can lead to burnout pretty easily.

### 2026 — Aside: voice entry has been surprisingly powerful

- One thing I never really got into but should mention: I've really enjoyed using the voice entry system of Claude Code to talk through things and ask for changes. Really, really powerful.
- So much so that I've found myself wanting the ability to dictate into the computer for other things too — like a GitHub issue comment — a lot.
- May start looking into assistive tools to help me dictate more across other mediums.

### 2026 — Worktrees: multi-agent attempts felt clunky

- Worth talking about worktrees a little: while most of my work has been on a single agent session, the few recent times I tried running multiple agents at the same time — done via git worktrees — it was really clunky.

---

## Repo findings (not dictated — pulled from LocalCents, vet before rebuild)

Captured from a scan of the `local_cents` repo. These are things Mike is actually doing that weren't in the dictated notes. Vet/trim before folding into the draft.

- **Standards are an index + focused topic files, not a monolith.** `CODING_STANDARDS.md` is a thin index linking out to `docs/moduledoc-style.md`, `docs/comment-style.md`, `docs/module-boundaries.md`, etc. (each rule has an authoritative home). Reinforces the "keep the codebase current / re-anchor the AI" point.
- **The ADR tension is live in the repo.** Despite preferring "decision" over "ADR," LocalCents has `docs/adr/` with 17 numbered records (0001–0017) — not renamed yet. Honest, self-aware proof of "start with the public skill's vocabulary, fork it later."
- **Already started forking/authoring my own skills.** `docs/agents/` holds `issue-tracker.md`, `triage-labels.md`, `domain.md` — my own agent/skill definitions for a GitHub-issue triage workflow. So "I expect to fork my own" is already present-tense.
- **Research skill outputs are on disk as proof.** `docs/research/` has `params-variable-naming-convention.md` and `route-path-param-naming.md` (the exact params anecdote), plus `apple-hig-destructive-confirmation-alerts.md` — research also covers UX/HIG norms, not just code patterns.
- **Ubiquitous language is real and partitioned three ways:** `CONTEXT.md` (domain nouns), `docs/ui-language.md` (UI verbs), `docs/software-terms.md` (DDD terms).
- **Breadboarding (Shape Up) as a design-first step.** `docs/breadboards/` + `docs/breadboard-demo.md` — a pre-code design practice feeding the workflow.
- **`command-line-history.md`** — a running log of notable generator prompts/commands (skill-install gist, storybook generator, `rustler.new`). Cheap reproducibility habit.
- **usage_rules → deferred.** Auto-includes dependency usage rules into `AGENTS.md`. Holding this for the follow-up tooling post, not this article.

## Scope notes / boundaries

- CI guardrail suite (`build-and-test`, `dialyzer`, `code-quality`, `lint-pr`, custom `.credo.exs`, `.sobelow-conf`, `mix precommit`) belongs to the **CI guardrails / bowling-bumpers** post. This article can gesture at it, not itemize it.
- Deep `AGENTS.md` Phoenix/Tauri rules = mechanics, for a different post.

## Rebuild TODO (structural gaps)

- **The frame is undictated.** The curiosity / comparing-notes-with-peers thesis (the reader payoff) has no captured content — it's the opening and needs writing.
- **No explicit close / CTA.** The "your turn — what are you seeing?" invitation the frame promises isn't stated.
- **Emotional sequencing.** Decide where the ethical-mess / burnout low note lands; current order (experiments after) rescues the ending — preserve that.
- **Front matter** — real title, description, `pain`/`fix`, tags still needed.
