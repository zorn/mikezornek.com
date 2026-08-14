---
title: "An Agent Skill for Updating Elixir Dependencies"
date: 2026-08-13T15:54:27-04:00
description: "What agent skills are, and a walkthrough of the one I lean on to update Elixir dependencies and open a documented pull request."
pain: "An Elixir developer who wants to dip a toe into AI skills, or a developer already comfortable with skills who is looking to enhance their own workflow."
fix: "Walk through what a skill is, how skills work, and then review the skill I lean on to update Elixir dependencies."
bob-promise: "Readers walk away with ideas to consider for a dependency-update skill of their own, plus an open source reference to copy from."
tags:
  - elixir
  - ai
  - software-craft
---

If you have experimented with AI coding tools or are considering it, one feature of the coding harness (the interactive shell you work in) you'll encounter is skills.

## What is a skill?

As described by [Agent Skills](https://agentskills.io/home):

> Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows.
> 
> At its core, a skill is a folder containing a `SKILL.md` file. This file includes metadata (`name` and `description`, at minimum) and instructions that tell an agent how to perform a specific task. Skills can also bundle scripts, reference materials, templates, and other resources.
> 
> ```
> my-skill/
> ├── SKILL.md          # Required: metadata + instructions
> ├── scripts/          # Optional: executable code
> ├── references/       # Optional: documentation
> ├── assets/           # Optional: templates, resources
> └── ...               # Any additional files or directories
> ```

If there is something you do regularly, you can capture it as a skill. There is a loose [community specification](https://agentskills.io/specification), but plenty of vendor-specific settings exist as well. In Claude, for example, I use `disable-model-invocation` to [limit some skills to manual invocation](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill), while many others can be invoked directly by the model. Skills can live in your global user account or inside a specific project.

## My first skill: updating Elixir dependencies

I've long used [Dependabot to open pull requests](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-dependabot-prs) that signal when a repo has out-of-date dependencies.

One frustration (which [a better configuration](https://github.com/zorn/local_cents/blob/main/.github/dependabot.yml) could resolve) is that I'd prefer Dependabot to group the updates. I see no need to update [Oban](https://hex.pm/packages/oban) and [Oban Web](https://hex.pm/packages/oban_web) in separate PRs, for example. I also don't need to see this every day; limiting it to weekly, or even monthly for quiet side projects, is preferred and seems like a better balance of signal to noise.

The other frustration, and the opportunity that led to the skill, is that a Dependabot PR only ever changes the `mix.lock` file. Some updates really are that simple, but many involve reading through the changelogs and code diffs to understand how a change affects my project, and sometimes that means project code changes should accompany the version bumps.

That is what my skill does:

- Identifies the outdated libraries.
- Figures out what to update. The default is everything, but I sometimes start the skill with instructions to skip specific updates, either because I plan to update those later or because they are known compatibility issues.
- Applies the updates.
- Reviews the changelogs to understand what is changing and makes any required code changes.
- Verifies the project still builds green with all [CI guardrails](/posts/2026/7/guarding-against-ai-drift/) in check.
- Builds a PR with inline changelogs and links out to [hex diffs](https://hex.pm/diff/mint/1.9.1..1.9.3). The diffs help when I want to dig in for confidence or out of curiosity; reading other people's code is how you get better. The PR also lists the transitive dependencies, since those can have fun side effects too.

(I still keep the Dependabot tool running; its PRs are valuable signals, but often I make my own PRs these days.)

Here are examples of the output from my [Flick](https://github.com/zorn/flick/pull/184) and [LocalCents](https://github.com/zorn/local_cents/pull/193) projects.

And here is [the skill itself](https://github.com/zorn/dotfiles/blob/main/claude/skills/elixir-deps-update/SKILL.md) to copy or draw inspiration from. I keep updating it over time, including [recent additions](https://github.com/zorn/dotfiles/blob/18877ea982570f39e78e39f18eeceee96b27111c/claude/skills/elixir-deps-update/SKILL.md?plain=1#L174-L186) to make sure any changelog reference like `#123` links to the library's repo rather than my own.

I also host [a skill on writing skills](https://github.com/zorn/dotfiles/blob/main/claude/skills/writing-skills/SKILL.md). It is a fork of [Matt's skill](https://github.com/mattpocock/skills), but I changed some things, such as [a preference for US English](https://github.com/zorn/dotfiles/pull/22/commits).


## Read the code

This may feel repetitive if you've read my other posts, but having a skill that automates the monotony does not absolve you of reading the code, the changelog, and the diffs yourself. The skill automates PR assembly. You are still on the hook for understanding how these library updates affect your project.
