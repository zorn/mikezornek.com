---
title: "Guarding Against AI Drift: My Automated Elixir Quality Checks"
date: 2026-07-22T11:14:06-04:00
description: As I experiment more with AI code generation, I've hardened LocalCents with more automated Elixir quality checks than I've ever run. Here's the whole guardrail setup, each linked to how it's wired in the real repo.
pain: as I generate more code with AI, I'm shipping more than ever and worried it will quietly drift away from my own standard of good code
fix: walk through the automated Elixir guardrails I run on LocalCents, each linked to its real implementation, so a peer can steal the ones they're missing
tags:
  - elixir
  - ai
  - software-craft
---

Over the last couple of months I've been using [LocalCents](https://github.com/zorn/local_cents/) as a place to experiment seriously with AI code generation, and the raw volume of what I ship has climbed right along with it. I won't pretend that's pure fun. It's actually a little scary. My worry isn't any single generated change, it's the drift. An AI reaches for whatever pattern it has already seen, and left alone it will treat yesterday's shortcut as the standard to copy. Enough of that and a project I care about slides into a version of itself I never chose.

So my answer has been to wire up more automated Elixir code-quality checks than I've ever run before. If [What Is Good Code?]({{< ref "posts/2026/7/what-is-good-code" >}}) was me naming the values I care about, this is the machinery I use to defend them. Everything below links straight to how it's set up in the LocalCents repo, so you're getting more than a list of ideas. You're getting a working reference you can copy into your own project.

One thing I'll say once and then let the list speak: none of this replaces reading the code. I still review every AI change the way I'd review a coworker's, and I still send plenty of it back. The automation catches what's mechanical and repeatable. The judgment is still on me.

## Compiling and formatting

The cheapest guardrails, and the ones I'd set up first on any project.

**`mix compile --warnings-as-errors`.** The compiler already spots a lot of trouble; this makes it non-negotiable. An unused variable or a deprecated call fails the build instead of scrolling past in a wall of yellow.

**`mix format --check-formatted`.** Enforces the standard formatter across the whole project. The real win shows up in review, where no pull request ever carries a spray of incidental whitespace and the diff is only the actual work.

**`mix deps.unlock --check-unused`.** Fails when `mix.lock` is still carrying a dependency nothing references. It's easy to pull a library out of `mix.exs` and leave its locked entry behind, quietly compiling code you no longer use.

**`mix xref graph --label compile-connected --fail-above 0`.** Catches a sneakier one: a change that turns a runtime dependency into a compile-time one, which balloons your recompile times as the project grows. Failing above zero keeps that coupling from creeping in unnoticed.

