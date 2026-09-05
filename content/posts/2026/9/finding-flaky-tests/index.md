---
title: "Finding Your Broken Glass: A Flaky Test Prompt for GitHub Actions"
date: 2026-09-05T09:59:03-04:00
description: "Your CI history already knows which tests flake. This prompt pulls the evidence, names the tests, and works out what the re-runs cost."
pain: "CI goes red on a test I never touched, so I click re-run and hope, and nobody on the team can say how often this happens or what it costs us"
fix: "define what a test flake is, list the usual Elixir causes, then hand over a prompt that reads your GitHub Actions history, names the confirmed flakes, and prices the re-runs"
bob-promise: "After reading this, you'll have a report with the names of your flaky tests and an annual dollar figure you can bring to your team to justify fixing them"
tags:
  - elixir
  - devops
  - practices
  - ai
---

There is this wonderful story from the development of the original Macintosh. While the processor powering the Mac was 10 times faster than the Apple II, it was still bound by the floppy drive's mechanical speed, which made things slow, particularly the boot sequence.

As Andy Hertzfeld tells it on [Folklore](https://www.folklore.org/Saving_Lives.html):

> Larry Kenyon was the engineer working on the disk driver and file system. Steve came into his cubicle and started to exhort him. "The Macintosh boots too slowly. You've got to make it faster!"
> 
> Larry started to explain about some of the places where he thought that he could improve things, but Steve wasn't interested. He continued, "You know, I've been thinking about it. How many people are going to be using the Macintosh? A million? No, more than that. In a few years, I bet five million people will be booting up their Macintoshes at least once a day."
> 
> "Well, let's say you can shave 10 seconds off of the boot time. Multiply that by five million users and thats 50 million seconds, every single day. Over a year, that's probably dozens of lifetimes. So if you make it boot ten seconds faster, you've saved a dozen lives. That's really worth it, don't you think?"

I like to think of this story when considering the time costs of flaky tests and long CI build times.

## What is a 'test flake'?

A test flake is when you have some logic in a test that can sporadically cause a test failure. Some common causes of this in my experience include:

- Unseeded randomness (see `:seed` [option](https://ex-unit.hexdocs.pm/ExUnit.html#configure/1-options)).
- Expecting a specific order in a returned list from Ecto when no deterministic `order by` has been added to the query. I feel like I see this show up more in CI because the database runners are cheaper CPUs.
- Some kind of `Process.sleep` in use to wait for some processing to be complete.
- Some wall clock dependency like `DateTime.utc_now()` that only fails on the 31st of the month or when UTC passes from one day into another.
- Shared mutable global state, be it from a GenServer, an ETS table, console logs, or an edited Application environment variable, especially when the test module is `async: true`.

## The costs of test flakes

You finish a feature and make a PR. You want to make sure the CI is green before tagging your peers for a code review. You wait, and then bam, you see a red X. You look at the test, and it has nothing to do with your changes, so you rerun the test suite looking for a better roll of the dice. Or maybe you got your approvals but want to do one final CI run with the latest `develop` branch merged in. Again a failure and again a rerun.

**Aside:** If you are a good developer you will capture the test flake as a new issue to be looked into later.

If you only run into a test flake once a month or so, that may be acceptable, but if you (and your peers) are seeing them multiple times per week, those costs add up.

Napkin math:

```
(N) test flakes failures per week
 x minutes of attention lost each
 x fully-loaded hourly rate
 x 52
= annual cost
```

If you see 3 test flakes a week, lose 10 minutes of attention, and are based on a salary/hourly rate of $90, that is a yearly cost of $2,340. If you have a team of 4 experiencing this, the cost is $9,360. That's real money.

Even more than money, the true cost may be developer happiness. If you do not prioritize fixing this broken glass on the floor, asking your developers to walk around it day to day, how does that make them feel? They are constantly being asked to build new things while the stuff in `main` is broken. How much does it cost to onboard a new developer after they leave?

Flaky tests also run counter to the concept of small, focused PRs, which are a huge help to those doing code review. If the overhead of PRs includes some subliminal awareness of test flakes, people might mistakenly be encouraged to make their current branch/PR larger.

## Finding your broken glass

If you are using GitHub Actions to power your CI, take advantage of the archives and logs. Use the prompt below to spot runs with 2 or more attempts and see real evidence of how bad flaky tests have been for you over the last month or two.

Open a terminal inside the root of your project, launch your AI tool of choice, and run this prompt. **Read the prompt before you run it.** Be paranoid about anyone on the internet telling you to paste something into a terminal, me included.

```
Use the `gh` CLI in this repository. Pick the GitHub Actions workflow
whose job runs the ExUnit suite (usually `mix test`, sometimes
`mix coveralls` or `mix check`) and name the workflow and that test
step in the report. Cover the last 30 days, capped at the most recent
500 runs that finished with success or failure, and widen to 60 days
if that holds fewer than about 100 runs.

1. Re-runs. Runs with attempt 2 or higher, as a count and a share of
   all runs, plus total re-run clicks (attempt minus 1, summed), and
   how many of those runs ended green on a later attempt.

2. Failure buckets. For every failed attempt of those runs, record
   one line per failed job with the step that failed, so an attempt
   can contribute more than one, and count them by bucket:
     - infrastructure: checkout, cache, setup, dependency install,
       coverage or artifact upload, runner timeout or lost runner
     - deterministic: compile, format, Credo, Dialyzer
     - test: the test step
     - other

3. Flaky tests. For every run in the test bucket, read the failed-step
   log and pull the ExUnit failure lines (test name and file). A test
   that failed and then passed on a later attempt of the same commit is
   a confirmed flake. List each with the number of runs it caused, most
   frequent first. Below the table, give one line per test that failed
   on a re-run run and never passed on that commit, labeled
   unconfirmed. Report how many failed test attempts had no readable
   log, so the list reads as a lower bound.

4. Wall clock. Job-minutes spent on re-run attempts, and p50 and p95
   duration of successful runs. If the job shape changed mid-window (a
   matrix or partition added), report each shape and use the current
   one below.

5. Cost. Convert to weekly figures and annualize each line. State
   these assumptions first so I can override them:
     - fully-loaded developer cost: $90 per hour
     - attention lost per re-run click: 10 minutes
     - target run duration: 10 minutes
     - share of green runs a person actively waits on: one in three
     - runner cost: $0.006 per job-minute
   Lines:
     - machine bill: re-run job-minutes x runner cost
     - re-run tax: re-run clicks x attention per click x hourly rate
     - wait tax: green runs x (p50 minus target, floor 0) x share
       waited on x hourly rate
   End with a one-line total and name the largest line.

Report each step as a short table, in order, opening with the window
and run count actually covered and closing with one note on what
stands out. Write the full report to `test-flake-report.md` and print
only the opening line and the total. `gh run list` shows only a run's
latest attempt; read
earlier attempts with
`gh api repos/{owner}/{repo}/actions/runs/{id}/attempts/{n}/jobs` and
`gh run view {id} --attempt {n} --log-failed`.
```

The report is saved to `test-flake-report.md` so you can share it with your team.

## What to do with the numbers?

If it is small, then congrats. Keep up the good work.

If it is not small, then spend some energy fixing those test flakes. Consider adding steps to your automated reviews to look for the test flake causes I listed above. Educate your team with a brief show-and-tell that highlights the numbers you landed on today.

If you need help, let me know. I work as an [Elixir consultant](/elixir-consulting/) and have helped many companies stabilize and improve their projects. See projects and testimonials on [the consulting page](/elixir-consulting/).

Good luck killing those flakes!
