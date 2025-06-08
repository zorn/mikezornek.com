---
title: "Is WebKit Sabotaging the Future of the Open Web?"
date: 2020-07-06T17:10:19-04:00
description: Just to be clear, I am a privacy advocate. I use DuckDuckGo. I use Firefox. I block ads. I encrypt my DNS lookups. I'm building a privacy-focused tool for meetups. And with all that said, this worries me.
---

This didn't get much press at the time, but during WWDC the WebKit team listed [a bunch of web technologies they will apparently not be implementing](https://webkit.org/tracking-prevention/) in the name of privacy.

> Fingerprinting involves measuring the uniqueness of static device configuration (e.g. built-in hardware), dynamic device or browser configuration (e.g. user settings or installed peripherals), and user browsing data (e.g. checking which sites the user is logged in to, so-called login fingerprinting).
>
> WebKit’s first line of defense against fingerprinting is to not implement web features which increase fingerprintability and offer no safe way to protect the user. Here are some examples of features we have decided to not implement in part due to fingerprinting concerns:
>
> - Web Bluetooth
> - Web MIDI API
> - Magnetometer API
> - Web NFC API
> - Device Memory API
> - Network Information API
> - Battery Status API
> - Ambient Light Sensor
> - HDCP Policy Check extension for EME
> - Proximity Sensor
> - WebHID
> - Serial API
> - Web USB
> - Geolocation Sensor (background geolocation)
> - User Idle Detection

Just to be clear, I am a privacy advocate. I use DuckDuckGo. I use Firefox. I block ads. I encrypt my DNS lookups. I'm building [a privacy-focused tool for meetups.](/projects/guildflow/) And with all that said, this worries me.

Right now, many mobile developers would argue that for a rich user experience you need to build a native app and I would agree, at least I would as of today.

But if I'm reading the tea leaves right, and history is a model to follow, what requires "native device" code today will be possible in the web browser of the future. [WebAssembly](https://webassembly.org/) shows great early promise in providing rich cross-platform code opportunities. If you are a 1Password user like me, [you are probably already enjoying some WebAssembly](https://blog.1password.com/1password-x-may-2019-update/) today.

However, to build rich user experiences on a mobile device using WebAssembly or inside a normal web app requires access to the sensors and systems of that device. With this collective blocking of access (along with the [lack of side loading options](https://mjtsai.com/blog/2020/06/16/hey-rejected-from-the-app-store/) on iOS and the [ban of non-WebKit rendering in App Store apps](https://en.wikipedia.org/wiki/Firefox_for_iOS)) Apple has positioned their own native and financial interests over the favor of an open web.

Why can't the WebKit developer energy be spent on building these great new APIs and connect them with user empowering privacy tools. A great example of what I mean is website location tracking. If a website wants access you your location (for say driving directions) you can grant it access. I don't understand why a similar approach could not be applied for things like Web Bluetooth access or Proximity sensor access.

I applaud many of the privacy decisions the WebKit team has made over the past couple of years, but this one feels wrong.

When I was learning to program in the late 90s we had another [big platform vendor who sabotaged the web browser market](https://en.wikipedia.org/wiki/United_States_v._Microsoft_Corp.) for their own interests and I do not want a repeat.
