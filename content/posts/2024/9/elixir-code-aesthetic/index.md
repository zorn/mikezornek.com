---
title: "Personal Elixir Code Aesthetics"
date: 2024-09-29T20:25:46-04:00
description: With my side project Flick hitting an MVP milestone and inspired by some conversations during Elixir Book Club, I thought I’d take a moment to document some code aesthetic choices I made in this project.
---

With my side project [Flick] hitting an MVP milestone and inspired by some conversations during [Elixir Book Club](https://elixirbookclub.github.io/website/), I thought I'd take a moment to document some code aesthetic choices I made in this project.

The order below is not ranked in importance. In fact most of this is nitpicky, but still my preference.

[Flick]: https://github.com/zorn/flick

## Whitespace between import and alias. 

## Alphabetically ordered alias declarations.

## Avoiding multi-alias declarations.

```elixir
  # lib/flick/ranked_voting.ex 
  import Ecto.Query

  alias Flick.RankedVoting.Ballot
  alias Flick.RankedVoting.Vote
  alias Flick.Repo
```

Whitespace should be done with intention to separate distinct concepts; and for me, `import` and `alias` are distinct concepts. 

I also list my `alias` declarations in alphabetical order, enforced via [`AliasOrder`] and use a preferred order across `use`, `import`, `alias`, and `require` via [`StrictModuleLayout`]. 

[`AliasOrder`]: https://hexdocs.pm/credo/Credo.Check.Readability.AliasOrder.html
[`StrictModuleLayout`]: https://hexdocs.pm/credo/Credo.Check.Readability.StrictModuleLayout.html

I prefer to avoid multi-`alias` declarations like `alias Flick.RankedVoting.{Ballot, Vote}` since it makes searching the code base for module names harder to do. This is enforced with [`MultiAlias`].

[`MultiAlias`]: https://hexdocs.pm/credo/Credo.Check.Readability.MultiAlias.html

## (Generally) prefer multiline do/end functions.

```elixir
defp page_title(:edit), do: "Edit Ballot"
defp page_title(_), do: "Create a Ballot"
```

Unless I can express a group of functions in a simple stack (like the above code) I generally prefer multiline `do/end` function declarations. One reason for this preference is that my code editor can collapse the whole module in a nice way, making during exploration easier.

```elixir
# This could be one line, but I prefer multiline do/end.
def get_ballot!(ballot_id) do
  Repo.get!(Ballot, ballot_id)
end
```

## Use consistent DSL layout in test modules.

```elixir
# test/flick/ranked_voting_test.exs
describe "update_ballot/1" do
  test "success: updates a ballot title and questions" do
    # ...
  end

  test "failure: `question_title` is required" do
    # ...
  end

  test "failure: can not update a published ballot" do
    # ...
  end
end
```

Test files can generally end up 2 or 3 times the line count of the module under test. To help keep this code organized and easy to navigate I use a style where I will list the function under test using `describe` and then various `success` and `failure` expectations in each `test`. For functions like `list_ballots/1` that can't fail, one might drop the `success` label, but looking at my code as it stands today, it looks like I kept it. 🤷‍♂️

I have far less consistency with my LiveView tests. Sometimes the `describe` [breaks out new vs edit logic](https://github.com/zorn/flick/blob/main/test/flick_web/live/ballots/editor_live_test.exs), other times it [breaks out with or without authentication](https://github.com/zorn/flick/blob/main/test/flick_web/live/ballots/index_live_test.exs) paths. I'm still evolving this and welcome ideas and good examples.

## Invest in test fixtures

Arrange, Act, Assert. To help keep your arrange logic neat and tidy, invest in good test fixture tooling. These test fixtures should provide functions for entity creation in your test files as well as the known list of argument defaults (for tests that need to do something more custom but do not want to be burdened with a complete understanding of every argument). 

These fixtures should use the actual domain context paths for creation and not raw SQL injection unless absolutely needed for performance or edge cases.

```elixir
# test/support/fixtures/ballot_fixture.ex
defmodule Support.Fixtures.BallotFixture do
  @moduledoc """
  Provides functions to allows tests to easily create and stage
  `Flick.RankedVoting.Ballot` entities for testing.
  """

  alias Flick.RankedVoting.Ballot

  @doc """
  Returns a map of valid attributes for a `Flick.RankedVoting.Ballot` entity,
  allowing for the passed in attributes to override defaults.
  """
  @spec valid_ballot_attributes(map()) :: map()
  def valid_ballot_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      question_title: "What day should have dinner?",
      possible_answers: "Monday, Tuesday, Wednesday, Thursday, Friday",
      url_slug: "dinner-day-#{System.unique_integer()}",
      published_at: nil
    })
  end

  @doc """
  Creates a `Flick.RankedVoting.Ballot` entity in the `Flick.Repo` for the passed in
  optional attributes.

  When not provided, all required attributes will be generated.
  """
  @spec ballot_fixture(map()) :: Ballot.t()
  def ballot_fixture(attrs \\ %{}) do
    attrs = valid_ballot_attributes(attrs)
    {:ok, ballot} = Flick.RankedVoting.create_ballot(attrs)
    ballot
  end

  @doc """
  Creates a `Flick.RankedVoting.Ballot` entity in the `Flick.Repo` for the passed in
  optional attributes and then publishes the ballot.

  When not provided, all required attributes will be generated.
  """
  @spec published_ballot_fixture(map()) :: Ballot.t()
  def published_ballot_fixture(attrs \\ %{}) do
    attrs = valid_ballot_attributes(attrs)
    {:ok, ballot} = Flick.RankedVoting.create_ballot(attrs)
    {:ok, published_ballot} = Flick.RankedVoting.publish_ballot(ballot)
    published_ballot
  end
end
```

Aside: I hate how the typespecs here use `map()` for the attribute map. I want to make that more detailed in the future, see [issue #4](https://github.com/zorn/flick/issues/4).

## Use tiny_maps to save horizontal line space in tests.

```elixir
test "success: submitting valid form creates ballot and redirects", ~M{view, ballot} do
  # ...
end
```

When composing my test descriptions, I like to get the `test "..." do` on a single line. To help achieve that, I use the [tiny_maps](https://github.com/abshierjoel/tiny_maps) library to help me express repetitive argument maps with a more concise syntax: `~M{view, ballot}` expands to `%{view: view, ballot: ballot}`. I generally limit this syntax sugar to test files but would not be against using it in the main source in the future.

## Compose code to prefer clean line breaks

I love that Elixir ships with an opinionated formatter. However, even with the formatter, you still have a lot of influence on how your code is composed. I prefer it greatly when expressions are clean one-liners or otherwise avoid excessive indentation when breaking up complex terms. 

To help explain, let me walk you through a test from Flick.

```elixir
test "success: submitting valid form creates ballot and redirects", ~M{view} do
  payload = %{
    question_title: "What's your favorite color?",
    possible_answers: "Red, Green, Blue",
    url_slug: "favorite-color"
  }
  
  response =
    view
    |> form("form", ballot: payload)
    |> render_submit()
  
  # Assert upon submit the page redirects, and the ballot was created.
  assert {:error, {:redirect, %{to: redirect_target}}} = response
  assert "/ballot/favorite-color/" <> secret = redirect_target
  assert %Ballot{} = RankedVoting.get_ballot_by_url_slug_and_secret!("favorite-color", secret)
end
```

First, let's take note that `response` is captured in its own line group. Technically, you could compose `render_submit()` to happen on the same line as `assert`, but by capturing `response` using its own line group, it helps separate the `act` vs. `assert` test concepts and avoids a very complex indentation variant.

```elixir
# A complex multiline expression with lots of indentation, I am trying to avoid.
assert {:error, {:redirect, %{to: redirect_target}}} =
         view
         |> form("form", ballot: payload)
         |> render_submit()
```

Next, let's look at the pipe feeding `response`. You could compose the code like this:

```elixir
response =
  view
  |> form("form", ballot: %{
      question_title: "What's your favorite color?",
      possible_answers: "Red, Green, Blue",
      url_slug: "favorite-color"
  })
  |> render_submit()
```

I dislike this composition since it breaks the pipe. By moving the `payload` value assignment to its own line group, we end up with a cleaner pipe that, in my opinion, reads better. 

```elixir
payload = %{
  question_title: "What's your favorite color?",
  possible_answers: "Red, Green, Blue",
  url_slug: "favorite-color"
}

response =
  view
  |> form("form", ballot: payload)
  |> render_submit()
```

## Embrace pipelines with custom utility functions.

```elixir
# lib/flick_web/live/ballots/index_live.ex
def mount(_params, _session, socket) do
  socket
  |> assign(:page_title, "Admin: Ballots")
  |> assign(:ballots, Flick.RankedVoting.list_ballots())
  |> ok()
end
```

```elixir
defmodule FlickWeb.LiveViewPipes do
  @moduledoc """
  A collection of functions to help express pipes when processing live view responses.
  """

  alias Phoenix.LiveView.Socket

  @spec ok(Socket.t()) :: {:ok, Socket.t()}
  def ok(%Socket{} = socket), do: {:ok, socket}

  @spec noreply(Socket.t()) :: {:noreply, Socket.t()}
  def noreply(%Socket{} = socket), do: {:noreply, socket}
end
```

Many LiveView functions require tuple return values like `{:ok, socket}` or `{:noreply, socket}`. To help allow call sites to be composed as a single pipeline, I use some utility functions like `ok()` and `noreply()`.

## Be consistent between module names and filenames.

If I have a module called `Flick.RankedVoting.RankedAnswer` it lives at the filepath `lib/flick/ranked_voting/ranked_answer.ex`

While I have good consistency inside my core domain contexts, this consistency fails with various Phoenix things. For example, `FlickWeb.Ballots.EditorLive` lives at `lib/flick_web/live/ballots/editor_live.ex`. I dislike that Phoenix generators put these modules in a folder called `live` that the module path does not express. I may fix that in the future.

Related blog post: [LiveView Modules Must End in `Live`](https://mikezornek.com/posts/2024/9/liveview-modules-must-end-in-live/)

## Write professional documentation.

```elixir
  @doc """
  Publishes the given `Flick.RankedVoting.Ballot` entity.

  Once a `Flick.RankedVoting.Ballot` entity is published, it can no longer be updated.
  Only a published ballot can be voted on.
  """
```

All public functions, especially those that represent the formalized domain API for your system, should get documentation.

Each documentation block should start with a single-line, terse summary, as those are used by `ex_doc` and other developer tooling to summarize function indexes. Every so often, look at the collection of function summaries of a module and try to make them all use consistent phrasing like "Returns noun given thing..." or "Raises `Blah` when stuff...".

If referencing another module, function, or callback, use backticks to help the documentation system generate hyperlinks.

Use [rewrap tools](https://github.com/stkb/Rewrap) to hardwrap characters to 80 columns to help with GitHub diffing and more presentable Markdown.

## Document your decisions.

Programming is all about tradeoffs. When making an intentional design or process decision with other valid approaches available, consider documenting what was considered and why you went with your approach. Your future self and peers will thank you.

I've [documented some things](https://github.com/zorn/flick/tree/main/docs/decisions) related to timestamps, schema shape, and fixme/todo so far in Flick.

## Make sure each FIXME has an issue URL. 

Related to the above decisions, Flick [allows FIXME comments](https://github.com/zorn/flick/blob/main/docs/decisions/3-fixme-and-todo.md) but requests all `FIXME`s include a link to a GitHub issue documenting the concern.

## Avoid abbreviations and prefer expressiveness.

Prefer expressive variable names like `_ballot` over `_`. 

Prefer expressive variable names like `ballot_params` over `params` when you think it helps improve clarity.

## Words matter.

Invest time in an expressive and consistent [ubiquitous language](https://github.com/zorn/flick/blob/main/docs/ubiquitous_language.md) for your project. Continue to edit it over time as the terms evolve.

Find consistency in your project code regarding terms like `create` vs. `new`, `update` vs. `edit`, `submit` vs. `save`, `params` vs. `attributes`. 

Do your best to align with existing Elixir community norms.

## Craft typespecs to express your domain.

All public functions should have a typespec. Private functions can also have typespecs, depending on whether they will help with code clarity or change confidence.

Spend time and make those typespecs match the domain. For example, when accepting the identity of a `Ballot` use the `Ballot.id()` not a `Ecto.UUID.t()`.

```elixir 
  # lib/flick/ranked_voting/ballot.ex
  @type id :: Ecto.UUID.t()
```

When building types for my main domain entities, I tend to build the main `t()` around a persisted entity value that is brought into memory from a `Repo`, and thus all post-creation values like `id` or `updated_at` are typed to their expected value, without the need for an `| nil` addendum. 

To help write typespecs for non-persisted structs of this schema type, I make a `schema_t()` variant.

```elixir
  @typedoc """
  A type for a persisted `Flick.RankedVoting.Ballot` entity.
  """
  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          question_title: String.t(),
          description: String.t() | nil,
          url_slug: String.t(),
          secret: Ecto.UUID.t(),
          possible_answers: String.t(),
          published_at: DateTime.t() | nil
        }

  @typedoc """
  A type for the empty `Flick.RankedVoting.Ballot` struct.

  This type is helpful when you want to typespec a function that needs to accept
  a non-persisted `Flick.RankedVoting.Ballot` struct value.
  """
  @type struct_t :: %__MODULE__{}
```

Spend time writing `typedoc` documentation, it can be a helpful space to talk out the reasoning behind some of the types.

In addition to writing typespecs, when composing functions I also prefer pattern matching the struct and using guards to be explicit about incoming argument expectations.

```elixir
  def change_ballot(%Ballot{} = ballot, attrs) when is_map(attrs) do
    # ...
  end
```

Dialyzer is not a runtime enforcement tool, but these are. They help enforce expectations earlier in the call stack and thus help you become aware of when things are not as they seem sooner.

## Document your dependencies.

To help future you know why various dependencies were added to the project, add a minimal description before listing it.

```elixir
  defp deps do
    # ...

    # For Observability.
    {:appsignal_phoenix, "~> 2.5"},
  
    # To Render Markdown.
    {:earmark, "~> 1.4"},
  
    # For security scans.
    {:sobelow, "~> 0.13", only: [:dev, :test], runtime: false},
  end
```

## Document and validate function options.

```elixir
  # lib/flick/ranked_voting.ex

  @doc """
  ...

  ## Options

  * `:action` - An optional atom applied to the changeset, useful for forms that
    look to a changeset's action to influence form behavior.
  """
  def change_vote(%Vote{} = vote, attrs, opts \\ []) do
    opts = Keyword.validate!(opts, action: nil)

    # ...
  end
```

If you offer a function that accepts options as the final argument, document them and validate them.

Validation helps ensure call sites do not include unexpected or typoed option keys and offers a clean space to provide a default value for the said option.

Aside: Not currently demonstrable in Flick, but is in some of my work project, I usually write rich typespecs for my options as well.

## Compose PR titles for clarity and consistency.

With Flick, I work in focused PRs and have those PRs titled for clarity regarding what is changing. I like using prefixes like `fix` `chore` `feat`. These PR titles are enforced with a specific [GitHub Action workflow](https://github.com/zorn/flick/blob/main/.github/workflows/lint-pr.yaml). These PRs are squash merged and make for a (hopefully) readable `main` branch.

In the future, I might even be able to automate this to help with release notes.

## Strive for database precision.

Be detail-oriented when building out your database tables. 

If something can not be null, be explicit `NOT NULL`. 

If a string can be really long, use `:text`. If you do use `:string` (which has length limits), then enforce those length limitations in `Ecto.Changeset` so the value is not trimmed quietly.

Virtual fields on Ecto schemas are almost never the right answer.

***

That was quite the hodgepodge of suggestions and tips. I had others, but they did not fit, or I don't have good open source references yet. 

If you liked these or disagree, [let me know](/contact). 
