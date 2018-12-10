---
title: Staying Secure on OS X with a Few Unsigned Apps
date: 2015-10-19T22:10:33+00:00
url: /2015/10/19/staying-secure-on-os-x-with-a-few-unsigned-apps/
categories:
  - Recommended
  - Tips

---
I could get into some real heavy talk regarding Apple&#8217;s policies about installing software outside their stores (and maybe I will someday) but for now let us all be thankful that not all Mac software must come to us through Cupertino. Let us also be thankful for [Gatekeeper][1], a nice compromise Apple offers.

With Gatekeeper, Apple allows people to distribute Mac software outside the store but requires it be signed with an identity registered with Apple. The general idea being if a developer gets marked as distributing malware Apple can blacklist them so as to not effect users in the future. I&#8217;m not aware of any honest developer being wrongfully blacklisted and my general understanding is that the program is working well with [known limitations][2].

OS X ships with a nice safe default via `Settings > Security`,
  
&#8220;Allow apps downloaded from:&#8221; set to &#8220;Mac App Store and identified developers&#8221;. Unfortunately even though Gatekeeper has been around since 10.7 there are some apps that are not signed nor will never ever be signed that you want to run. Most users will sadly turn off the Gatekeeper check entirely at this point, leaving their system vulnerable. Below I&#8217;ll walk you though how to allow a unsigned app to run while leaving the security setting as-is.

By default OS X ships with the setting set to &#8220;Mac App Store and identified developers&#8221;.

![default settings][3]

When you try to open an unsigned app you&#8217;ll get a prompt like this:

![prompt][4]

Click `OK` and then go back to System Preferences and you might notice the pane has changed:

![Open Anyway option][5]

Now you can choose to &#8220;Open Anyway&#8221; for the last app blocked by Gatekeeper. Go back and try to launch the app again. You&#8217;ll get a final prompt asking if you sure, and upon clicking `Open` you&#8217;ll be able to run you unsigned app while still maintaining the default security setting.

![Last check][6]

While a little tedious jumping back and fourth for the initial approval, I&#8217;d much rather do this and leave Gatekeeper on than to run without the identity check. I highly recommend you do so too, and if you can, maybe a friendly email to your app developer asking him to sign his app.

**UPDATE:** Was informed by [@boredzo][7] and [@ abrahamvegh][8] that there is a shortcut to this flow if you anticipate the app requiring approval. For example, if you download an app you know will need this special exception you can control-click it and choose Open from the context menu. Doing so will cause a similar prompt that will whitelist the non-signed app and allow you to run it without turning off Gatekeeper. Thanks for the extra info guys!

 [1]: https://support.apple.com/en-us/HT202491
 [2]: https://en.wikipedia.org/wiki/Gatekeeper_(OS_X)
 [3]: http://mikezornek.com/media/images/security/2.png
 [4]: http://mikezornek.com/media/images/security/3.png
 [5]: http://mikezornek.com/media/images/security/4.png
 [6]: http://mikezornek.com/media/images/security/5.png
 [7]: http://twitter.com/boredzo
 [8]: http://twitter.com/abrahamvegh