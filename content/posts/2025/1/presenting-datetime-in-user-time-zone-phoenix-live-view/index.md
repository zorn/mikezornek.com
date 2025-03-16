---
title: "Phoenix LiveView: Presenting DateTime in User's Time Zone"
date: 2025-01-22T19:47:37-05:00
description: This past weekend, I added a feature to Flick (RankedVote.app) where we now present domain-specific `DateTime` values, like `published_at` and `closed_at`, on the live view page using the user's time zone. I thought I'd capture some notes on how this was accomplished, some known limitations, ideas to solve those in your own work, and a set of resource links to learn more.
images:
  - posts/2025/1/presenting-datetime-in-user-time-zone-phoenix-live-view/days-since-last-timezone-issue.png
---

This past weekend, I added a feature to Flick ([RankedVote.app]) where we now present domain-specific `DateTime` values, like `published_at` and `closed_at`, on the live view page using the user's time zone. I thought I'd capture some notes on how this was accomplished, some known limitations, ideas to solve those in your own work, and a set of resource links to learn more.

[RankedVote.app]: https://rankedvote.app/

## Elixir time zone basics

Out of the box, when working with Elixir [`DateTime`] values, you can only create values relative to the `Etc/UTC` time zone. If you want to represent values in other time zones, you will need a time zone database.

