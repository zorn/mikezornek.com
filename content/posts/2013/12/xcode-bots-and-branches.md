---
title: Xcode Bots and Branches
date: 2013-12-13T02:58:05+00:00
aliases: /2013/12/12/xcode-bots-and-branches/
categories:
  - Coding
  - Continuous Integration
  - iOS
  - Tips
  - Xcode

---
Just a little quick tip tonight. If you create a Bot from within Xcode 5 it will assume that the branch you want this Bot to run on is the branch you are currently on. To change this, use the Xcode Bot Web interface. Select your Bot and look for the settings gear in the upper right and then edit the Bot, defining which branch you want to bot to run on.

![Xcode Bot Setting Gear][1]

![Xcode Bot Setting Details][2]

I&#8217;m starting to revive an old side project of mine and it&#8217;s feeling good so far. I have Xcode Bots running tests and the static analyzer (all green baby!). I also have Jenkins deploying to HockeyApp when I merge `development` into my `qa` branch. Hope to share more details soon.

 [1]: http://mikezornek.com/media/images/xcode-bot-web-settings.png "Xcode Bot Setting Gear"
 [2]: http://mikezornek.com/media/images/xcode-bot-web-settings-details.png "Xcode Bot Setting Details"