All four run in the [Code Quality workflow](https://github.com/zorn/local_cents/blob/main/.github/workflows/code-quality.yaml), with the compile flags applied through a shared [`elixir-setup`](https://github.com/zorn/local_cents/blob/main/.github/actions/elixir-setup/action.yaml) action.

## Linting and static analysis

This is where I encode the most personal taste, and where AI code so often needs a nudge back into line.

**[Credo](https://github.com/rrrene/credo).** A style and consistency linter for Elixir. It ships with a big set of community-norm defaults (how you organize aliases, name things, structure a pipe), and I run it [`--strict`](https://github.com/zorn/local_cents/blob/main/.credo.exs) with most of those defaults on. What makes it powerful is that anyone can write a check, so I layer a few sources on top of the defaults:

- **[Jump's checks](https://github.com/Jump-App/credo_checks)** — the ones I get the most out of are a cluster that polices *test quality*. [`VacuousTest`](https://hexdocs.pm/jump_credo_checks/Jump.CredoChecks.VacuousTest.html), [`TestHasNoAssertions`](https://hexdocs.pm/jump_credo_checks/Jump.CredoChecks.TestHasNoAssertions.html), and [`WeakAssertion`](https://hexdocs.pm/jump_credo_checks/Jump.CredoChecks.WeakAssertion.html) all catch a test that runs green without actually proving anything, which is exactly the false confidence I don't want an AI quietly writing into the suite. [`UnusedLiveViewAssign`](https://hexdocs.pm/jump_credo_checks/Jump.CredoChecks.UnusedLiveViewAssign.html) (an assign you set but never render) and [`AssertElementSelectorCanNeverFail`](https://hexdocs.pm/jump_credo_checks/Jump.CredoChecks.AssertElementSelectorCanNeverFail.html) (a LiveView test selector that can't fail) are two more I'm glad to have.
- **[Oeditus' checks](https://github.com/Oeditus/oeditus_credo)** — this one ships around 40 checks, and honestly a lot of them looked noisy to me, so rather than adopt the set I cherry-picked a handful from the concurrency and blocking group that felt like the highest-impact ones: [`UnmanagedTask`](https://hexdocs.pm/oeditus_credo/OeditusCredo.Check.Warning.UnmanagedTask.html) (a `Task` spawned outside a supervisor), [`BlockingInPlug`](https://hexdocs.pm/oeditus_credo/OeditusCredo.Check.Warning.BlockingInPlug.html), [`SyncOverAsync`](https://hexdocs.pm/oeditus_credo/OeditusCredo.Check.Warning.SyncOverAsync.html), [`MissingHandleAsync`](https://hexdocs.pm/oeditus_credo/OeditusCredo.Check.Warning.MissingHandleAsync.html), and [`SwallowingException`](https://hexdocs.pm/oeditus_credo/OeditusCredo.Check.Warning.SwallowingException.html) (a `rescue` that throws the error away). These are the kind of subtle mistakes that compile cleanly and are easy for an agent to introduce without anyone noticing.
- **Two project-local checks**, vendored straight into the repo. [`case_on_boolean`](https://github.com/zorn/local_cents/blob/main/credo_checks/case_on_boolean.ex) is adapted from [ExSlop](https://github.com/elixir-vibe/ex_slop), a collection of checks aimed squarely at AI-generated "code slop." It flags a `case` whose only clauses are `true` and `false` (a shape you see a lot in machine-written Elixir), and it was the one rule in that library I wanted, so I lifted just it rather than take on the whole set. [`raw_in_heex`](https://github.com/zorn/local_cents/blob/main/credo_checks/raw_in_heex.ex) is one I wrote myself: it flags any use of `raw/1` inside a HEEx template, which bypasses LiveView's automatic HTML-escaping. Sobelow won't look inside a template, so this makes me explain myself any time I reach for `raw`.

One habit worth building around all of this: Credo itself adds new checks fairly often, and a config you generated a while ago won't have them turned on. Every so often it's worth regenerating the defaults with `mix credo.gen.config` and diffing them against your own, to see which new rules are available and decide whether you want them. Free guardrails tend to accumulate upstream while you aren't looking.

**[Dialyzer](https://github.com/jeremyjh/dialyxir)** (via dialyxir). A static analysis tool, living down in the Erlang layer, that infers types across your code, cross-checks them against any typespecs you've written, and flags the spots it can *prove* are inconsistent. It's conservative by design, so it catches less than a full type checker but rarely cries wolf. It has real costs: it's slowish, and its errors read a little awkwardly (less so with an LLM to help interpret them these days). Elixir's own type system keeps getting stronger and I love that, but it hasn't made Dialyzer redundant for me yet, because Dialyzer still surfaces a little more. And I get a lot of value out of writing typespecs to document the incoming and outgoing types. Because it's slower than the other checks, Dialyzer gets its own [GitHub Actions workflow](https://github.com/zorn/local_cents/blob/main/.github/workflows/dialyzer.yaml), separate from the rest. The PLT it depends on (the table of type information it has to build before it can analyze anything) is cached, so each push isn't rebuilding that from scratch.

**[Boundary](https://github.com/sasa1977/boundary).** From Saša Jurić, this enforces that call sites respect your context boundaries. Elixir's own privacy is module-scoped: a function is either public or private, with no way to say "public within this bounded context, private to everyone else." Boundary gives you that. If you're leaning on domain-driven design, it stops other code from reaching past your context's public API into its internals. This is my first project using it, and it's earned its place. When an agent tries to shortcut into a private implementation to get something done, the compile-time check makes it see the mistake and correct itself.

## Security

**[Sobelow](https://github.com/nccgroup/sobelow).** A security-focused static analysis pass for Phoenix apps, catching things like user input flowing into a file path. It's the tool that helped me get a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) in place too.

**[mix_audit](https://github.com/mirego/mix_audit)** (`mix deps.audit`). Cross-references your locked dependency tree against the community security advisories, so a known CVE in something you depend on turns into a failed build.

**`mix hex.audit`.** Different tool, similar name. This one is built into Hex itself and flags any locked dependency whose maintainer has retired or pulled the version out from under you.

Sobelow and both audits live in the security job of the [Code Quality workflow](https://github.com/zorn/local_cents/blob/main/.github/workflows/code-quality.yaml), split into their own job so a red mark there clearly means "a dependency needs attention" rather than "your own code has a style problem."

One tool I'll give a nod to here even though I haven't used it yet: [Paraxial.io](https://paraxial.io/). It's an application-security platform built specifically for Elixir and Phoenix, going beyond the static scanning above into runtime protection like bot and attack detection. LocalCents is currently focused on being a local-first desktop app, so I haven't added it yet, but I'll give it a second look once I start hosting a version on the web.

## Documentation

I'm a fan of writing and publishing documentation, and not only for readers. There's something about explaining a system to someone who doesn't already know it that makes me appreciate the design more, and every so often it's what surfaces the realization that the design itself needs to change.

Good docs tend to reference modules and functions across the codebase, which means they rot the moment you rename or reshape something.

**`mix docs --warnings-as-errors`.** Turns a stale doc reference (a link to a module you renamed, an extra page that no longer exists) into a build failure instead of a warning that quietly accumulates. It's part of the [Code Quality workflow](https://github.com/zorn/local_cents/blob/main/.github/workflows/code-quality.yaml). Occasionally you'll hit a dynamic or synthesized module you genuinely can't link, and you exclude those deliberately, but the default is that broken docs fail CI.

## Testing

**`mix test --warnings-as-errors`.** The suite validates the domain logic across happy and unhappy paths, and I treat a warning in a test file as seriously as one in compiled code. It runs in the [Build and Test workflow](https://github.com/zorn/local_cents/blob/main/.github/workflows/build-and-test.yaml).

**[phoenix_test](https://github.com/germsvel/phoenix_test).** This is my first project using it, and it gives you feature tests that read like a user flow (`visit`, `click_button`, `fill_in`, `assert_has`). Not a guardrail exactly, but by making the tests more readable it raises the odds that the generated tests are ones I actually want to keep.

**[excoveralls](https://github.com/parroty/excoveralls)** for code coverage, but deliberately **local only**, not a CI gate. I use it to spot-check the codebase when I want to, not to enforce a number. Every time I've worked on a project that gated on coverage, the number was unreliable, in large part because of the confusion between what a branch *is* and what it *will be* once merged. So I keep coverage as an on-demand tool and refuse to let a flaky percentage block a pull request. More on that reasoning is in [the project's coverage docs](https://github.com/zorn/local_cents/blob/main/docs/testing-coverage.md).

## Workflow and repository hygiene

Guardrails that sit around the code rather than in it. Most of these live in GitHub Actions. (New to Actions? I made a [getting-started video](https://www.youtube.com/watch?v=wF3llh4VLlQ).)

**[actionlint](https://github.com/rhysd/actionlint).** Lints my GitHub Actions YAML and runs shellcheck over the shell inside `run:` blocks, so a typo in the workflows themselves gets caught. It has its own [actionlint workflow](https://github.com/zorn/local_cents/blob/main/.github/workflows/actionlint.yaml).

**[Semantic pull request titles](https://github.com/amannn/action-semantic-pull-request).** Enforces a [Conventional Commits](https://www.conventionalcommits.org/) style on every PR title, so scanning the history top-down actually tells you what happened. Recent titles from the repo look like this:

```
feat: select an expense's category in the editor
ci: add mix hex.audit to catch retired Hex packages
docs: research note on community credo check libraries
```

Each one leads with a type, and my config also insists the subject start lowercase, so the log stays uniform. Because I squash-merge, the PR title becomes the commit message, and it's also a gentle push toward smaller, single-purpose PRs. It's wired up in the [Lint PR workflow](https://github.com/zorn/local_cents/blob/main/.github/workflows/lint-pr.yaml).

**[Dependabot](https://github.com/zorn/local_cents/blob/main/.github/dependabot.yml).** Configured across Elixir, Rust, and the GitHub Actions themselves, set to run monthly and to group updates into single PRs. Daily, per-dependency PRs are just noise, and related packages (Oban and Oban Web, or Phoenix and Phoenix LiveView) really should move together anyway. Monthly is a fair cadence for a side project; on something stricter I'd tighten it to weekly.

For the Elixir dependencies specifically, I don't just merge what Dependabot proposes. I run a custom skill that produces a much richer update: links to the hex diff and the changelog, and an actual reading of that changelog against our own code so anything that needs to respond to a breaking change gets flagged. Dependabot only rewrites `mix.lock`; it never looks at your code. So I let Dependabot's monthly PR act as the *nudge*, and my skill do the real work. I don't publish the skill itself yet, but [here's a pull request it produced](https://github.com/zorn/local_cents/pull/85) so you can see the shape of update PR I actually want: a written summary, per-dependency diff and changelog links, security callouts, and a note on the one code change the bump required.

**[usage_rules](https://github.com/ash-project/usage_rules).** Not a CI check, but a tool that helps the AI generate better code in the first place. It comes out of the Ash project and pulls the `usage-rules.md` files that libraries ship for agents into my `AGENTS.md`, so LiveView, Ecto, and friends surface their own guidance as context. Honest caveat: I promote this, but I don't yet have good observability into how often the agent actually reaches for those rules. Measuring that is on my list.

**[`CODING_STANDARDS.md`](https://github.com/zorn/local_cents/blob/4b5e4f4b190aa3b4e6803746a92d3a9a25c83401/CODING_STANDARDS.md).** My own layer on top of that: the Elixir-isms and naming conventions I want followed, fed to the agent through the same `AGENTS.md` so they shape what gets generated. My local review pass reads them too.

## It all collapses into one command

A written standard only goes so far, and the gap between "I wrote it down" and "it actually happened" is real. So wherever I can turn a standard into a check, I do. A standards file is a suggestion. A failing build is not.

That's what makes the whole list livable: almost every code-facing check above is bundled into a single [`mix precommit`](https://github.com/zorn/local_cents/blob/main/mix.exs) alias that runs them all in one shot. The agent runs it constantly as it works, and CI runs it on the way in. One command is the difference between guardrails I have to remember and guardrails that are just always on.

{{< figure src="ci-all-checks-passed.png"
   alt="A GitHub pull request status panel headed 'All checks have passed, 6 successful checks,' with a green checkmark beside each of Actionlint, Build and Test, Code Quality / Lint, Code Quality / Security, Lint PR / Validate PR title, and Run Dialyzer, above a green 'No conflicts with base branch' row." >}}

One wrinkle worth knowing if you build your own: some of these tasks care which `MIX_ENV` they run under. You can add a [`cli/0` function](https://hexdocs.pm/mix/Mix.html#module-environments) to `mix.exs` to declare the right environment per task, which is how `precommit` runs tests under `:test` while still shelling out to Dialyzer under `:dev`.

## Code review, human and AI

Everything above is automated. Review is the part that still takes judgment, and I run it in layers.

Before I open a pull request, I'll usually run a code-review skill locally against the branch. Once that pass is done I push the PR up and turn on [Copilot's PR review](https://docs.github.com/en/copilot/concepts/agents/code-review), which regularly catches things my local Claude pass misses, structural issues and outright bugs both. Once Copilot has left its comments, I add my own, and this is the part I don't want to undersell. I'm not skimming and rubber-stamping. I read the code, and I push back on the specific things the tools tend to let slide. I want [named arguments in my typespecs](https://github.com/zorn/local_cents/blob/4b5e4f4b190aa3b4e6803746a92d3a9a25c83401/CODING_STANDARDS.md?plain=1#L47-L70) instead of a row of anonymous `String.t()`s, and sometimes it just won't do that until I ask. I want documentation written in the project's own [domain language](https://github.com/zorn/local_cents/blob/main/CONTEXT.md), and often I have to send a doc back to be rephrased in those terms. Then I hand all of it, my comments and the machines', back to Claude, and it either makes the change or, when it disagrees, leaves a note in the thread. Nothing merges without me having read it.

I keep spending that attention even when the generated code is fine, because fine is exactly the trap. It's rarely broken, just a little off from how I'd do it, and whatever lands in the repo becomes the example the next round of generation copies. Review is me wrangling the code back toward the framing I want before it hardens into the precedent I'm stuck with.

One honest gap in this layer: Copilot's review only reads a [`.github/copilot-instructions.md`](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions), not an arbitrary standards file, and I haven't wired that up yet. So my written standards reach the Claude side of review but not Copilot.

## What I'm not doing (yet)

Just as useful as the list of what I run is the honest list of what I don't.

- **Ecto migration-safety checks.** LocalCents has no Ecto or SQL database, so these don't apply here. On a normal Phoenix project I'd reach for [excellent_migrations](https://github.com/Artur-Sulej/excellent_migrations), which flags dangerous migration patterns (a column added with a default, an index created non-concurrently) before they lock a table in production.
- **[Quokka](https://github.com/emkguts/quokka).** A fork of [Styler](https://github.com/adobe/elixir-styler) that auto-rewrites code to match your Credo config rather than just flagging it. Now that I'm leaning on AI to make the fixes, I haven't felt the need, but it's a reasonable thing to add.
- **Rust guardrails.** I have a deep bench for Elixir and essentially nothing (`rustfmt`, `clippy`, `cargo test`) for the Rust in the project. It's the biggest gap in the setup, and it's on the list.
- **Secret scanning.** No scanner guarding against a committed credential yet, cheap insurance I want to add. I'd probably turn on GitHub's own [secret scanning with push protection](https://docs.github.com/en/code-security/secret-scanning) (free, and it blocks known token shapes before they even land) and add [gitleaks](https://github.com/gitleaks/gitleaks) or [TruffleHog](https://github.com/trufflesecurity/trufflehog) as a CI step for broader, entropy-based coverage.
- **CI spell checking.** I catch typos in my editor with [codebook](https://github.com/blopker/codebook) and a repo dictionary. A CI gate would mean constant allowlist upkeep for domain terms, so for now I'm leaving it manual.
- **Code coverage in CI.** Covered above: I want the signal, but not the flakiness, so it stays local.
- **Visual-regression testing.** Nothing catches unintended visual changes yet. I'd like to capture baseline screenshots, both of my UI component library and of key user flows, commit them to the repo, and make any visual diff something I have to approve before it lands. Same idea as everything else here, a locked-in baseline to catch drift, just applied to pixels instead of code.
- **A codified testing philosophy.** I have strong beliefs here (test observable behavior, not implementation detail; too many tests is its own liability) but I haven't yet turned them into a skill or a rule the way I have the rest.

***

That's the whole setup, or at least the whole setup today. It'll be different in six months, because the tools keep moving and so does my sense of where the AI needs the most fencing. But the shape of the bet won't change: the more code I let a machine write, the more I want a fixed, automated definition of good sitting between that code and my main branch.

I'd love to hear what's in your setup. What are you running that I'm not, and what did you try and rip back out? [Let me know.](/contact/)
