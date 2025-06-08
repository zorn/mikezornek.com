---
title: "Understanding the Tradeoffs with Elixir Typespecs and Dialyzer"
date: 2021-01-20T08:51:42-05:00
description: Sadly when it comes to dialyzer errors that first error need not be what actually needs to get fixed. Many times you need to fix issues from the middle of the list first and knowing what to fix from that list is a learned art with its own dedicated learning curve.
---

In today's post I want to start a conversation around the tradeoffs of using [Typespecs](https://hexdocs.pm/elixir/typespecs.html) and [Dialyzer](http://erlang.org/doc/man/dialyzer.html) use in your Elixir code.

Elixir is a dynamic, not a statically-typed language -- and just to preemptively avoid the programming wars that might ensue, the given type system of a language is not a "good" or "bad" attribute by itself, but it will none-the-less influences the code we write.

For those who prefer or come to Elixir from a statically-typed language background you may be interested in learning more about [Elixir Typespecs](https://hexdocs.pm/elixir/typespecs.html), described in the documentation as follows:

> Elixir comes with a notation for declaring types and specifications. Elixir is a dynamically typed language, and as such, type specifications are never used by the compiler to optimize or modify code. Still, using type specifications is useful because:
>
> - they provide documentation (for example, tools such as [ExDoc](https://github.com/elixir-lang/ex_doc) show type specifications in the documentation)
> - they're used by tools such as [Dialyzer](http://www.erlang.org/doc/man/dialyzer.html) , that can analyze code with typespec to find type inconsistencies and possible bugs

While I have done some limited work with typespecs in my side projects, in my current client project the decree has been made we will define typespecs for all functions, both public and private, and we have dialyzer checks built into the CI to report any reported issues.

On the face of this requirement I do not have a problem, it is very well meaning towards building a stable codebase. Who can disagree with such a goal? The realties however of seeing it through day-to-day are more complex. First, let's talk about how dialyzer errors can sometimes be hard to debug.

One recent error I got back from dialyzer was something like this:

```
:0:unknown_type
Unknown type: Widget.t/0.
```

There was no function name, nor file name, nor line number to help me understand where this error was coming from. I was on my own. Luckily I knew the dialyzer check was clean before my I started my branch so I could at least look at my git diff for some ideas. This was not fun.

Another time I had a whole list of dialyzer errors reported back to me. Now if I was dealing with traditional complier errors I would work from the top of the list down, since sometimes when those first complier issues are resolved the later issues will disappear. Sadly when it comes to dialyzer errors that first error need not be what actually needs to get fixed. Many times you need to fix issues from the middle of the list first and knowing what to fix from that list is a learned art with its own dedicated learning curve.

Obtuse errors are bad enough but the second big issue for me is time. On a bigger project like ours it can sometime takes 10+ minutes to do a full dialyzer check the project. That long feedback loop can really slow down your day.

So where do we find the balance?

When it comes to Elixir code, my priorities of practices to enable a stable code base are as follows:

- First, write tests. Validate your code behaviors and assumptions. Check the happy paths and check the sad paths. Do this for every project you ever write.
- Second, use [credo](https://github.com/rrrene/credo). Credo can analyze your project for Elixir style and consistency. Credo is extremely fast with helpful error messages that teach you not only how to fix something but why it should be fixed. Use this on any project that you work on for more than a few days.
- Finally, use typespecs and dialyzer, but only for your public functions, and with a heavy leaning towards your own contexts and not the Phoenix-based modules that will be called based on dynamic behaviors like routes calling controllers. Use dialyzer for customer facing apps or anything open source.

Of course every project has unique needs and tradeoffs, but this is where I land in the general case.

I'd love to hear your thoughts on typespecs and dialyzer.
