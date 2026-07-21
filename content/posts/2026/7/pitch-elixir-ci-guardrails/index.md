---
title: "Pitch Elixir Ci Guardrails"
date: 2026-07-21T18:46:15-04:00
description: something tweet like
images:
  - posts/2020/6/book-dreaming-in-code/thumnb.jpeg
draft: true
pain: 
fix: 
---

## Raw voice notes (unstructured — to be refined later)

### Framing / why this post

- We live in a challenging environment: most of our projects have seen a drastic increase in the use of AI code generation tools, and more and more pull requests are getting merged in on a daily basis.
- This is a problem. Specifically: if you just `mix phx.new` a fresh project template and ask an AI to start generating domain logic, features, and the tests for those features, you are at the mercy of the LLM to dictate what kind of code it writes.
- I have a whole other blog post about what I consider good code. To make sure the generated code aligns with my values of good code, I've found the need to instill more and more CI tools.
- CI is not a new concept — we've been using it for decades. But as this phase of our community has arrived, the need for more and more checks has become really valuable.
- On my recent LocalCents project, I've spent a lot of effort installing far more CI tools than I historically have. So far the return on investment feels worth it.
- The goal of this post: walk through all the different tools and patterns I'm using there, to hopefully inspire people to further harden their own Elixir projects.

### The median + entropy idea (maybe include, maybe not — overlaps the "AI Writes Average Code" post)

- Not sure I actually want to include this here, since the sibling post already covers it. Capturing anyway.
- LLMs are ultimately a statistics engine. So the code quality you get out of one falls around a distribution — a hill peaking somewhere around 40–50% and sloping off toward ~60%. Ask an LLM to generate code and you get it in that midrange.
- Then there's entropy over time: software naturally degrades, similar to re-saving a JPEG over and over and over again.
- So: if you try to use an LLM to generate a coding project and you don't have strong fundamentals of what it takes to run a solid, fault-tolerant, reliable production system, you're going to end up with code that is unmaintainable.

### The tools I use

**Compile & formatting hygiene**

- `mix compile --warnings-as-errors` — make sure any warning from an Elixir language standpoint is generated as an error during compile. That halts your CI and gives you the signal you need to fix it.
- `mix format --check-formatted` — make sure the code is properly white-spaced and arranged the way the standard Elixir formatter would do it. Protects us from stray whitespace changes scattered across various PRs.
- `mix deps.unlock --check-unused` — make sure there are no orphan dependencies in `mix.lock`. The idea: in your Elixir project you add a dependency in `mix.exs`, and over time you might decide you don't need it anymore. If you just remove it from `mix.exs`, it can still hang around in your lock file, so it still gets pulled in and compiled — wasting space. You want CI to make sure you have no rogue dependencies.
- `mix xref graph` (failing above zero) — helps protect against accidental compile-time dependencies.

**Linting & static analysis**

- **Credo.** First, what it is in short: Credo is a tool you use to enforce different coding patterns. It ships with a whole collection of defaults that lean toward community norms — organization of aliases, variable naming, etc.
  - In my own work I've turned on most of the default Credo rules, with a couple small exceptions.
  - Anybody can write a Credo rule, and there are a few community repos people have published. I pull in some of these:
    - **Jump's checks** — they produce a whole bunch of useful Credo checks.
    - **Oeditus Credo** — I've cherry-picked a couple out of it that I thought were particularly helpful (not the whole set).
    - **My own custom checks:**
      - `case_on_boolean` — protects against a pattern you see in LLM-generated code.
      - a check for the use of the `raw` function inside HEEx. Normally a security scan from Sobelow (below) would catch this, but Sobelow does not look inside a HEEx template. So this is an explicit check: if you're calling `raw` in a HEEx template, you have to explain yourself.
- **Dialyzer.** A type-enforcement tool that pretty much lives in the Erlang layer. It takes advantage of Elixir's typespec tooling — in Elixir you can write typespecs, define types, put types on structs, put a type signature on a function saying what comes in and what goes out. Dialyzer looks at all that type information (plus what it can derive itself) and tells you about areas of the code that aren't aligned with the type declarations.
  - Pros/cons: it's a particularly *expensive* tool to run, so it takes a while to do its work. The errors you get back are a bit obtuse. With LLM assistance maybe it's not as obtuse as it used to be, but it still reads awkwardly when you hit a failure.
  - Elixir itself is continually increasing its own type enforcement. Elixir 1.20 gave us even stronger native type tooling that points out lots of issues.
  - I'm personally *not* at the point where I want to drop Dialyzer in favor of just the native Elixir type tooling — I don't feel it's there yet. And I still get a lot of value out of writing typespecs from a documentation standpoint (including type docs for individual attributes of a schema, for example). I still use Dialyzer today and would recommend it.
