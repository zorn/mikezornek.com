---
title: "Elixir Terminology: Parameters vs Attributes"
slug: "parameters-vs-attributes"
date: 2021-09-13T10:00:00-04:00
description: When we say "parameters" we are usually talking about data coming into the system from external actors; When we say "attributes" we are usually talking about internal Elixir structures.
tags: [terminology, naming]
pain: confusion about seeing the two terms for roughly the same behavior
fix: an explanation of the differences
next action: next
back of the book promise: promise 
---

_This post was originally written for my old ElixirFocus blog, and transfer here after its closure._

I've written about being [explicit and mindful about programming terminology][1] before and today we'll look at another specific Elixir terminology example: parameters vs attributes.

[1]: https://elixirfocus.com/posts/programming-terminology/

If you create a new Phoenix app and use the generators to stub out a simple CRUD experience you will no doubt observe web controller functions like:

```elixir
defmodule HelloWeb.PostController do
  # ...
  def create(conn, %{"post" => post_params}) do
    case Blog.create_post(post_params) do
      # ...
    end  end
end
```

And internal schema module functions like: 

```elixir
defmodule Hello.Blog.Post do
  # ...
  def changeset(post, attrs) do
    post
    |> cast(attrs, [:body, :word_count])
    |> validate_required([:body, :word_count])
  end
end
```

Observing function argument names like `post_params` (short for parameters) and `attr` (short for attributes) how do we reconcile those naming choices?
 
## Parameters

When we say "parameters" we are usually talking about data coming into the system from external actors, like a user POST-ing data from a web form or an API accepting a request. Parameters are generally considered unsafe. Since the contents are dynamic they will almost always be made from maps using string keys to avoid the known runtime capacity limitations of `:atom` keys.

## Attributes

When we say "attributes" we are usually talking about internal Elixir structures. When a function accepts a simple map argument labeled `attr`, as seen in our example, I think we can lean on the [definition for attribute][2] which says, "a quality, character, or characteristic ascribed to someone or something". 

[2]: https://www.merriam-webster.com/dictionary/attribute

While `attr` is a community norm for incoming function arguments, there is an unfortunate overlap with some official Elixir terminology. A [module attribute][3] is how we describe those at sign (`@`) declarations like `@email` below.

[3]: https://hexdocs.pm/elixir/Module.html#module-module-attributes

```elixir
defmodule ContactSupport do
  @email "zorn@elixirfocus.com"
end
```

***

Short post today, but hopefully some helpful context about some community naming norms.
