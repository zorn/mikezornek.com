---
title: "Putting Zoom in Quarantine"
date: 2020-04-09T16:03:22-04:00
---

I've already blogged about my [interest in finding a Zoom alternative](http://mikezornek.com/posts/2020/3/zoom-google-hangout-alternatives/) for my own [groups](https://www.meetup.com/PhillyElixir/) and [meetings](http://mikezornek.com/posts/2020/4/open-office-hours/) but sadly it's not a platform I can completely shun since I have personal connections that still use it heavily.

First a small update on my alternatives...

I had high hopes for [Jitsi](https://jitsi.org/). Being open source was a huge plus for me, but sadly when we tried it out at my Elixir meeting, we ran into multiple technical problems.

At said meeting we eventually jumped to [Whereby](https://whereby.com/). Whereby feels like it's more suited for small groups, and our group is small so we were able to use it without issue.

In addition to the technical success, the user experience of Whereby was also enjoyed by the attendees. It was fully featured and worked well in our personal web browser of choice. Today while doing some more research I was also happy to see Whereby's [privacy statement](https://whereby.com/information/tos/privacy-policy/) was written in plain English and seemed reasonable.

Moving forward, I think I'll be leaning on Whereby when I have control. 

For my Zoom-choosing communities, I first tried just using the browser version with my copy of Firefox, but that [did not go over well](https://microblog.mikezornek.com/2020/04/07/tried-to-join.html). Zoom web wants Chrome and once again, I would prefer not to install Chrome for privacy reasons. 

I then tried a [Docker containerized version of Zoom](https://github.com/mdouchement/docker-zoom-us) but quickly discovered it expects a Linux host and does not work with Mac OS.

In lieu of Chrome I finally installed [Iridium Browser](https://iridiumbrowser.de/), which is a open source project that takes the open source base of Chrome, [Chromium](https://www.chromium.org/Home), and removes all of the Google phone home and related features. Today I was able to use Iridium to participate in a Zoom call with moderate success. I still had to sign in to a Zoom account which is not very comforting, and the Zoom web UI is not a 1:1 match to its desktop cousin (one feature it lacks is gallery mode, which I like to use) -- but it did work.

Despite some improvements, Zoom [security issues](https://citizenlab.ca/2020/04/move-fast-roll-your-own-crypto-a-quick-look-at-the-confidentiality-of-zoom-meetings/) continue to come out on regular basis. I hope in time I can drop it entirely, but for now I feel like limiting my interactions with a mostly isolated Iridium Browser will do.

If you are in control of a Zoom meeting, please consider researching you own replacement. Hopefully this info will help towards that end.
