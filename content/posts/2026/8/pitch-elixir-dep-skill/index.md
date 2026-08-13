---
title: "Pitch Elixir Dep Skill"
date: 2026-08-13T15:54:27-04:00
description: "something tweet like"
pain: "Elixir developer looking to dip there toe into AI skills or developer who is already confortable with skills and looking to enhance their own workflows"
fix: "Walk through what a skill is, how they work and then review the skill I lean on to update Elixir dependencies"
bob-promise: "readers walk away with some ideas for what to consider related to a dependency update skill, and an open source reference"
---

If you have or are considering experimenting with AI coding tools one feature of the code harness (the interactive shell you work with like [Claude Code](https://claude.com/product/claude-code) or [Pi](https://pi.dev/)) you'll run into are skills. 

## What is a Skill?

As described by the vendor neutral site [Agent Skills](https://agentskills.io/home):

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

If you have something you do regularly you can capture it as a skill. There is a loose [community specification](https://agentskills.io/specification) but lots of vendor specific settings out there as well. For example in Claude I utilize the `disable-model-invocation` to [limit some skills to a manual launch](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill) while many others can be invoked by the model directly. Skills can live in your global user account or inside a specific project.

## My first skill: update Elixir dependencies

I've long used [Dependabot to create pull requests](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/customizing-dependabot-prs) and otherwise signal that a given repo had out of date dependencies. 

One frustration (which can be resolve through better configuration) is I would prefer that dependabot grouped the updates together (I see no need to update Oban and Oban Web on separate PRs as an example). I also don't need to see this every day. Limiting to weekly or even monthly for quiet side projects is my preference.

The other frustration (or opportunity for improvement, hense the skill), is that the Dependabot PR will only every change the `mix.lock` file and while yes some simple updates are this easy, many other involve reading through the changelogs and code diffs to better understand how this change impacts my project and sometimes that means code changes should accompany the libary version bumps.

That is what my skill does:

- It identifies the outdated libraries
- Figues out what to update (the default is all, but I also kick off the skill with instructions to skip X and Y updates on occation because I am updating those later or they are know laggers)
- Apply the updates.
- Review the changelogs to understand what is changing and apply required changes.
- Verify the project still builds green with all [CI guardrails](/posts/2026/7/guarding-against-ai-drift/) in check. 
- Builds a PR with inline changelogs as well as links out to [hex diffs](https://hex.pm/diff/mint/1.9.1..1.9.3). The diffs are particularly helpful if I need to dig into for better confidence or personal curiousity (ie: this is how you improve your skills, by reading other people's code). The PR will also contain the transitive dependencies as those can sometimes have fun side effects too. 


Here is an output example from my [Flick project](https://github.com/zorn/flick/pull/184) and LocalCents project.

And here is [the skill itself](https://github.com/zorn/dotfiles/blob/main/claude/skills/elixir-deps-update/SKILL.md) for you to copy or draw inspiration from. I continue to update it over time, including [recent additions](https://github.com/zorn/dotfiles/blob/18877ea982570f39e78e39f18eeceee96b27111c/claude/skills/elixir-deps-update/SKILL.md?plain=1#L174-L186) to make sure any changelog with `#123` was not linking to my repo but instead the library repo.

## Read the code

This can feel repeativie if you read my other posts, but having a skill to automate the monotony does not obsolve you from reading the code, the changelog and the diffs yourself. This skill is all about automating the constuction. You are still on the hook for understanding how these library update effect your project.
