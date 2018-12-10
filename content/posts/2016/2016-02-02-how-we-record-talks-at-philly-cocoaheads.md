---
title: How We Record Talks at Philly CocoaHeads
date: 2016-02-02T22:44:52+00:00
url: /2016/02/02/how-we-record-talks-at-philly-cocoaheads/
categories:
  - Conferences
  - iOS
  - Recommended
  - Tips

---
I came across [this post][1] from Rico Jones on how he records the [Portland Ruby Brigade&#8217;s][2] monthly meetings and thought I&#8217;d do something similar for how we record the [Philly CocoaHead][3] presentations.

![Capture Setup][4]

## Why Only Main Talks

This first thing I&#8217;ll note is we do not record the entire meeting. Early on this was to due to the experimental nature of our recording setup but more recently, at a leadership meeting, we made the call to continue to only record our &#8220;main talks&#8221;. We do this for a few reasons:

  * Not recording the &#8220;show and tell&#8221; talks lets those be a little bit more free-form, with less pressure on the presenters (which is a big reason why they are in the agenda).
  * Many of the show and tells are in-progress app demos, and so there is benefit to keeping them non-public.
  * We [expect a higher level of preparedness][5] for the main talks, and to ask for people to put that much time into a talk, it would seem wrong not to capture it.
  * If the whole meeting were being captured / broadcast it would encourage people not to come.

## The Setup

Starting from the presenter&#8217;s laptop we provide an HDMI cable. If they want to present or demo from an iOS device we have an [HDMI to Lightning adaptor][6].

The HDMI cable then feeds into our capture device, an [Elgato Game Capture HD][7]. This device is targeted at the streaming game market but is just as viable to capture normal HDMI signals. The device itself is an HDMI passthrough with no frame drops or anything. The device is even powered through the USB cable so no need for a power cord. The video / audio is then compress into mp4 (on device using hardware encoding). The compressed signal is sent to a Macintosh running some custom Elgato software. I use an older Macbook Air to act as our dedicated capture computer. While there are many other features for dedicated streamers, we simply press record.

We then take the other end of the HDMI cable and route it to our projection system. Now the Apple Store that hosts us has a very impressive setup but sadly it&#8217;s not as easy as it should be. They have an HDMI connection, and while it works for the Apple TV it doesn&#8217;t register when we plug it into a Mac. To get around this we used to use an [HDMI to DVI adaptor][8] and the alternate DVI input. It worked fine but doing it this way lost the audio. Recently we&#8217;ve fixed this by buying a [converter box that splits the HDMI into both DVI and an audio jack][9]. Again, the Apple Store does have a in-house roof speaker system but for us sadly it&#8217;s been down. In the interim we&#8217;ve been getting by with a [Beats Pill Speaker][10] the Apple Store is nice enough to provide.

While not part of the capture, I will give a friendly nod to [Fin][11], an iOS performance timer we run on an iPad mini to help the speakers know how much time they have left. Works great.

I&#8217;ll also recommend the presenter remote I use. It&#8217;s a [Kensington][12], with a nice simple to use USB dongle that slips into the remote when not in use. It has a laser pointer too but I can&#8217;t say I use it much. Battery life has been very good for this device.

So that captures the video and audio from the presenter&#8217;s laptop or device but what about the speaker&#8217;s voice? For that we use a [lapel clip on mic][13] and [Digital Audio Recorder][14]. The recorder can work without the mic if you are looking to capture a room discussion but for 1 person, adding the mic is a real quality difference.

After the meeting we combine the video and audio captures using [ScreenFlow][15]. Editing is fairly simple for most cases, usually as simple matching up the action and adjusting some audio. The finished product is exported and then uploaded to [Vimeo Pro][16], which acts as our library of sorts. (We pay for Vimeo Pro to keep ads out and to make sure we have API access.) People can watch the talks through Vimeo itself or our new Apple TV app, &#8220;PhillyCocoaHeadsTV&#8221; (search for &#8220;CocoaHeads&#8221; on the TV).

## Future Improvements

Overall I&#8217;m pretty happy with the current setup but I do have some ideas:

  * It would be nice if we could get the Apple HDMI connection to work, that would simply our wires a bit. 
  * At work we use a [Catchbox][17] to help capture Q and A. It would be nice to work out something similar for us.
  * While it might save a bit of editing time to convert to a wireless mic, it&#8217;s pretty low on my list. Would have to improve some other aspect to make it more worth while.
  * There is a lot of equipment to carry in, setup and carry out. It&#8217;s very reliant on me personally at the moment. I&#8217;ll probably be missing a meeting or two this year so I hope to train someone else to run this while I&#8217;m gone.

Hope you enjoyed my rundown. If you help capture stuff like this and have any tips or tricks, [let me know][18]. Thanks.

 [1]: http://www.toasterlovin.com/how-i-record-programming-talks/
 [2]: http://pdxruby.org/
 [3]: https://vimeo.com/phillycocoa
 [4]: http://mikezornek.com/media/images/cocoaheads-history/video-capture.jpg "Capture Setup"
 [5]: https://github.com/phillycocoa/agreements/blob/master/Philly%20CocoaHeads%20Speaker%20Agreement.md
 [6]: http://amzn.to/1o3GLpK
 [7]: http://amzn.to/1nLb3h8
 [8]: http://amzn.to/1NOLpMT
 [9]: http://amzn.to/1NOMX9L
 [10]: http://amzn.to/1nLcrAh
 [11]: http://www.fintimer.com/
 [12]: http://amzn.to/1PeEf6z
 [13]: http://amzn.to/1QZ3wq4
 [14]: http://amzn.to/1nLd0Kk
 [15]: http://www.telestream.net/screenflow/overview.htm
 [16]: https://vimeo.com/pro
 [17]: http://us.getcatchbox.com/
 [18]: mailto:mike@clickablebliss.com