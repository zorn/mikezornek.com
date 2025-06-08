---
title: "Elixir Style: Prefer Unnested Aliases"
slug: "style-aliases"
date: 2022-04-01T12:31:06-04:00
description: I recommend avoiding nested aliases since it negatively impacts your ability to text search a project for module usage.
---

_This post was originally written for my old ElixirFocus blog, and transfer here after its closure._

In Elixir, `alias` is a keyword we often use to create shorthand references to long-form module names allowing us to refer to `RetroTaxi.Boards.Board` simply as `Board`.

You'll often end up with a collection of `alias` declarations at the top of a module, and Elixir offers two ways to format these.

One way is simple list such as:

```elixir
alias RetroTaxi.Boards.Board
alias RetroTaxi.Boards.Column
alias RetroTaxi.Boards.TopicCard
```

The other way is an optional nested list like:

```elixir
alias RetroTaxi.Boards.{Board, Column, TopicCard}
```

Sometimes this nested list is broken across separate lines and presented like:

```elixir
alias RetroTaxi.Boards.{
    Board,
    Column,
    TopicCard
}
```

## Style Recommendation

I highly recommend avoiding this nested presentation. The primary reason is to help keep the codebase plain-text searchable. By avoiding the nesting, you can quickly find which modules are referencing any module simply by searching for its name string like `RetroTaxi.Boards.Column`. Finding nested aliases would require a more complex regular expression or language server tooling.

If you want to enforce this style with a credo, check out [Credo.Check.Readability.MultiAlias] which is usually disabled on a default credo install.

[Credo.Check.Readability.MultiAlias]: https://hexdocs.pm/credo/Credo.Check.Readability.MultiAlias.html
