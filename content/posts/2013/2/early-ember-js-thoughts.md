---
title: Early Ember.js Thoughts
date: 2013-02-05T17:03:16+00:00
aliases: /2013/02/05/early-ember-js-thoughts/
categories:
  - CoffeeScript
  - Interface Design
  - JavaScript
---

Over the last three weeks, I&#8217;ve been slowly picking up [Ember.js][1] while helping some colleagues with a project. It&#8217;s pretty interesting tech and I&#8217;d like to share some early thoughts.

## What is Ember?

To be frank, I don&#8217;t think the [Ember homepage][2] does a very good job of explaining Ember. It features terms like &#8220;less code&#8221; and &#8220;developer ergonomics,&#8221; which are too much like &#8220;marketing speak&#8221; for me.

**How I view Ember.** Normally with a web app, you (as a user) will go page to page, sometimes viewing data and then sometimes editing data with forms. That&#8217;s what I&#8217;ll call a form-based web app. Sometimes you might want a bit of AJAX in these form-based web apps and, to get that, you&#8217;ll typically grab a DOM element and manually shove in a bunch of jQuery when needed, including direct commands and event callbacks. This process can work, but the more AJAX and client side stuff you add, the messier you can make things.

Then there is a class of web apps which work as one-page apps, where all interaction and DOM changes happen on the fly, without moving from page to page. Data is sent to and requested from the server in the background. Think of how [Gmail][3] and [Trello][4] work.

For me, Ember.js is all about giving you the toolchain to provide those types of dynamic, one-page web app experiences. Ember.js is a full stack, client-side, JavaScript-based MVC framework. The main objects you&#8217;ll work with client-side in the browser include:

- Routers, which match the requested URL to controllers. They also ensure that the client URL is updated to allow the user to bookmark the different states of your app.
- Models, to define your business nouns and store/retrieve user data.
- Controllers, which handle actions and pass model data to the views.
- Views to connect user events like clicks and taps to controller actions.
- Templates to describe the HTML on screen.

## Some Notable Features

### Bindings

If you&#8217;ve done AJAX work before, you might recognize that knowing what to update in the DOM can be a nightmare as the app state changes on a given page. Ember is particularly good at dealing with this, and as you build your HTML templates, the substitution hashes like `{{ name }}` for a person&#8217;s name not only are substituted for the real value on the first render, but everything is always kept up-to-date with an internal bindings system. This, combined with calculated attributes, really takes a lot of stress off the developer, in terms of keeping the app state in sync with the UI state.

### Persistence

For actually persisting the data, there is the [ember-data project][5] which will let you connect and map your client-side Ember models to REST endpoints. If you are using Rails, there are a bunch of gems that can really help to simplify this while providing all the serialization and API endpoints you&#8217;ll need. For more info, see [this article][6].

## Sharp Edges

As of this writing, Ember itself is version `1.0.0-pre-4` and `ember-data` is officially considered alpha quality. There is an upcoming [Ember Camp][7], which hopes to see continued progress towards an official 1.0 release. Keep an eye on the [Ember blog][8] for more info. I do believe things have settled down to a point where there is value for people who want to get started with Ember and get their hands dirty. As to &#8220;production ready&#8221; &#8212; well, that will greatly depend on the needs of your application and your comfort with working around some sharp edges.

## Getting Started

If you&#8217;d like to get started with Ember, in addition to the [main website][1], which has some nice and [ever-improving documentation][9], I&#8217;d also recommend:

- [PeepCode&#8217;s Fire Up Ember][10] &#8211; Brand new, up-to-date, and very focused on the Ember stack. Well worth the $12.
- [An Ember.js tutorial by Trek][11] &#8211; Walked through this myself when I got started. It helped a lot.
- [Brian Cardarella&#8217;s Building an Ember app with RailsAPI][6] &#8211; Great walkthrough about starting an Ember app that will use Rails for persistence.

If you are in Philly, also consider stopping by the [local Ember Meetup][12].

[1]: http://emberjs.com/
[2]: http://emberjs.com
[3]: http://gmail.com
[4]: https://trello.com/
[5]: https://github.com/emberjs/data
[6]: http://reefpoints.dockyard.com/ember/2013/01/07/building-an-ember-app-with-rails-api-part-1.html
[7]: http://www.embercamp.com/
[8]: http://emberjs.com/blog/
[9]: http://emberjs.com/guides/
[10]: https://peepcode.com/products/emberjs
[11]: http://trek.github.com/
[12]: http://www.meetup.com/Emberjs-Philly/