The Elixir docs discuss this and [link a few options](https://hexdocs.pm/elixir/DateTime.html#module-time-zone-database). For this post and the Flick project, I choose [`tzdata`], and the following paragraphs will reference it specifically. However, the Elixir runtime is very flexible if you prefer another.

[`DateTime`]: https://hexdocs.pm/elixir/DateTime.html
[`tzdata`]: https://hex.pm/packages/tzdata

To add the dependency to your project, you'll add it to the `deps` list in the `mix.exs` file.

```elixir
# mix.exs
defp deps do
  [  
    # ...
    {:tzdata, "~> 1.1"}
  ]
end
```

Then, you'll need to configure it as your `:time_zone_database` in the `config/config.exs` file.

```elixir
# config/config.exs
config :elixir, :time_zone_database, Tzdata.TimeZoneDatabase
```

With that in place, you can create values in a time zone.

```
iex> DateTime.new(~D[2016-05-24], ~T[13:26:08.003], "America/New_York")
{:ok, #DateTime<2016-05-24 13:26:08.003-04:00 EDT America/New_York>}
```

## The user's time zone

When I say `User` here, I refer to the web browser client requesting a web page from our server. 

Sadly, when displaying a `DateTime` value in this user's response, we are hampered by the fact that we do not know their time zone. The time zone is not included with the HTTP request. 

Assuming the browser renders the page in an environment that executes JavaScript, the most approachable way to get this is via a function call like:

```javascript
Intl.DateTimeFormat().resolvedOptions().timeZone
```

[MDN Reference for `DateTimeFormat`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

**Aside:** Curiously, the time zone and locale details of the user's environment are not part of a permission prompt flow even though they leak sensitive data IMO. If viewing the page, assume you are giving up that info.

So, how do we use this relative to our live view page?

The first thing we will do is edit our `assets/js/app.js` file. We want to query the browser for the time zone and send it to LiveView via the `params` of the `LiveSocket`.

```javascript
// assets/js/app.js
let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")

// Add this.
let time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone 

let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  // And `time_zone` here.
  params: { _csrf_token: csrfToken, time_zone: time_zone } 
})
```

From your live view module's `mount/3` function, you can access this `time_zone` value like:

```elixir
  def mount(params, _session, socket) do
    # ...

    # The `time_zone` value will only be available when the live view is
    # rendering a `connected?/1` socket, so make sure to define a default.
    time_zone = get_connect_params(socket)["time_zone"] || "UTC"

    # ...
  end
```

Once you have the time zone value, any domain-specific `DateTime` you are storing in UTC can be converted using `DateTime.shift_zone/2` for display to the user.

For the needs of my side project, I made a dedicated module called `Flick.DateTimeFormatter`, which helps me shift the `DateTime` values and format them to an expected style. It looks something like:

```elixir
  def display_string(date_time_value, time_zone) do
    case DateTime.shift_zone(date_time_value, time_zone) do
      {:ok, date_time_in_time_zone} ->
        Calendar.strftime(date_time_in_time_zone, "%B %-d, %Y %-I:%M %p %Z")

      {:error, reason} ->
        {:error, reason}
    end
  end
```

With this in place, I can display a `DateTime` value from any live view in the user's time zone.

A full implementation can be found in [the Flick PR](https://github.com/zorn/flick/pull/137/files) if you want more reference materials. 

## This is a half solution.

You might recall in a code comment above, I said: 

```txt
The `time_zone` value will only be available when the live view is
rendering a `connected?/1` socket, so make sure to define a default.
```

You might also recall that when a user requests a URL, the live view first renders a non-connected DOM state. This DOM is delivered to the browser, and only then is a WebSocket established, and thus the live view becomes "connected".

The outcome of this and the design of our solution is that the user will see the `DateTime` value rendered in `UTC` first (our default) and then flash into the browser's time zone as the WebSocket becomes connected.

That kind of sucks, but for the simple needs of Flick, this felt acceptable and is where I left it.

## Designing a more complete solution.

In a previous project, I built a meetup group platform. It had to display lots of `DateTime` values, and this kind of flashing would not have been acceptable.

For that project, we created a stack of fallback time zones.

1. When a user created their meetup group, they defined a default display time zone for the group. This was our fallback default.
2. When a web visitor was on the page, we [executed JavaScript](#errata) that would `PUT` the observed time zone we saw and then on the backend inside a standard controller we would [store the time zone inside the session](#errata). This would be our ideal default, and would generally be available on everything except the user's first page load of the site.

## A Hook-based approach.

LittleAccountOfCalm of Reddit also [suggests](https://www.reddit.com/r/elixir/comments/1i84ptj/comment/m8qdgal/):

> Pardon me, but why not render a `<local-time phx-hook="LocalTime" id={@id} class="invisible">{@date}</local-time` component, that has a js-hook like:

```javascript
Hooks.LocalTime = {
  mounted() {
    this.updated();
  },
  updated() {
    let dt = new Date(this.el.textContent);
    this.el.textContent = Intl.DateTimeFormat("default", {
      dateStyle: "medium",
      // timeStyle: "short",
    }).format(dt);
    this.el.classList.remove("invisible");
  }
}
```

I recall seeing approaches like this before and you correct that this is just as reasonable of a solution for Flick's needs.  I vaguely recall requirements that made it a non-option for my other project (maybe due to time zone presentation in email copy) but a great addition to the post. Thanks for sharing!

## Other Resources

I'll leave you out with some related resources. Good coding, and if you have any questions, [reach out](/contact).

- Elixir's [`DateTime`] docs are great and worthy of re-read.
- My [Flick PR](https://github.com/zorn/flick/pull/137/files) where I added this feature.
- [Date and Time · Elixir School](https://elixirschool.com/en/lessons/basics/date-time/)
- I gave a talk [Working With Time Zones in an Elixir Phoenix App](/posts/2020/3/working-with-time-zones-in-an-elixir-phoenix-app/) back in 2020 at a local meetup. I have the video, but the embed on that page is currently down. Slides are there, which might be interesting. 
- There was an amazing talk at ElixirConf 2022 [Kip Cole - Time algebra: a new way to think about and work with time](https://www.youtube.com/watch?v=4VfPvCI901c). This strays from the practical demonstrations of this post but was a memorable talk that impressed me.
- DockYards had their own recent demo blog post, which aligns with many of the things shared here: [Getting and Displaying the User's Local Time in LiveView](https://dockyard.com/blog/2024/10/15/getting-displaying-users-local-time-liveview)
- [Simon Willison: Storing times for human events](https://simonwillison.net/2024/Nov/27/storing-times-for-human-events/)

## Errata

I originally posted this with some links to a private repo. I'm not in a place to make that repo public but will recreate the linked code below.

```javascript
// assets/js/app.js
// "When a web visitor was on the page, we executed JavaScript that would PUT the observed time zone we saw..."
window.addEventListener('DOMContentLoaded', (event) => {
    if (document.head.dataset.timezone == 0) {
        let user_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        console.log('User timezone was unknown on dom load. Sending user timezone (' + user_timezone + ') to server.');
        fetch(location.protocol + '//' + location.host + '/timezone?iana=' + encodeURIComponent(user_timezone))
            .then((response) => {
                console.log(response);
            });
    }
});
```

```elixir
# lib/guildflow_web/controllers/subdomain/timezone_controller.ex
# "... and then on the backend inside a standard controller we would store the time zone inside the session."
def index(conn, %{"iana" => iana}) do
  if Enum.member?(Timex.timezones(), iana) do
    conn
    |> put_session("timezone", iana)
    |> render("index.html", user_timezone: iana)
  else
    user_timezone = get_session(conn, "timezone")

    render(conn, "index.html",
      user_timezone: user_timezone,
      page_title: "User Session Timezone Status"
    )
  end
end
```
