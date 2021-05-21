---
title: "Hostname-based Privacy Tools Need to Evolve For Websocket Concerns"
date: 2021-05-20T20:30:00-04:00
description: How do we block ads and tracking data if they use the same hostname/websocket of the original website?
---

I'm a privacy advocate. I use Firefox as my main browser. I install adblock browser extensions. I block ads from within my network router. Most of these privacy tools rely on the fact most ads and tracking happen through JavaScripts which are embedded alongside the websites we are visiting and send tracking data to a third party hostname. We know these hostnames are suspect and so we block the connections outright. 

But what if the ads and tracking were to flow through the same hostname of the original website? What if the ads and tracking were woven though the same websocket connection that the main site ran through? How would we be able to block that?

Persistent websocket connections are the backbone for anything on the modern web that is collaborative or realtime. [Phoenix LiveView](https://github.com/phoenixframework/phoenix_live_view) is a library I personally enjoy using to build websocket-powered apps. A similar library called [Turbo](https://github.com/hotwired/turbo) is also out there for Rails.

Having knowledge of how websockets work, how JavaScript tracking works and how privacy tools work -- I have a growing concern that as we see more prevalent hostname-based privacy tools get traction amongst the casual web userbase the ads and tracking software is likely to evolve and may move into the websocket space. If it does I'm concerned it will be very difficult to separate the traffic of the main website one is trying to engage with and the ads and tracking bits that flow inside the same pipe to the same host.

I don't have much to else to add. I have no answers, just concerns. Is anyone else working on this right now?
