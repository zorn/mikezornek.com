---
title: "Personal Phoenix 1.6 Upgrade Notes"
slug: "phoenix-1.6-upgrade-notes"
date: 2021-10-18T12:00:00-04:00
description: Over the past few days I've been upgrading my projects to Phoenix 1.6 and like any project that comes out of a template-based generator, migrating a Phoenix project to a new version can be a little scary and error prone, particularly for people new to Elixir and Phoenix. Today I'll share some personal notes and tips to help make the process a little smoother.
pain: confusion and scared about editing generated templates
fix: some tips for success
next action: update your project
back of the book promise: after reading this post you'll have a battle plan to update to Phoenix 1.6
---

_This post was originally written for my old ElixirFocus blog, and transfer here after its closure._

Over the past few days I've been [upgrading my projects to Phoenix 1.6][1] and like any project that comes out of a template-based generator, migrating a Phoenix project to a new version can be a little scary and error prone, particularly for people new to Elixir and Phoenix. Today I'll share some personal notes and tips to hopefully make the process a little smoother.

[1]: https://github.com/elixirfocus/retro_taxi/pull/24

## Step 0: Skip the Manual Upgrade (Maybe?)

Depending on the scale and circumstances of your project you might consider just re-generating a new project using `mix phx.new` and bringing over your old code into the fresh template. I wouldn't recommend this for any project that had meaningful git history or other collaborators, but for smaller personal projects it might be the path of least resistance.

You'll probably want the new project generator regardless and can install it with:

```bash
$ mix archive.install hex phx_new
```

## Step 1: Familiarize Yourself with the New Version

