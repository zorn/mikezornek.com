---
title: An “App Architecture” Kata
date: 2014-11-24T02:00:29+00:00
aliases: /2014/11/23/an-app-architecture-kata/
categories:
  - Coding
  - iOS
---

At the last [Side Project Saturday][1] CocoaHeads event I ran a special little exercise. Here was how I described it.

> I&#8217;d like to run a little event, (maybe after lunch?) for anyone who wants to participate. Should take like 45-60m.
>
> You will be presented with a mobile app idea. It&#8217;ll be fairly basic and we&#8217;ll list all of the behaviors we need and some we&#8217;d like in the future. You will then pair up with someone and pencil out how this could be architected. Each group will then present their app architecture and answer questions, accept feedback from the rest of the group.
>
> From Wikipedia: A code kata is an exercise in programming which helps a programmer hone their skills through practice and repetition. The term was probably first coined by Dave Thomas, co-author of the book The Pragmatic Programmer, in a bow to the Japanese concept of kata in the martial arts.

App architecture is one of those things I&#8217;m always trying to improve so I thought it would be cool to see how other people would solve similar problems.

We had six people participate. We started with a brief explanation of the app we were going to sketch out an architecture for. Then, we broke up into pairs of two. After about 40 minutes we came back and showed the group what we came up with.

[![Kata App Wireframe][2]][3]

The one group ended up documenting behaviors per screen. They did a great job of documenting the little things that developers might look over as assumed behavior (which add up fast). It was pointed out that it&#8217;s also a great idea to document the things you will not be doing since there tends to be lots of great ideas during brainstorms but when you are planning a sprint of a version target you need to be clear about what&#8217;s in and what&#8217;s out.

The other two groups (including my own) were more visual, using tools like [OmniGraffle][4] to draw representation of models, controllers and services. There was some common separation of responsibilities with slight differences: the one group making an &#8220;APIStore&#8221; that combined the state and networking and another (mine) that favored separate &#8220;Network&#8221; and &#8220;Session&#8221; managers.

Some of the more high-end abstractions I introduced included a FormController that could take a Form model (that had say a collection of FormFields) which described the form at a model level and then through a FormController might be able to render the form on screen through a TableView for a generic representation or maybe through specific outlets to a custom layout. It could also handle things like input validation. True, this is overkill for our one simple login form but assuming this app might grow to contain edit person forms at some point it might not be too bad of an idea (and plus the whole purpose of this event is to discuss interesting ideas).

I also took the time to introduce a pattern thats been out for a while but is a recent addition to my personal toolkit, that being ViewModel. You can read more about [MVVM on objc.io][5]. In short it&#8217;s a great way to centralize the code you use to transform model objects for user interface purposes and keep that logic out of the model.

In conclusion, everyone who participated seemed to enjoy the exercise and I would encourage you to replicate it amongst your own peers. It&#8217;s still up for debate if &#8220;Side Project Saturday&#8221; is the best venue for such things as many who come have their own stuff to work.

[1]: http://www.meetup.com/PhillyCocoaHeads/events/212626112/
[2]: http://mikezornek.com/media/images/kata-app-mockup-thumb.png "Kata App Wireframe"
[3]: http://mikezornek.com/media/images/kata-app-mockup.png
[4]: https://www.omnigroup.com/omnigraffle
[5]: http://www.objc.io/issue-13/mvvm.html
