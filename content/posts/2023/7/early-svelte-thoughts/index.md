---
title: "Early Svelte Thoughts"
date: 2023-07-22T17:25:51-04:00
description: I started learning Svelte for web frontend UI development and so far feeling pretty positive about it. Here I review my early thoughts and plans.
---

After more than five years of giving my **full** attention to Elixir, Phoenix, and LiveView as the primary toolkit I use to build web apps, over the last few weeks, I've started to sample some other tech stacks, with an initial focus on [Svelte](https://svelte.dev) and [SvelteKit](https://kit.svelte.dev/). Here are some early thoughts.

## Why the move? 

This move comes from an ongoing, uneasy feeling that the current LiveView ecosystem lacks the significant and diverse set of choices for libraries that I find myself looking for to help me stand up new UI ideas quickly. LiveView will allow you to build almost anything; you just have to make it yourself. 

I do observe improvements to the core LiveView technologies that may help improve community offerings in the future, but for now, this is how I see it. 

Additionally, there is a particular set of user interactions that I am interested in providing in my user experiences (file uploads, drag and drop, rich animations) that, while possible in LiveView, none-the-less require JavaScript -- and then I ask myself why not just work in that environment from the beginning?

I also feel like the WebSocket nature of LiveView has some unfortunate tradeoffs regarding offline or flaky network/phone environments. It hasn't been a significant blocker in my production work, but it is always part of the conversation. If I were to build something with a more common mobile web experience target, I'd be worried about the WebSocket tradeoff.

To be clear, Elixir and Phoenix, in general, I'm still very positive about. Suppose I were to use a different frontend technology. In that case, I suspect I'd still use an Elixir/Phoenix project to provide a GraphQL API, manage jobs, push notifications, emails, and all the other platform needs. I might even still use LiveView for an admin area.

## Why Svelte?

Similar to an approach that led me to Elixir many years ago, I took some time to review the current state of web frontend technologies. If I were to [follow the herd](https://survey.stackoverflow.co/2023/#section-admired-and-desired-web-frameworks-and-technologies) I'd probably pick React and/or Next.js, but there was just something special about Svelte for me. 

A few notable things:

* First off, Svelte is a component system and SvelteKit is a web framework.
* Svelte components are compiled and executed in the browser space using standard JavaScript. There is no typical React-like runtime, and the code generated is much leaner than the historic SPA JavaScript bundle sizes.
* You can do server-side rendering to provide SEO-friendly HTML for non-authenticated pages.
* The style of building Svelte components is light and approachable.
* There are significant [animation tools](https://svelte.dev/docs/svelte-motion) within Svelte to provide a dynamic presentation of UI elements.
* The Svelte project and community seem lively and are not overpowered by an individual corporation.
* The technology is a little on the younger side, which does hamper the community library interest that kicked off this search, but I'm seeing enough and seeing good momentum that I think I'll be happy.
* The `store` model for reactive data seems well structured.
* There was a great set of [interactive tutorials](https://learn.svelte.dev/tutorial/welcome-to-svelte) that helped me get stated. Afterwards I also worked through the [Fireship course](https://fireship.io/courses/sveltekit/) (though I'm not sure I'd recommend it).

A few negative tradeoffs and concerns on my mind:

* Generally speaking, I do not love the JavaScript ecosystem. I've tried to avoid it as much as possible over the last 15+ years (avoiding it with ease during my Apple time and avoiding it a lot during my Elixir time).
* Stale `npm` projects can get dangerous quickly as modules go missing or dependency issues are introduced. Even working on the just released Fireship course, I hit issues trying to deploy; though this was more an experimental Firebase deploy thing than a Svelte thing; but it speaks to my worries of `npm` in general. 
* The lack of testing tools in the standard SvelteKit project template is a little worrisome.

My next steps are to wireframe a new project idea I've been pondering and then get hacking to see how I like it. You can only do so many tutorials.

## Learn one new language a year.

This Svelte experiment is also good for my consulting/career. It's been harder to find regular consulting work, and expanding my technical skillset might lead to a few more opportunities. 

I've always promoted the idea of learning one new language a year, even when you will not be applying them right away. In 2021 it was Rust, and in 2022 it was event sourcing. It feels like 2023 is the year of Svelte.
