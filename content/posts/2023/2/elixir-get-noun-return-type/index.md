---
title: "Elixir Context Accessor Function: Which Return Type Do You Prefer?"
date: 2023-02-12T13:55:42-05:00
description: something tweet like
---

During a recent [Elixir Book Club](https://elixirbookclub.github.io/website//) meeting we had a back and forth discussion on a simple code style question:

When providing an accessor function inside your domain context, do you prefer a return type of `{:ok, noun} || {:error, :not_found}` or `noun || nil` ?

In my own historical work I've generally followed along with common Phoenix generator style of building out functions like `get_noun/1` that return the `noun` or `nil` but moving forward I think I'll be preferring `fetch_noun/1` functions that use an `:ok` / `:error` tuple style return type. 

The primary reason is expressiveness in the crash logs. Eventually there will be some crash and the stacktrace is going to show `nil` being passed into some function, and the function having an expectation of a real value type. In those moments it can take some time to understand where the hell `nil` is coming from. I think an error like `noun_not_found` will be more helpful.

I want to start keeping track of these personal preferences and so today I've also made a new guide for the Franklin project documenting [Code Style: Context Accessors](https://github.com/zorn/franklin/blob/main/guides/code_style/context_accessors.md). There is some more background and reasoning about my preferences inside should you be interested.

While that guide expresses a preference towards `fetch_noun/1` and the `:ok` / `:error` tuple return type, it also acknowledges that it might be helpful and supportive for the context to offer **multiple** accessor functions allowing the call sites to use whichever one is more appropriate.
`
How about yourself? What return type do you prefer and why? [Let me know.](/contact)
