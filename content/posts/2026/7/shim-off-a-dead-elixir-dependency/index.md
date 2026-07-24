---
title: "Shimming Your Way Off a Dead Elixir Dependency"
date: 2026-07-24T11:46:39-04:00
description: An abandoned dependency was blocking a major upgrade I needed. Here are the two ways I retire one, and when a shim beats a big-bang rewrite.
pain: on a long-lived Elixir project, a routine dependency bump stalls because an abandoned library pins an old version of a shared transitive dependency, and ripping it out means editing call sites everywhere in one scary PR
fix: two ways to retire a stuck dependency: a hard replacement when the footprint is small, or a shim you introduce and prove with comparison tests and then swap in at the call sites as a separate PR
bob-promise: after reading this you'll know how to retire an abandoned Elixir dependency incrementally, without a big-bang PR and without wondering whether you preserved its behavior
tags:
  - elixir
  - software-craft
---

On a recent client project, we set out to move [ex_money](https://hex.pm/packages/ex_money) to a new major version. That was already a meaningful piece of work in its own right, not a quick bump. But before I could even get started on it, the upgrade wouldn't resolve. The new `ex_money` wants `gettext` 1.0, but something else in the dependency tree was pinning `gettext` to 0.26. That something was [Timex](https://github.com/bitwalker/timex).

So the significant upgrade I actually cared about now had an unplanned prerequisite sitting in front of it: dealing with Timex. Timex had its time in the sun. For years, it was the go-to for serious date-and-time work in Elixir, back when the standard library didn't offer much in this area. But Elixir has steadily grown its own official date and time functions, and as it has, Timex's value has quietly diminished. The library also hasn't seen much activity in a while, and I've already removed it from a couple of other client projects ahead of this one. So my instinct wasn't to pin my way around the conflict. It was that Timex's time had come.

## When the footprint is small, replace it

If a dependency is only used in a handful of places, the honest move is the direct one: write the small bit of code you need and delete the dependency in the same pull request.

I did this on [Flick](https://github.com/zorn/flick), the codebase behind my [ranked voting app](https://rankedvote.app/). While bumping the project to Elixir 1.20, [Faker](https://github.com/elixirs/faker) wouldn't compile on the new version, and it was the only external library I used for fake data, in just two places (a seed script and a test). Reproducing that small piece with my own code was genuinely not much work, so I [did it in the same PR](https://github.com/zorn/flick/pull/171) and moved on.

## When the footprint is large, introduce a shim

Timex was woven all through this client project. Call sites were spread across the codebase, using a real range of Timex functions. A single PR that both deletes Timex *and* rewrites every one of those call sites would be enormous, hard to review, and risky to merge. That's the kind of change where a subtle behavior difference hides in the diff, and nobody catches it.

So I split the removal into two pull requests, using a shim. The first PR adds the shim. The second PR removes Timex and points the call sites at the shim instead.

The idea is to introduce our own module that mirrors the exact slice of the Timex API that the codebase actually calls, implemented using Elixir's standard library. The call sites don't care what's behind the function. As long as the shim answers `shift/2` and `format!/2` the same way Timex did, we can move the application onto it, and *then* delete Timex, as two separate, reviewable steps.

We were deliberate, almost stubborn, about one rule here: the shim had to accept the exact same arguments Timex accepted and return the exact same values Timex returned, even in the places where the standard library does things a little differently. The goal was never to write good date handling in the abstract. It was to reproduce Timex's behavior closely enough that dropping the shim in changes nothing the rest of the code can observe.

### Phase 1: build the shim and prove it

First I audited the codebase and made a list of every Timex function actually in use. Not all of Timex, just the parts this project touches. That list is the whole spec for the shim.

Then I wrote the shim against that list. Here's a simplified stand-in:

```elixir
defmodule MyApp.TimexShim do
  @moduledoc """
  A stand-in for the handful of Timex functions this app uses, backed by
  Elixir's standard library. Exists so we can retire the Timex dependency
  without rewriting every call site at once.
  """

  @doc "Mirror of `Timex.shift/2` for the offsets we actually pass."
  def shift(%DateTime{} = datetime, days: days) do
    DateTime.add(datetime, days, :day)
  end

  @doc "Mirror of `Timex.format!/2` for the format strings we actually use."
  def format!(%DateTime{} = datetime, "{YYYY}-{0M}-{0D}") do
    Calendar.strftime(datetime, "%Y-%m-%d")
  end
end
```

Notice what this module is *not*. It isn't a general date library, and it doesn't try to cover Timex's whole surface. It covers the specific calls this project makes, and it's happy to raise an error on anything it wasn't built for. That narrowness is the point. It's what makes the shim small enough to trust.

The part that actually bought us confidence was the tests. Because Timex is still installed during this phase, we could assert the shim against the real thing, side by side:

```elixir
defmodule MyApp.TimexShimTest do
  use ExUnit.Case, async: true

  @sample ~U[2026-07-24 12:00:00Z]

  test "shift/2 matches Timex for a day offset" do
    assert MyApp.TimexShim.shift(@sample, days: 3) ==
             Timex.shift(@sample, days: 3)
  end

  test "format!/2 matches Timex for our date format" do
    assert MyApp.TimexShim.format!(@sample, "{YYYY}-{0M}-{0D}") ==
             Timex.format!(@sample, "{YYYY}-{0M}-{0D}")
  end
end
```

These comparison tests earned their keep (in the real project there were many more than the two shown here), because Timex does not always agree with the standard library on the edges. A formatting token, a week that starts on a different day, a rounding decision. Pinning the shim directly against Timex's output surfaced those differences while I could still see both answers, instead of discovering them in production after Timex was already gone. This is a temporary scaffold on purpose: these particular tests only work while Timex is still a dependency, and they get deleted in phase 2.

All of that, the shim plus its tests, ships as one pull request. Crucially, it changes no behavior yet. Nothing in the app calls the shim. It's new code alongside the old, fully tested, easy to review, safe to merge.

### Phase 2: swap the call sites and delete Timex

The second pull request does the mechanical work: replace `Timex.shift(...)` with `MyApp.TimexShim.shift(...)` at each call site, drop the comparison tests that referenced Timex directly, and remove Timex from `mix.exs`. Because phase 1 already proved the shim matches, this PR is a lot of small, boring, obviously-correct substitutions rather than a pile of judgment calls. And with Timex out of the tree, the original upgrade that started this whole thing finally goes through.

### After that: erode the shim on your own schedule

The shim isn't meant to be a permanent fixture. Once Timex is gone, the codebase is calling `MyApp.TimexShim` everywhere, and that's a fine place to sit indefinitely. But it's also a natural starting point for cleanup. Whenever I'm already working in a file that calls the shim, I can replace that one call with the plain standard-library equivalent (`DateTime.add/3`, `Calendar.strftime/2`, whatever it maps to) and delete a bit of the shim as it stops being used. There's no big PR for this and no deadline. The shim shrinks in small chunks as the code gets touched for other reasons, until one day it's empty and I delete the module. The urgent work (getting off the aging dependency) is already done; this last part is just tidying, and it can happen whenever it's convenient.

## The textbook names for what we just did

Everything above has been written up before, by people smarter than me. Three names in particular are worth carrying around.

The shim is a **seam**. In *[Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/)*, Michael Feathers defines a seam as ["a place where you can alter behavior in your program without editing in that place."](https://www.informit.com/articles/article.aspx?p=359417&seqNum=2) That's precisely what the shim gives you: a spot where the behavior behind Timex can change without touching the call sites, and later a spot where you can pull Timex out entirely.

The comparison tests are **characterization tests**, also from Feathers: tests that don't assert what the code *should* do in the abstract, but capture what it *actually* does today, so you can change the implementation underneath and know the observable behavior held.

And the two-phase move (grow the replacement behind a seam, route to it, then retire the old thing) is the **[strangler fig](https://martinfowler.com/bliki/StranglerFigApplication.html)** pattern, just at the scale of a single dependency instead of a whole system.

The reason I like reaching for the shim on the big jobs isn't that it's clever. It's that it turns one frightening pull request into two calm ones, and it puts the risky part (does the shim really behave like the old library?) under test before any call site depends on the answer.

## A note on the idiomatic alternative

If you've written much Elixir, you may be reaching for the adapter/behaviour pattern right now: a `behaviour`, a facade that `defdelegate`s to an implementation chosen from config, backends swapped per environment ([Aaron Renner's walkthrough](https://aaronrenner.io/2023/07/22/elixir-adapter-pattern.html) is good). It's a great pattern, but it solves a different problem. Adapters are built to keep two implementations around behind the seam on purpose (a fake in tests, a real service in prod). The shim is the opposite: a one-way migration aid with no config and no second backend, meant to get a dependency out of the tree and then be whittled down and deleted. Different goal, so a lighter tool.

Is there a dependency you've cut from a project recently that you were weirdly excited to see go? Tell me about it. [Let me know.](/contact/)
