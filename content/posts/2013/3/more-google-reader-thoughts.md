---
title: More Google Reader Thoughts
date: 2013-03-14T03:25:01+00:00
aliases: /2013/03/13/more-google-reader-thoughts/
categories:
  - Industry News
  - Personal Projects

---
## What was Google Reader?

To be clear, Google Reader was two things.

First, it was a web-based RSS reading app. You&#8217;d visit the site, add subscriptions, browse subscriptions and read the articles that were aggregated. You&#8217;d mark things as read and star articles you enjoyed. Google would show ads, just like GMail, and thus make some money.

Second, Google Reader was an API, [an unofficial API][1] at that. Many apps that live off of content and RSS were created over the last few years. To help people easily jump in they supported the Google Reader API. This allowed users to authenticate with Google and all their feeds would instantly appear in the new app and management of the feeds would then be mirrored on Google Reader. It was an extremely useful setup for users and for app makers, but not very lucrative for Google which was banking on showing ads on the web.

Instead of becoming the app everyone loved, Google Reader instead became a behind the scenes utility company with no monetization.

Based on my Twitter steam, it&#8217;s the API that is the real community lose here &#8212; at least for the nerds.

## The Impact of Google Reader&#8217;s Demise

So what will the impact be? This will vary app to app, and to continue to stretch my utility metaphor, if RSS is the wiring, the more your app shows the wires the more trouble it will in be for the short term.

To explain, there are many apps and services such as Flipboard, Zite, Prismatic and others that are already curating content collections for their users. When a user comes in they chooses the topics and publishers that interests them and the services picks content for display. There is no need to load an OPML list of URLs to XML files. Their users have no idea what RSS is. Even if RSS is the wiring under the hood, none of it is shown to the user unless they actively look for it.

Other apps like Reeder for iPad or NetNewsWire for Mac live with the hood open and the wires very visible. For these apps, there will be a scramble to find a new &#8220;sync home&#8221; as the apps loose a ton of value without it or become downright broken.

I&#8217;ve seen recommendations for NewsBlur or Feedly but I don&#8217;t see them as a good fit for this &#8220;sync home&#8221; need. These web apps are themselves clients, built to engage readers with a unique UI and improve the browsing experience. They are not the stable, faceless API utility companies that are needed here. I&#8217;m a bit worried their owners will unknowingly jump in onto this exodus of Google Reader users not fully understanding how it will truly impact their products in the long term.

More specifically I think it will be the dedicated, focused systems that win out. Services that are built for this &#8220;sync home&#8221; need and just for this need. While I welcome paid-for options I also hope we&#8217;ll see some open source variants as well. I expect those services which mirror the Google API closely ([like this move][2]) will be easy swap-in options for app developers and thus gain quicker adoption, though maybe we&#8217;ll all be surprised and another monster will come out and dominate the space.

## A Pipe Dream

Wouldn&#8217;t it be nice if I could just provide a URL endpoint, username and password to my various iOS/Mac/Web readers and the subscription sync would just work (no matter what app/service I was using). An open source, standard API for RSS subscription management. Oh it would be nice.

What I don&#8217;t want to see is app developers having to support a dozen or so &#8220;sync home&#8221; options and maybe even not the one I wanted to use. If they stood together now I bet they could get some traction to make this work and simplify their own lives. They have a lot of power right now in choosing who or what will win out. I wonder if they&#8217;ll use it?

## What does this mean for CB Reader?

Not a ton. [CB Reader][3] is a client app, in the respect that it focuses on article management and the reading experience. While I could see having a public API to manage subscriptions I don&#8217;t intend for CB Reader to be a faceless &#8220;sync home&#8221; that powers other apps.

 [1]: https://code.google.com/p/google-reader-api/
 [2]: http://blog.feedly.com/2013/03/14/google-reader/
 [3]: http://clickablebliss.com/cbreader/