Before blindly attempting the upgrade it would be best to read the [official blog announcement][blog], review the [project changelog][changelog] and preview [Chris McCord's personal upgrade notes][migrationguide]. You might want to also bookmark documentation for specific new features, like [heex templates][heex].

[blog]: https://www.phoenixframework.org/blog/phoenix-1.6-released
[changelog]: https://github.com/phoenixframework/phoenix/blob/3ba0f6fc3407d4ddc08c05715ff8b24cb367d8bd/CHANGELOG.md#160-rc0-2021-08-26
[migrationguide]: https://gist.github.com/chrismccord/2ab350f154235ad4a4d0f4de6decba7b
[heex]: https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.Helpers.html#sigil_H/2

## Step 2: Get Your Project is a Stable State

Make sure your project is building clean, the tests are passing and the typespecs are um, type spec-ing. Push your changes to remote and start a new `upgrade-phoenix` branch. It would be best if you work through the upgrade in chunks and verify these things as you go.

## Step 3: Update Elixir and Project Dependencies

If you can, now is a good time to explicitly require Elixir 1.12 as the minimum version of your project. This is not an absolute requirement, but as described in the [heex docs][heex], it will improve your error messages:

> Note: HEEx requires Elixir >= 1.12.0 in order to provide accurate file:line:column information in error messages. Earlier Elixir versions will work but will show inaccurate error messages.

```elixir
  # mix.exs
  def project do
    [
      # ...
      elixir: "~> 1.12",
    ]
  end
```

If you are using an [asdf](https://asdf-vm.com/) for version management you might also want to update your `.tool-versions` file as well.

Next run `mix hex.outdated` to see what dependency updates are available. You'll see a bunch of stuff for the new Phoenix 1.6 release, which at the time of this post is up to `1.6.2`. For one of our currently outdated projects I get the following:

```bash
$ mix hex.outdated
Dependency              Current  Latest   Status
credo                   1.5.6    1.5.6    Up-to-date
dialyxir                1.1.0    1.1.0    Up-to-date
ecto_sql                3.6.2    3.7.1    Update possible
floki                   0.29.0   0.31.0   Update not possible
gettext                 0.18.2   0.18.2   Up-to-date
jason                   1.2.2    1.2.2    Up-to-date
mix_test_watch          1.0.3    1.1.0    Update possible
phoenix                 1.5.9    1.6.2    Update not possible
phoenix_ecto            4.3.0    4.4.0    Update possible
phoenix_html            2.14.3   3.0.4    Update not possible
phoenix_live_dashboard  0.4.0    0.5.3    Update possible
phoenix_live_reload     1.3.3    1.3.3    Up-to-date
plug_cowboy             2.5.1    2.5.2    Update possible
postgrex                0.15.10  0.15.12  Update possible
telemetry_metrics       0.6.1    0.6.1    Up-to-date
telemetry_poller        0.5.1    1.0.0    Update not possible
```

Using the above collection of versions you can update your `mix.exs` deps list. To verify these work try running the following commands in series:

- `mix deps.clean --all`
- `mix clean`
- `mix deps.get`
- `mix compile`
- `mix test`

Fix any issues that popup and then you can commit your progress and start to consider some of the optional parts of the 1.6 upgrade.

## Step 4: Migrate to `heex` Templates (optional)

The new template system is called `heex` (pronounced `heaks`) and is more HTML-aware, helping report issues like missing `div` tags at compile time. The new `heex` templates will help resolve a notable collection of common LiveView and CSS bugs as well as provide nicer inline functions.

While `heex` templates are great they are optional for now. Previous `eex` and `leex` templates still work but are considered deprecated. If you want to start to migrate to `heex` I would check out [the docs][heex] for a quick overview and then start renaming your file extensions like:

- `app.html.eex` to `app.html.heex`
- `live.html.leex` to `app.html.heex`

For inline templates you'll use the new `~H` sigil instead of `~L` sigil.

As you make these changes the compiler will inform you what needs updating. For my own RetroTaxi project most `heex` updates involved migrating HTML attributes like:

```diff
- <div id="topic-card-<%= @topic_card.id %>">
+ <div id={"topic-card#{@topic_card.id}"}>
```

and

```diff
- <button phx-click="start_discussion_phase" phx-target="<%= @myself %>"
+ <button phx-click="start_discussion_phase" phx-target={@myself}
```

I also ended up using the new `<.form>` component, which honors the tag aware templates while also addressing a [known technical limitation](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#module-change-tracking-requirement) of `live_components` being wrapped in a block, which is a common pattern inside forms.

```diff
- <%= f = form_for @changeset, "#", phx_submit: "save", phx_target: @myself %>
- <!-- stuff -->
- </form>
+ <.form let={f} for={@changeset} phx_submit={"save"} phx_target={@myself}>
+ <!-- stuff -->
+ </.form>
```

## Step 5: Migrate to esbuild (optional)

With Phoenix 1.6 all new project templates will default to [esbuild] over the historic webpack for asset bundling. This was a change made in an effort to improve long term stability, as npm and webpack have been a huge source of bugs and maintenance issues inside the Phoenix project. This is however an optional change when upgrading older Phoenix projects.

[esbuild]: https://esbuild.github.io/

If you already have invested in any webpack customizations you might just want to keep using it.

If your needs are simple and you'd like to give esbuild a spin it can be swapped in without too much work. Chris McCord's [upgrade document][migrationguide] has an in-depth set of edits you can follow. I did those steps myself with RetroTaxi and then once I got it all working, went back and re-added my Tailwind dependencies following [Mike Clark's blog post][tailwind]. I ended up with a very basic [package.json](https://github.com/elixirfocus/retro_taxi/blob/main/assets/package.json) file.

[tailwind]: https://pragmaticstudio.com/tutorials/adding-tailwind-css-to-phoenix

> Aside: One notable question I still have regarding esbuild is the new command: `mix assets.deploy`. It seems curious to me that running this with the new `.gitignore` patterns results in a dirty git state. Is this wanted/expected behavior? If you have any thoughts let me know.

## Step 6: The Little Things

There are lots of little things you can notice comparing your current Phoenix 1.5 project with a freshly generated 1.6 project. In fact I recommend using `mix phx.new hello` (substituting your own project name for `hello` to help with easier copy and paste) and then compare the new project files 1:1 against your current project. You'll no doubt notice things like:

- the move from `use Mix.Config` to `import Config` and other related config file changes.
- the addition of [Swoosh](https://github.com/swoosh/swoosh), an email composition and delivery tool, to your project dependency list.
- how the path of assets in an esbuild setup will effect your `.gitignore` file and other template references.
- the introduction of `topbar` as a static JS library replacing the previous `NProgress` dependency.
- slight changes to the generated telemetry descriptions.
- slight changes to how the Ecto sandbox is started during test mode.
- new complier warning suppressions for LiveDashboard, which will intentionally not be available in production by default.

For RetroTaxi I tried to honor these changes as much as possible.

One helpful tool to do this kind of template comparison at a glace is PhoenixDiffs:

<https://www.phoenixdiff.org/?source=1.5.12&target=1.6.0>

## My Final Upgrade PR and Next Steps

The final RetroTaxi Phoenix 1.6 upgrade PR is here if you want to take a peek:

<https://github.com/elixirfocus/retro_taxi/pull/24/>

One new feature I have my eye on but did not get around too (yet) is [Phoenix.Component](https://hexdocs.pm/phoenix_live_view/Phoenix.Component.html). I should be able to use this in favor of some historic stateless `LiveComponent` modules, which is no longer recommended, as seen in the docs quoted below:

> Note: previous LiveView versions allowed the `:id` to be skipped on `live_component` but those are now discouraged since the addition of function components, outlined in `Phoenix.Component`.

---

Hopefully these notes provide some help and comfort as you upgrade your own Phoenix projects to 1.6. I'm curious how we can continue to improve this process in the future and even have my eye on some new Elixir [1.13 changes](https://hexdocs.pm/elixir/master/changelog.html#extended-code-formatting) that could help by "supporting developers who wish to create tools that directly manipulate and custom format Elixir source code".

Thanks again to the entire Phoenix team for an outstanding release!
