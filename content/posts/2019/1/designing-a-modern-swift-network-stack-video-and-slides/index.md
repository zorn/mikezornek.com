---
title: "Designing a Modern Swift Network Stack, Video and Slides"
date: 2019-01-15T15:00:00-05:00
tags:
  - ios
---

**UPDATE 1.16:** Fixed some slide typos (didn't bother to edit video). If you spot anymore, [let me know](/contact). Thanks!

I had a great time doing this networking design talk for the local [Philly CocoaHeads](http://phillycocoa.org/). If you watch the video and have feedback, I'd love to [hear it](/contact) as I may revamp this talk for a 2.0 version in the future.

<iframe src="https://player.vimeo.com/video/311520171" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

- [Video on Vimeo](https://vimeo.com/311520171) 44 minutes
- Slides [PDF](modern-ios-network-zornek-slides.pdf) / [SpeakerDeck](https://speakerdeck.com/zorn/designing-a-modern-swift-network-stack)

# Designing a Modern Swift Network Stack

When an app is young and has simple networking needs it's not uncommon to use URLSession tasks directly inside of a view controller. However as the app needs grow to include things like authenticated requests, token renewal, testing, cancellation, caching and more -- you'll want to have a more defined networking stack to lean on. On a client project over the summer, the iOS team and I started to document a networking wish list and over the past few months we've started to execute it, first on some smaller features and a demos app. Now we are preparing for a new greenfield iOS app where we should be able to hit the ground running with our new ideas.

In this talk I'll review the network design we've come up with. I'll demo what we have working and talk about how we want to extend it in the future. Attendee should walk away with new ideas that they can integrate into their own networking stacks.

{{< figure src="highres_477725961.jpeg"
  caption="Philly CocoaHeads, Mike Zornek"
  alt="Me presenting in a red polo shirt, gesturing beside my projected title slide 'Designing a Modern Swift Network Stack,' as attendees watch from a table." >}}

{{< figure src="highres_477725960.jpeg"
  caption="Philly CocoaHeads, Group Shot"
  alt="A wide view of the Philly CocoaHeads meetup room: attendees at tables with laptops face the front, where I stand beside a screen reading 'Hello,' with pizza boxes on a side table." >}}

{{< figure src="highres_477725968.jpeg"
  caption="Philly CocoaHeads, Slopes"
  alt="Curtis Herbert presenting his Slopes skiing app on the projector at Philly CocoaHeads, with several attendees seated and watching." >}}

{{< figure src="highres_477725971.jpeg"
  caption="Philly CocoaHeads, Group Shot"
  alt="The Philly CocoaHeads meetup room during a sponsor slide for 'The Meet Group,' attendees working on laptops at tables." >}}
