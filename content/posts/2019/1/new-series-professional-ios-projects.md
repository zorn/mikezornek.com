---
title: "New Series: Professional iOS Projects"
date: 2019-01-08T12:40:03-05:00
aliases: /posts/2019/1/new-series-anatomy-of-a-modern-ios-project/
---

One of the lessons learned from [The Pragmatic Programmer](https://pragprog.com/book/tpp/the-pragmatic-programmer) by Andrew Hunt and David Thomas is to **learn a new language every year**. 

> Different languages solve the same problems in different ways. By learning several different approaches, you can help broaden your thinking and avoid getting stuck in a rut. Additionally, learning many languages is far easier now, thanks to the wealth of freely available software on the Internet. 

Over the last few years I’ve really tried to take this to heart and have worked with and dabbled in lots of languages, including:

* Objective-C 
* Go
* JavaScript
* Elm
* Ruby
* Elixir
* Swift

…and related frameworks/tools:

* Ember
* ReactJS
* Rails
* Phoenix
* GraphQL

With that context, one of the biggest issues I have with iOS development is that **our projects, as a community, lack professional consistency**. 

If you open a project in any of the frameworks I mentioned above you’ll find very specific places for each piece of the codebase; you’ll find code generators that follow these patterns for new files and tests; you’ll find community accepting tooling standards for bringing it all together. This consistency takes a whole world of questions and decisions off the table making your development life so much easier.

On iOS, every Xcode project is its own unique beast. There are some patterns we get from UIKit but it only gets us so far. 

I feel like Apple has dropped the ball. In my opinion, Xcode should have more opinionated and structured project templates to offer. It should have open integration to third-party project templates to easily allow the community to drive us forward. Following “good practices” like migrating code to frameworks, should be easier. Testing should be more streamlined. Failure to add inline documentation should cause warnings. I can go on and on, and I will. 

“Professional iOS Projects” is a new blog series where I want to explore what we can do to improve our iOS projects. Apple of course drives us with its closed-sourced, time limited Xcode release schedule, but there is plenty we can work on ourselves, from lint tools to documentation, testing, folder structure, system design and more. It’s a series that could go on forever. 😱

The first post is ready. It’s all about [the README file](/posts/2019/1/professional-ios-projects-the-readme-file/). Please check it out and [let me know](/contact) what you think. I also welcome topic ideas for future articles. 

Going to shoot for a weekly release schedule so grab that [RSS feed](/index.xml) and join me.