- **Boundary** (from Saša Jurić's work). Helps enforce that call sites follow context boundaries. If you're following a domain-driven-design philosophy and creating a bounded context to capture your domain logic, you'll have your top-level API module plus a lot of supporting inner modules that help with the implementation. Boundary makes sure other call sites don't reach into your bounded context and call a function that's meant to be a hidden implementation detail.
  - Part of the niche: Elixir doesn't have strong privacy enforcement across modules. Privacy in Elixir is module-specific — either a function is public or private, there's no way to say "this is private for *this collection* of modules." Boundary helps you enforce that.
  - This is my first project using Boundary. I've been aware of it for a while, but so far I really enjoy the codification of the limits I'd like to enforce.
  - Again, this ties back to AI: if you didn't give it a rule, the AI could be coerced into calling a private implementation function to accomplish some goal. Using Boundary forces it to see that it made a mistake and fix itself.

**Security**

- **Sobelow.** A tool to scan your Elixir project for known security concerns — things like taking in user input and then using it for a file path.
  - I've also used Sobelow to help with Content Security Policy (CSP) — the web security layer where you preemptively announce in your HTML what kind of HTML things you expect to happen on the page. Then if somebody tries to inject something into the DOM, the browser says "you can't do that." Sobelow helps with that. *(TODO: confirm the exact CSP terminology.)*
- **`mix_audit`** — scans your dependency tree against the community security advisories. Helps you understand if you have a known exploit you should look into.
  - Not 100% sure how it differs from `mix deps.audit` — capture the note, fill in later. *(Editor's note from audit: `mix deps.audit` IS the mix task that the `mix_audit` package provides — same tool, not two.)*
- **`mix hex.audit`** — flags retired / pulled Hex packages.
  - Clarification to fold into the prose: there are three easily-confused "audit" commands.
    - `mix deps.audit` — provided by the **`mix_audit`** package; scans the locked dependency tree against community CVE / security advisories.
    - `mix_audit` — the package *name*; the thing that gives you `mix deps.audit`. (So `mix_audit` and `mix deps.audit` are the *same tool*, just package-name vs. task-name.)
    - `mix hex.audit` — built into **Hex itself** (not the `mix_audit` package); flags retired / pulled / deprecated packages. A genuinely different tool despite the similar name.

**Documentation**

- I'm a huge fan of writing and publishing documentation for a project. In the act of writing documentation, you really come to appreciate the system design you've arrived at.
- If you're doing good documentation, you'll have a lot of code blocks that reference modules across the project — e.g. an overview page that includes references to modules and functions across the codebase.
- **`mix docs --warnings-as-errors`** — one way I protect against broken docs. If you rename a module or change the arity of a function and you have stale docs still linking to it, this warns you about it.
  - Sometimes you end up with modules that are more dynamic or synthesized that you can't really link (or they were historic references) — you untick / exclude those to get the warnings to stop.
  - Overall a helpful tool to make sure my docs stay up to date.

**Testing**

- **`mix test`** — run the test logic that validates our domain logic, confirming we do what we expect across happy paths as well as bad paths.
- **`mix test --warnings-as-errors`** — if there's a warning in those `.exs` test files, we want to know about it just as much as warnings in compiled code.
- **`phoenix_test`** — this project is the first time I've used this library. It gives you a very elegant presentation of web page interaction. I absolutely love it. (Probably a separate smaller post on just why I love it so much.)
  - Technically not a guardrail-specific thing — but by using it I generate test code that is much more readable.
- **`excoveralls`** (test coverage) — recently added, but currently a **local-only tool**; not integrated into CI.
  - No hard rule like "coverage can only go up." It's just a tool for me to spot-check the codebase at my personal whim, to see how coverage is and whether I need to fill gaps anywhere.
  - Why not a CI blocker: on projects I've contributed to that used coverage as a CI gate, the coverage numbers were always off. A lot of that comes from GitHub CI confusion over whether you're running against *what your branch is* vs. *what your branch will be once merged* into the main integration branch (main / develop). The numbers were always off and weird — not a reliable day-to-day signal on a PR.
  - So while I'm interested in coverage at a high level, I don't currently integrate it into CI.

**Workflow & general hygiene / miscellaneous**

- **actionlint** — validates the YAML I use for my various GitHub workflows.
  - Note to self: not really sure what the difference between actionlint and shellcheck is. *(Editor's note from audit: they're complementary and actually run together — actionlint lints the workflow YAML itself, e.g. expression syntax, `runs-on` labels, matrix typos; it then invokes **shellcheck** on the `run:` shell blocks inside those workflows. Our actionlint image bundles shellcheck, so one step covers both.)*
- **action-semantic-pull-request** — a GitHub action that enforces a certain style of naming your pull requests.
  - The idea: you should be able to read the commits on your main integration branch top-down and have a clear idea of what's going on. So it has you label things — this is a documentation update, this is a feature addition, this is a chore, and so on.
  - It's also a smaller nudge toward making smaller, more focused PRs, so you don't end up with a PR that does a ton of things.
  - It enforces at the pull request layer — if you create a PR whose title doesn't follow the convention, it yells at you.
  - Ties into my merge pattern: I typically use **squash** when merging a PR into main, so the PR title becomes the commit message.
- **Dependabot** — configured for the Elixir tooling, some of my Rust tooling, and the GitHub actions themselves. So I get periodic Dependabot PRs (e.g. "actions/checkout is old, here's a new version").
  - I set it to run **monthly** and to **group** things into single PRs.
  - Why: daily + isolated PRs per dependency just creates a lot of PR noise. And dependencies often should be updated in groups anyway — e.g. update Oban and Oban Web as one unit of work, or Phoenix and Phoenix LiveView together. So I prefer grouped, once a month. Fair cadence for side projects; on a stricter project maybe weekly.
  - Dependabot will make PR updates for everything, **but** for Elixir deps specifically I use a **custom skill** to do the update instead.
    - Why a custom skill: I want a much richer PR summary about the dependency updates. My skill checks for changelogs and does inline changelog references (which you also get from Dependabot), but *also* adds links to hex diff and links to the changelogs.
    - As part of the skill, the AI evaluates what the changelog is talking about and makes sure that if there's any reference to our own code relative to that changelog, we respond to it. You never get that from Dependabot — Dependabot just does a `mix.lock` update, it never looks at the code.
    - Because I run Elixir updates so often, I like using my custom skill — but I still like Dependabot to nudge me. If I go off a project for a while and see a Dependabot PR for Elixir, that's a nudge to run my skill manually.
    - For simpler stuff like the GitHub-action bumps, I can usually just merge as-is — Dependabot is smart enough to make a good PR diff there.
- **`usage_rules`** — not specific to CI, but a tool I use to help the *AI* generate better code. Comes out of the Ash project.
  - What it does: generates deep links into your dependency folder for libraries that publish usage rules. These are markdown files that help an agent understand what proper code looks like in, say, LiveView or Ash or Ecto.
  - By using the `usage_rules` library, you run some commands to create updates in your main AGENTS file that nudge the agent in the right direction.
  - Honest caveat / future work: one thing I'm hopeful to do is more *observation* of my agents, so I can better understand whether it's actually finding the usage rules when it should — or which of the skills I've made available it's actually using.
    - Today I often manually kick off a lot of the skills. But other things, like usage rules, ideally the AI discovers on its own — and I don't have good visibility into how often it does.
    - So while I promote the value of usage rules, I want to be upfront: I don't have a good way to measure how well it's working right now.

**The `mix precommit` task (ties it all together)**

- Finally, the **`mix precommit`** task. This comes out of newer Phoenix templates, and I've embraced that naming pattern.
- The idea: it runs a collection of checks before you commit your work. So the AI constantly runs it as it's generating code, or when it wants to push a new commit.
- You get a bunch out of the box with Phoenix, but over time I've expanded my own `precommit` task to run lots of the other things discussed above.
- Thing to say aloud: you need to be mindful of **which environment** gets used for different mix tasks. There's a pattern where you add a `cli/0` function to your `mix.exs` that instructs Elixir on which env a task should run in — e.g. "when you run this task you should be in `test`," or "this other one can run in `dev`." *(Link references here.)*

### Things I don't use (but would recommend elsewhere)

- **Ecto Credo rules.** I mentioned I use a lot of third-party Credo libraries. The one I *don't* use in LocalCents is the Ecto Credo rules — mainly because I don't use Ecto for persistence in LocalCents. But on a more standard Phoenix project, that's definitely a Credo collection I'd reach for.
- **Quokka** — a tool I'm aware of but don't use. Similar to **Styler**: when a Credo rule is broken and the rule can define how to fix it, it fixes it automatically. My feeling: now that I'm specifically leaning on more AI code generation in LocalCents, the AI will fix it for me — I don't need the formatter to do it. But it's something you could consider.
- **Rust sanitation** — I have a ton of tooling for Elixir code sanitation but absolutely nothing for Rust right now. I don't have a lot of Rust code in LocalCents, but it's something I'll want to add in the future.
- **Secret scanning** — secrets in codebases are a huge security concern. GitHub has some tools that help alert you to that. I haven't added any yet, but they're on my radar.
- **Spell / typo checking** — I do use a coding spelling dictionary for this project. My editor of choice is Zed, and I use the [codebook extension](https://github.com/blopker/codebook), which points out code-and-comment misspellings. I fix them manually, or add certain terms to a codebook dictionary stored in the repo for future reference. But I don't enforce any spell check at the CI level. I could, but it's not a super-high priority for me.

### Code review (human + AI)

- I utilize a **code review skill** in local development. I'll usually kick it off before I actually make a PR.
- Sometimes I'll also just push a PR to GitHub, do inline comments, and tell the AI to resolve the comments I posted.
- I take advantage of **Copilot code review** — inside GitHub you can request Copilot to review a PR. In my experience it's particularly good at finding things; it will often find things my local Claude Code review does not.
- Similarly, I often just tell Claude to look at the PR for feedback. It'll respond to that feedback via a code change and comments in the thread — or, if it's a false positive, it'll just say so in the thread. All of that is manually reviewed by me.
- **Callout to hoist to the top of the post:** while I encourage people to experiment with AI code generation, I'm still a firm believer in *reading the code*. I do not believe you should blindly merge in changes from the AI. It so often deviates from my expectations for what should be committed to a codebase.
  - You improve things over time, little by little. Adding all of these guardrails is one set of enforcement.
  - I also have a **coding standards document** that points out Elixir-isms and Zorn-isms I want the system to follow — but it doesn't always follow them. Specifically right now, the AI code generation will often just skip my preferred standards for doing things.
  - Talked about this in the previous post on [thirty years coding with AI] — cross-link that. *(Editor's note: this is the "AI Writes Average Code. I've Spent Thirty Years Learning Not To." post.)*

### Tidewave (aware of, not yet adopted)

- **Tidewave** — a tool you can use to run an agent in the browser, right next to your web application. It has some interesting tools to help communicate with the AI about the area of the page you're interested in fixing. Also some interesting code-review UI presentations and task presentations.
- I experimented with Tidewave a bit when it very first came out. I've kept up to date with it, but haven't introduced it into my system yet.
- Primary reason: I feel most of its features I can accomplish today with Claude, and I'm hesitant to add lots of tooling. I'd rather spend this moment focusing on Claude and getting better with Claude — being aware of the tooling around me but avoiding a sprawl of different tools.
- Long term, I'll probably experiment more with vendor-neutral harnesses (e.g. opencode-style / "pi"?) or local models. So I do want to experiment — but today I'm mostly focused on Claude. Mentioning Tidewave because it's a good tool to be aware of. *(TODO: confirm the name of the vendor-neutral harness — "pie"/"pi" from voice.)*

### A more grounded testing philosophy (want to do, not there yet)

- Something I'm not doing today but would like to do eventually: have a more grounded testing philosophy.
- There are beliefs of mine that align with the testing book in my notebook, but I haven't distilled that into any specific Claude skills or rules yet. Something I probably want to do, but I'm not there yet. *(TODO: link the relevant testing note from the notebook Library.)*
- The core idea: test code exists to solve a problem / provide value. One mistake you can make is writing too much test code, which hampers your ability to refactor and reimagine the solution over time. You want to test the *observable behavior* of the system, not the *implementation detail*.
- It's a really fine line, kind of hard to talk about. It's in my head, I've thought about it and done research on it, but I haven't codified it into any specific CI tool or other mechanism.

### Research / links to gather (TODO)

- We talked about the `CODING_STANDARDS.md` file and how it influences GitHub code review. Find and link documentation about how GitHub processes that file (and potentially how Claude Code processes it too).
