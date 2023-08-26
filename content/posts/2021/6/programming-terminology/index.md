---
title: "Improve the Clarity of Your Elixir Code Through Expressive and Consistent Language"
slug: "programming-terminology"
date: 2021-06-06T12:00:00-04:00
---

_This post was originally written for my old ElixirFocus blog, and transfer here after its closure._

One of our primary day-to-day responsibilities as programmers is to communicate. We need to express our ideas, explain our work and document our code. Having a strong vocabulary and explicit intentions behind the words you (and your team) choose can greatly help avoid confusion. 

Take some time as a team to talk about how you name and describe things. Embrace productive confrontation when you identify inconsistencies and work towards creating (and documenting!) as much as a ubiquitous language as you can.

The following is a collection of terms I try to be mindful of in my own work. Hopefully this list helps inspire some of your own terminology choices.

## Programming Terminology

### Entity vs Value

An **entity** is a structure that has identity. An `Account` in my application has a unique identifier and is thus is considered an entity. 

A **value** is a structure without identity. A `Color` in my application might be made up of three scalars like red, green and blue. Collectively they make up the `Color` value but there is no identity.

Some people might prefer the term **record** instead of entity in this context. I consider the terms fairly similar so would honor my team's chosen preference.

### Entity vs Row

Sometimes when we talk about entities we'll get into the deeper discussions of how the entities are persisted, usually inside a database At that point I make a special case to change how I talk, being more explicit about the **database row**. Entity is how I refer to the in-memory representation of the structure, but if we are talking about database storage or SQL-specific things I want to use the term **row** to be more explicit.

### Maps vs Structs vs (Ecto) Schemas

**Maps**, **Structs** and **(Ecto) Schemas** are all Elixir structure tools that we use to create entities and values. Each of these tools has their own purpose and constrains so I try to be explicit when talking about which tool we are using.

### Create vs New vs Insert and Remove vs Delete

As you define the core domain nouns of your app you'll inevitably start to build out a series of modules that help you manage these nouns. When designing the interfaces of these modules have an explicit pattern for how to name behaviors and try when possible to lean on community patterns. Ask yourself, "how does the Elixir language or popular frameworks use these terms?"

<figure class="">
 <a href="delete-new-search.png">
 <img class="" style="max-width: 50%; "src="delete-new-search.png" alt="Delete and New as used inside of Elixir."></a>
 <figcaption class="">Delete and New as used inside of Elixir.</figcaption>
</figure>

You can also take advantage of the various Phoenix/Ecto generates for a peek at some pattern recommendations from the framework authors. These are usually a great place to start, although I don't consider the patterns to be gospel.

In addition to the working on the names of the modules functions themselves, you may also be involved in the user experience of an app and its own terminology. Ideally the nouns and terms from the interface down through the code will align but this is not always possible. Sometimes the needs of the user experience design require the terminologies to deviate. While not ideal, I'm fine with this -- it just has to be done with intent and consistency. Write down the terms you have chosen and why.

### Get vs Fetch

There are a few notable Elixir patterns to be mindful of with the terms `get` vs `fetch`.

First let's check out [Map.get/3](https://hexdocs.pm/elixir/Map.html#get/3) which will return a value for the given key or a default value if the key is not found. 

```elixir
iex> Map.get(%{}, :a)
nil
iex> Map.get(%{a: 1}, :a)
1
iex> Map.get(%{a: 1}, :b)
nil
iex> Map.get(%{a: 1}, :b, 3)
3
```

Next we have [Map.fetch/2](https://hexdocs.pm/elixir/Map.html#fetch/2) which will return an :ok tuple or :error if the key is not found.

```elixir
iex> Map.fetch(%{a: 1}, :a)
{:ok, 1}
iex> Map.fetch(%{a: 1}, :b)
:error
```

There is also a bang version of fetch, [Map.fetch!/2](https://hexdocs.pm/elixir/Map.html#fetch!/2) which will return the value or raise an exception if the key is not found.

```elixir
iex> Map.fetch!(%{a: 1}, :a)
1
```

The takeaways from these language patterns I take note of are the following:

* `get_noun` should return the value or a default if not found.
* `fetch_noun` should return a `:ok` tuple or an `:error` tuple.
* Any function with a bang (exclamation point) will throw an exception, and that exception should be documented inside the inline documentation.
* In general I try to avoid creating bang style functions as I feel like Elixir exceptions should be exceptional. You may notice that the there are Phoenix code generators out there that will create a `get!` style functions in generated contexts. That is pattern I am aware of but question in newer code.

### List vs Array

I do my best to be mindful of and embrace the terminology of the language I am working in, moment to moment. This means if we are dealing with a collection in Elixir I'll say list and when we are dealing with a collection is JavaScript I'll say array. In an Elixir context I'll say map and in a JavaScript context I'll say dictionary.

For a junior programmer this might seem like symantec nonsense but I think its an important distinction. Related, I honor the styles of the host language, for example using camel case for variables in JavaScript and underscores in Elixir. With luck a linter of some kind can help remind me if I loose my place.

### Behavior vs Feature 

When talking about what my code does I use the term behavior. I describe the behaviors I want to build and I document the behaviors I observe.

The term feature is more a product or marketing term, usually describing a collection of end user observable behaviors. 

## App and Business Domain Consistency

### Document Your App's Custom Terminology

While I have some personal preferences to share below, ultimately every app will have a custom vernacular for how they label things in the system. Spend some time getting team agreement on the meaning and intent behind these terms. Write them down. Review and evolve the glossary when needed. Having alignment on this language will be extremely helpful over time as you discuss what to code needs to do.

### Authentication vs Authorization

Many people simply talk about "auth" systems without being explicit but it's important to distinguish between authentication, figuring out who you are talking to, and authorization, figuring out if someone should be allowed to do something. 

### Sign in vs Log in

My own preference here is to use Sign in, Sign out and Sign up. I'm also ok with other variants like "Create Account" in the user experience as long as we are consistent.

I dislike log in since it is too easy to mix up the term "login" vs "log in".

### Account vs User and Settings vs Preferences

No strong personal preferences here, would have to consider the application context -- but once again I am looking for consistency. If I were debating choices for a new app with my team I'd look at some industry competition to see what they do.

## Language I Try to Avoid

### Bad Code and Code Smell

I do my best to follow the [retrospective prime directive](https://easyretro.io/retrospective-prime-directive/) which states:

> Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand.

Believing this, I try to avoid saying something is "bad code" or has a "code smell". Those phrases package a lot of negative judgement which is not very constructive. Instead let's look for opportunities to improve testability, or documentation or abstractions. No one wrote this "bad code" intentionally to sabotage the system. We are all members of an extremely immature and fast moving industry with diverse backgrounds and levels of experience. It is messy out there and everyone is learning as we go.

If you are doing a code review, instead of saying something has a "code smell", kickstart a discussion around getting more context around the decisions and constrains that led to this code's design. Ask if they considered an alternative or are aware of your concerns. These pull requests are opportunities for education and starting the process with judgement language is not going to result in many positive outcomes.

* * *

You might also enjoy:

* [Video: Building Beautiful Systems With Phoenix Contexts and Domain-Driven Design](https://www.youtube.com/watch?v=5MBGDM8xSQg)
* [Domain-Driven Design Glossary](https://devonburriss.me/ddd-glossary/)

* * *

What did I miss? What terminology are you protective of in your own code? Let me know: <mike@mikezornek.com>.
