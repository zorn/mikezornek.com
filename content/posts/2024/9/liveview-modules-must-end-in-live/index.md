---
title: "LiveView Modules Must End in `Live`"
date: 2024-09-03T20:32:57-04:00
description: A review of the technical situation where the `Live` suffix is more than an optional naming pattern.
---

When working with [LiveView] you'll notice people naming modules with the suffix `Live`, as seen in module names like `FlickWeb.Ballots.IndexLive` or `FlickWeb.Vote.VoteCaptureLive`.

[LiveView]: https://hexdocs.pm/phoenix_live_view/welcome.html

A student I was mentoring once asked me what that `Live` suffix was for and if it was required.

We drafted some simple LiveView demos with modules that did not end in `Live,` and things worked fine. I had a gut feeling that this was required, but I could not put my finger on it.

Today, I was reminded when and why you need the `Live` suffix.

When using the [`live/4`](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.Router.html#live/4) router macro, you can optionally include an action like `:new` and `:edit` as seen in the examples below.

```elixir
live "/ballot/new", Ballots.EditorLive, :new
live "/ballot/:url_slug/:secret/edit", Ballots.EditorLive, :edit
```

This `action` name will be available in the live view's `socket.assigns.live_action` and can be a helpful signal when you are utilizing a live view for multiple purposes, such as a form for creation or a form for mutation, depending on the URL.

Should you use `action` names, your `LiveView` **must** end with `Live`. If it does not, you'll see a compiler error like:

```
== Compilation error in file lib/flick_web/router.ex ==
** (ArgumentError) could not infer :as option because a live action was given
and the LiveView does not have a "Live" suffix. Please pass :as explicitly or
make sure your LiveView is named like "FooLive" or "FooLive.Index"
  (phoenix_live_view 0.20.17) lib/phoenix_live_view/router.ex:479: Phoenix.LiveView.Router.inferred_as/3
  (phoenix_live_view 0.20.17) lib/phoenix_live_view/router.ex:409: Phoenix.LiveView.Router.__live__/4
  lib/flick_web/router.ex:36: (module)
```

Looking over the [related source code](https://github.com/phoenixframework/phoenix_live_view/blob/f778e5bb1a4b0a29f8d688bbc6c0b7182dea51ca/lib/phoenix_live_view/router.ex#L470-L487) I kind of suspect this assumption could be removed in the future, but seems like a low impact and pain level so, meh.

I am happy to rediscover and document this. Hopefully, the explanation was helpful.
