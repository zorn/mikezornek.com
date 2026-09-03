---
title: "One Pipe, One User Story: The Case for phoenix_test"
date: 2026-09-03T12:01:13-04:00
description: "Why phoenix_test makes Phoenix feature tests read better and fail more usefully."
pain: "Using the standard Phoenix test functions can result in clunky and hard-to-read code."
fix: "Using `phoenix_test` you can compose your tests from the perspective of your user and create more readable code."
bob-promise: "You'll walk away inspired to refactor your tests to improve readability."
tags:
  - elixir
  - web-development
  - software-craft
  - side-projects
---

While working on LocalCents, I had the opportunity to experiment with a lot of different tech, and one library that really impressed me was [`phoenix_test`](https://phoenix-test.hexdocs.pm/PhoenixTest.html). No better way to explain it than walking through the code.

Here is [a sample test](https://github.com/zorn/local_cents/blob/55fee004d7fb8b51b7178fcbbab52cb7673c0415/test/local_cents_web/live/book_live_test.exs#L125-L140) from LocalCents:

```elixir
test "adding an expense through the editor lists it", ~M{conn} do
  {:ok, book} = Tracking.create_book("Family Expenses")

  conn
  |> visit(~p"/books/#{book.id}")
  |> click_button("New Expense")
  |> within("#expense-editor", fn editor ->
    editor
    |> fill_in("Date", with: "2026-06-10")
    |> fill_in("Description", with: "Coffee")
    |> fill_in("Cost", with: "4.75")
    |> click_button("Create")
  end)
  |> assert_has("#expenses", text: "Coffee")
  |> assert_has("#expenses", text: "$4.75")
end
```

And here is an alternative using standard tooling:

```elixir
test "(alt) adding an expense through the editor lists it", %{conn: conn} do
  {:ok, book} = Tracking.create_book("Family Expenses")

  {:ok, view, _html} = live(conn, ~p"/books/#{book.id}")

  view
  |> element("button", "New Expense")
  |> render_click()

  view
  |> form("#expense-form",
    expense: %{date: "2026-06-10", description: "Coffee", cost: "4.75"}
  )
  |> render_submit()

  assert has_element?(view, "#expenses", "Coffee")
  assert has_element?(view, "#expenses", "$4.75")
end
```

Some of the reasons I prefer the `phoenix_test` style:

- I get to express the entire event chain as a single pipe. Every `phoenix_test` step takes the session and returns the session, so the chain never breaks. In the standard version, `render_click` and `render_submit` return rendered HTML, not the view, so each interaction is a dead end and you have to start a fresh pipe from `view`.
- The function names describe what the user sees, like a form input labeled `Date`, instead of asking me to know the DOM IDs.
- The default tooling has you build the form payload, and that is a poor choice for two reasons.
  - One, default tooling creates false confidence. If the submit button or field is removed or renamed, a test with a manually constructed payload still passes.
  - Two, default tooling requires the test to have implementation knowledge it should not possess. In general, tests should validate the API (in this case the web presentation) and avoid assumptions about implementation.
- I love how the `within` block looks as an inner pipe. It feels like a natural way to say "do something, and then do something on this new thing." It also disambiguates: when two buttons share the label `Delete`, scoping to `#delete-expense-modal` picks the right one.
- The library description says it "handles navigation between LiveView and static pages seamlessly. So, you don't have to worry about what type of page you're visiting. Just write the tests from the user's perspective." I didn't lean on that much with LocalCents, but for long integration flows, I'm sure it comes in handy.

When `has_element?/3` fails, you get:

```
1) test full editor (alt) adding an expense through the editor lists it (LocalCentsWeb.BookLiveTest)
   test/local_cents_web/live/book_live_test.exs:131
   Expected truthy, got false
   code: assert has_element?(view, "#expenses", "missing")
   arguments:

       # 1
       #Phoenix.LiveViewTest.View<id: "phx-GNHb1OqVudpb1gyB", module: LocalCentsWeb.BookLive, pid: #PID<0.608.0>, endpoint: LocalCentsWeb.Endpoint, ...>

       # 2
       "#expenses"

       # 3
       "missing"

   stacktrace:
     test/local_cents_web/live/book_live_test.exs:146: (test)
```

If you were using a (sadly) common assertion like...

```elixir
assert render(view) =~ "missing"
```

...you'd get the entire page's HTML posted to the console.

When `assert_has/3` fails, by contrast, you get the more useful:

```
1) test full editor adding an expense through the editor lists it (LocalCentsWeb.BookLiveTest)
   test/local_cents_web/live/book_live_test.exs:150
   Could not find any elements with selector "#expenses" and text "missing"

   Found these elements matching the selector "#expenses":

   <div id="expenses" class="flex min-h-0 flex-1 flex-col"><div class="m-4 bg-white rounded-lg overflow-hidden border border-surface-200 shadow-md shadow-primary-500/20 flex min-h-0 flex-1 flex-col"><div class="overflow-y-auto divide-y divide-surface-200/60 flex-1 [&amp;&gt;*:last-child]:border-b [&amp;&gt;*:last-child]:border-surface-200/60" style=""><button type="button" class="flex w-full items-center gap-4 px-4 py-3 bond-ink-hover-row transition-colors text-left cursor-pointer" style="--bond-ink: var(--color-primary-800)" id="expense-39b290db-097b-4ca7-b7a0-0f19be58d0c6" phx-click="edit_expense" phx-value-id="39b290db-097b-4ca7-b7a0-0f19be58d0c6"><span class="shrink-0 text-sm tabular-nums w-24 text-surface-600">
       06/10/2026
     </span><span class="flex-1 text-sm font-medium text-surface-800">
       Coffee
     </span><div class="flex items-center gap-1.5"></div><span class="shrink-0 text-sm font-bold tabular-nums w-16 text-right text-success-600">
       $4.75
     </span></button></div></div></div>
   code: |> assert_has("#expenses", text: "missing")
   stacktrace:
     (phoenix_test 0.12.1) lib/phoenix_test/assertions.ex:131: PhoenixTest.Assertions.assert_has/3
     (phoenix_test 0.12.1) lib/phoenix_test/live_view_timeout.ex:26: PhoenixTest.LiveViewTimeout.handle_watched_messages_with_timeout/4
     test/local_cents_web/live/book_live_test.exs:163: (test)
```

Scanning a focused HTML blob is so much nicer.

## Wait, there's more!

The `phoenix_test` library also ships with a Credo check: `PhoenixTest.Credo.NoOpenBrowser`.

> The `open_browser/1` function is useful during development but should not be committed in tests, as it would open browsers during CI runs, which can cause unexpected behavior and CI failures.
> 
> A Credo check that disallows the use of open_browser/1 in test code.

## Fight on the side of readable code!

In a world that is generating code by the ton, be the voice of sanity and push for more readable code!

Check out [`phoenix_test`](https://phoenix-test.hexdocs.pm/PhoenixTest.html) as a helpful weapon for the battlefield.
