---
title: "The Curse of Test Fixtures"
date: 2022-10-27T20:10:37-04:00
description: Please heed my warning or be cursed with coupled code!
images:
  - posts/2022/10/fixture-rant/chose-poorly.jpg
---

Please heed my warning or be cursed with coupled test code!

The general use case for test fixtures usually involves impure functions. These functions rely on an external collaborator and not just the incoming arguments of the function. Before the test runs, you want to put the world in a particular state. A common case is a database, your app's repository of entities.

You have choices for how to make this happen.

One choice/tool I observe many Elixir developers reaching for is [ex_machina], a fixture/factory tool. I've used it myself on many projects. It can be a productive addition. 

In short, `ex_machina` lets you build a factory of fixtures, even fixtures with relationships to other fixtures. When the time comes, you invoke `insert(:user)` in your test, and your database is populated with the generated data. The world is now set for you to test your `list_users/0` function.

[ex_machina]: https://github.com/thoughtbot/ex_machina

This is (usually) a poor choice.

![Test Fixtures: You Have Chosen Poorly](chose-poorly.jpg)

**The problem is coupling.** When you call `insert(:user)`, you are hard injecting the database with an assumption of what it means in the domain to "create a user". You probably have a real domain context that provides a `create_user/1` function. Instead of using it, you couple this test, which needs a user already in the system, with assumed implementation details. 

In the early days of a project, this raw database injection will likely be pretty close to what you have going on in `create_user/1`, but as the project evolves, these two paths can quickly diverge. The challenges and risks of maintaining parity between what it means to "create a user" through the domain context OR the factory's raw database injection will become an expensive burden. Still worse, when you want to refactor `create_user/1`, you can't -- at least not without touching every part of the test suite that used fixtures and made assumptions about the database layout.

The much better choice is to, when needed for impure tests, use your domain contexts to influence the world. 

Be extremely mindful of the API boundaries of your code. **Test the boundaries and NOT the implementation.**

Using real domain contexts to populate the world state can sometimes be slower. My suggestion is to swallow this slowness up front and only fallback to direct fixture injection when the testing performance needs are a good tradeoff for the cost of coupling. Since coupling will hamper refactoring, I consider that and HUGE tradeoff, and so it would take a significant speed difference to make me reconsider.

For more on this concern, check out Saša Jurić's Clarity talk. He talks of helper methods he usually makes, like `register!/1` at minute 38.

{{< youtube 6sNmJtoKDCo >}}
