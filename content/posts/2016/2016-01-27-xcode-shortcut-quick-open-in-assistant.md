---
title: 'Xcode Shortcut: Quick Open in Assistant'
date: 2016-01-27T20:57:45+00:00
url: /2016/01/27/xcode-shortcut-quick-open-in-assistant/
categories:
  - Coding
  - iOS
  - Tips
  - Xcode

---
This answer / revelation caused a bit of a stir in the [Philly CocoaHeads Slack][1] so I figured I&#8217;d share it here as well.

Lots of people know and live by Xcode&#8217;s Quick Open Menu. You hit `Command-Shift-O` and start typing the name of a file, a class or a method and have some very good options made available to you. Make a selection, hit return and bam, the file is now live in your editor.

But what about the assistant editor? Historically some of the best uses for the assistance editor was to view a file&#8217;s counterpart file, the header for an implementation file and visa-versa. With Swift&#8217;s lack of a header files, some people have come to put use the assistance editor of test files.

Regardless as to what you want in the assistant editor it&#8217;s always been a little clunky to pick the file. Well now you can use the Quick Open menu for this too, and it&#8217;s oh so simple.

Hit `Command-Shift-O` and make your selection as normal. Instead of hitting `Return`, hit `Option-Return` &#8212; the file will now open in the assistant editor pane, opening it if need be.

![Quick Open in Assistant in Action GIF][2]

That&#8217;s all there is to it. It&#8217;s a small feature but very handy for those trying to stick to their keyboard and avoid the mouse while moving around in Xcode.

For a handy Xcode 7 Shortcut Reference Card check out the Big Nerd Ranch [iOS Course Resource repo][3] for a PDF download. You can also get the card in print by ordering our latest edition of [iOS Programming, 5th Edition][4] &#8212; updated for Xcode 7 and Swift 2.

PS: Props to [@lyricsboy][5] for catching my typos!

 [1]: http://phillycocoa.org/slack
 [2]: http://mikezornek.com/media/images/quick-open-in-assistant.gif "Quick Open in Assistant in Action GIF"
 [3]: https://github.com/bignerdranch/iOSCourseResources/blob/master/Xcode%207%20Visual%20Reference%20Card.pdf
 [4]: http://amzn.to/1lTwb2H
 [5]: https://twitter.com/lyricsboy