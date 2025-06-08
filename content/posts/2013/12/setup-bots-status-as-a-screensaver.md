---
title: Setup Bots Status as a Screensaver
date: 2013-12-13T03:55:24+00:00
aliases: /2013/12/12/setup-bots-status-as-a-screensaver/
categories:
  - Coding
  - Continuous Integration
  - iOS
  - Tips
  - Xcode
---

It&#8217;s time to turn off that family photo screensaver and switch to something that&#8217;s important, CI status screens!

![Bots Big Screen][1]

First up you&#8217;ll need this screensaver (or something similar), which can be configured to load a single or multiple websites up as a screensaver.

<https://github.com/liquidx/webviewscreensaver>

Sadly the screensaver bundle is not developer signed so if you are bit paranoid consider downloading, inspecting and building the thing from source. Or you could be like me and hit run inside of Security after the initial &#8220;can&#8217;t run, not signed&#8221; dialogue.

Next you&#8217;ll need some URLs. I run both Xcode Bots and Jenkins off my Mac mini named GLaDOS and for those you&#8217;ll want URLs like:

<http://glados.local/xcode/bigscreen>

<http://glados.local:8080/view/Monitor/>

For Jenkins I&#8217;m currently using the [Build Monitor Plugin][2] which is pretty basic but a nice start.

Here&#8217;s to hoping all your returns from coffee breaks are bathed in green and passing tests.

[1]: http://mikezornek.com/media/images/bots-big-screen.png "Bots Big Screen"
[2]: https://wiki.jenkins-ci.org/display/JENKINS/Build+Monitor+Plugin
