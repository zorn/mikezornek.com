---
title: "Understanding when to use String-based Maps vs Atom-based Maps"
slug: string-vs-atom-maps
date: 2021-05-31T10:56:17-04:00
pain: "confusion about lack of consistency regarding string-based maps vs atom-based maps"
fix: "reaffirming the syntax rules and a guideline to follow in your own code"
---

_This post was originally written for my old ElixirFocus blog, and transfer here after its closure._

While browsing the ElixirForum the other day I spotted [this question](https://elixirforum.com/t/map-with-atom-string-keyword-list-its-blocking-me-so-much-as-a-beginner-elixr-enthusiast/39954) from Dominic which resonated deeply with my own experiences learning Elixir. Dominic asks:

> I'm constantly being blocked by maps' different construct `%{:atom => "value"}` vs. `%{"string" => "value"}` vs `%{name: "value"}`.
>
> It does not appears to be consistent enough and in my case are often the cause of all "blockage" I have.
>
> I understand them, I'm a long time Elm dev/fan and used to FP, but I don't know why Elixir's maps are so weird to me.

Later in the post Dominic notes he gets an error complaining about mixed keys: `(Ecto.CastError) expected params to be a map with atoms or string keys`.

So with all that said, why the lack of consistency? Why don't people just use String-based Maps or just use Atom-based Maps? Why do all these Phoenix tutorials jump from one to the other?

The short answer is, if given the opportunity I think most Elixir developers would lean on Atom-based Maps at all times, but we need to work within the constrains of our deployments. As preferable as `:atoms` may be they are not garbage collected and if you are allowing dynamic content into the system (from say a web request) and converting that content to Atom-based Maps you leave yourself open to running out of memory from a bad actor or even just natural system behavior. It is for this reason the web request tooling within Phoenix will transform those payloads into String-based Maps.

With that explanation out of the way, let's talk about Map syntax. While Dominic quotes three styles of map syntax there are really only two patterns to keep in your head:

- `%{"name" => value}` which is a Map syntax using the arrow `=>` token; and,
- `%{name: value}` which is an arrow-less version of the Map syntax made exclusively for Atom-based Maps.

The third style Dominic shared, `%{:atom => value}` I would group into the arrow `=>` camp. Maps can use Strings or Atoms as keys and so no real syntax sugar is present in this example.

I think one of the real jarring issues for people new to Elixir when it comes to the Atom-exclusive Map syntax is that it has the colon of the Atom key on the right-hand side. You'll see this with [Keyword lists](https://elixirschool.com/en/lessons/basics/collections/#keyword-lists) as well. Having multiple ways to express a Map can be one level of confusion, but then to combine it with multiple ways to express an `:atom` feels like a compounding problem.

The good news, I can share as someone who has been doing Elixir for a few years now, is that this confusion is **not** something I've experienced elsewhere in the language. On the whole I've found Elixir syntax to be straightforward and approachable. Getting comfortable with the Atom syntax sugar of Maps and Keyword lists took a little time but eventually it stuck.

One of the deeper concepts that comes out of this discussion however is the need for String-based keys from content outside the system. I think it is very helpful to have that external boundary in mind when building your code. Let the web or API contexts handle validating or shaping those String-based Map values and then have a meaningful transformation into the Atom-based Maps that will accept values for your core layer. With that pattern in mind your tests can follow along, simulating String-based Map payloads for controllers and Atom-based Map values for core context testing, and thus avoiding the kind of Ecto error Dominic shared.

For more on boundaries check out the [The Core and the Interface](https://medium.com/very-big-things/towards-maintainable-elixir-the-core-and-the-interface-c267f0da43) from the excellent Towards Maintainable Elixir series.
