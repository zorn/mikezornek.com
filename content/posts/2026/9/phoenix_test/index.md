---
title: "The code readibiluity of `phoenix_test` is not to be slept on"
date: 2026-09-03T12:01:13-04:00
description: "something tweet like"
pain: "Using the standard Phoenix test functions can result in cluncky and hard to read code."
fix: "Using `phoenix_test` you can compose your tests through the perspective of your user and create more readabile code."
bob-promise: "You'll walk away inspired to refactor your tests to improve readbility."
---

While working on LocalCents I had the opportunity to experiment with a lot of different tech and one library that really impressed me was [`phoenix_test`](https://phoenix-test.hexdocs.pm/PhoenixTest.html).

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

- I get to express the entire event chain as a single pipe.
- The function names represent what the user sees, a form input with the label `Date` and does not ask of me to know the dom IDs.
- Additionally, the logic of the functions executes against the actual form. If the label text changed, or the field were removed from the form, the test fails.
- The default tooling has you build the form payload and that is a poor choice for two reasons.
  - One, it creates a false confidence. If the buttons are removed, forms hidden, or labels renamed, a test with a manually constructed form payload will still pass.
  - Two, it requires the test perspective to have implementation knowledge it should not posses. In general, tests should validate the API (in this case the web presentation) and avoid assumptions about implementation.   
- On that same angle the default tooling never 
- I love how the `within` block looks as an inner pipe. Just feels like a natural presentation of doing something, and then do something on this new thing.
- A main goal stated by the library description goes "handles navigation between LiveView and static pages seamlessly. So, you don't have to worry about what type of page you're visiting. Just write the tests from the user's perspective". I did not need to utilize that much with LocalCents, but for long integration flows I'm sure it comes in handy.

When `has_element?/3` fails you get:

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

If you were using a common assertion like...

```elixir
assert render(view) =~ "missing",
```

...you'd get the entire HTML blob posted to the console.

However, When `assert_has/3` fails you get the more useful:

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

The `phoenix_test` library also ships with a credo rule: `PhoenixTest.Credo.NoOpenBrowser`.

> The `open_browser/1` function is useful during development but should not be committed in tests as it would open browsers during CI runs, which can cause unexpected behavior and CI failures.
> 
> A Credo check that disallows the use of open_browser/1 in test code.

## Fight on the side of readable code!

In a world that is generating code by the ton, be the voice of sanity and push for more readable code! 

Check out [`phoenix_test`](https://phoenix-test.hexdocs.pm/PhoenixTest.html) as a helpful weapon for the battle field.
