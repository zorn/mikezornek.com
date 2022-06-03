---
title: "Side Project Idea Audit"
date: 2022-06-03T09:44:00-04:00
description: I keep a running list of project ideas in my notebook, and here is the shortlist I considered for the summer.
---

During my time off this summer, I am looking for a project to sink my teeth into. Something to give me a bit of purpose and space to explore some technical tooling I am curious about. 

In the future, I hope to find a project to help serve my financial needs, but this specific summer side project is more about personal exploration without any profitability interests.

I keep a running list of project ideas in my notebook, and here is the shortlist I considered for the summer.

## Collaborative UI Breadboarding

UI Breadboarding is a concept I became familiar with via the [Shape Up book]. It is a practice where you work through user experience requirements in a whiteboard "text and arrows" environment without drawing specific UI. My app would enable a way to launch a breadboard session, invite others to it, and collaborate on a user experience. It would be a great demo of the real-time behaviors LiveView apps enable.

[Shape Up book]: https://basecamp.com/shapeup/1.3-chapter-04#breadboarding

Collaborative UI Breadboarding is not my summer project because it is outside my typical job responsibilities. I'm not drafting new user interfaces in my consulting work day to day, and I want the outcome of this summer to be something I'll personally use. I have considered a shift in my consulting to perhaps make this a more significant focus of my time, but I'm not there yet. So, while this would be a neat tool and an excellent demo of LiveView, I don't think it is the right project for this summer.

## Exercism but for Tailwind

I'm a big fan of [Exercism]. I have not gotten too deep into any specific tracks, but the platform concept and execution is very cool. One day I wondered aloud if there could be a place like Exercism but for learning Tailwind instead of a programming language. I envision something similar to [Flexbox Froggy], an almost game-like environment where you learn CSS flexbox.

[Exercism]: https://exercism.org/
[Flexbox Froggy]: https://flexboxfroggy.com/

I'm not doing Exercism but for Tailwind for two reasons. One, I still consider myself a Tailwind novice. While building out education materials in the form of a game would surely improve my Tailwind skills, I feel like it would be a bit too large of a commitment than I'm comfortable making during this summer timebox. The second reason is that I'm not sure the meta frontend code editor / CSS rendering that I'd have to build would be transferable to future projects as other things on this list. While I am not going to be working on my profit-seeking project this summer, I am hoping there will be some skill overlap, and the time I spend in the summer will help with those projects in the fall.

## Slack Plugins

From my observations, I feel like there is a lot of dysfunction in how many corporate teams use Slack and related tooling to communicate while designing and building products. Domain truth and discussions are spread out across a matrix of tools, including JIRA, Confluence, GitHub, Figma, Google Docs, Zoom, and the code itself. Slack acts as the central pipe of communication but is rarely managed well and can easily cause people to feel overwhelmed and distracted. It can also create a false sense of progress as you sit there, answering disjointed questions and resolving notification prompts. It **feels** like you are being productive, but the value can be pretty shallow when you add it all up at the end of the week.

I don't even know what I'd build here, but one project idea was to interview people who also use Slack day-to-day for work and see if there are any opportunities to create plugins to help manage the chaos.

I'm not doing any Slack plugins because I hope to find or otherwise build myself a team environment where we rely less on Slack and more on other async writing to propose ideas and answer questions. I frown on using Slack as a meaningful store of knowledge. It is too chaotic and expensive (I'm talking about mental and distraction costs here). I think a chat space can be great for the social needs of a team but recommend other systems to manage product design/development discussions.

## Notion Plugins

A few months ago, I increased my Notion use from a curious experiment to a preferred tool. I even dropped my use of OmniFocus and Bear in preference for Notion as my day-to-day notebook. Perhaps I'll share more about that in the future. One side project idea was to build some plugins to sit on top of Notion. I'm not even sure what they would be, but it seemed like an exciting space.

I'm not doing Notion Plugins because I'm still learning how to use Notion and how I **want** to use Notion. I think there are some opportunities to build "blocks" to help host live data sections on Notion pages. I envision a product dashboard that combines outwardly owned data (like sales and analytics) and pairs those views alongside project plans or daily standups.

## Personal Blog Rewrite 

Spoilers: This is what I am doing. 

The first commit to this [repo] / blog system was in December of 2018. The site as it lives today is a static site generated with Hugo and hosted on a simple Linode webserver. It works well enough, but my wants/needs are changing.

[repo]: https://github.com/zorn/mikezornek.com

The first opportunity for improvement is to solve a bit of dysfunction in how I publish web content. 

Most of my tweet-like content gets posted to Micro.blog and then cross-posted to Twitter and Mastodon. Sometimes I post directly to Twitter because I want to embed a video, and frankly, the cross-posting from Micro.blog does not match how I expect that to work. 

For longer content, I'll compose a post for this blog, which involves:

* Using `hugo new` to create the file.
* Editing the content (usually first in VS Code and then in Grammarly).
* Committing the new files.
* Pushing it to GitHub.
* Waiting for it to publish (which is usually pretty fast).
* Manually build a Micro.blog post to share the link (that will be cross-posted).

The whole process is cumbersome.

I want my website to become the true home to all my published content with this project. I am still interested in having content on social media, but I want my short-form content and long-form content to be intertwined into a single stream that is hosted on my domain. I want a single place on the web where I can compose a message, attach some media, and hit publish. Everything is on my site, but social media shares are generated automatically, in a format I find acceptable. 

In many ways, this is the promise of Micro.blog, but I never really embraced it. I always had my website separate and used Micro.blog purely for tweet-like content. If this were just about the user experience, I might more strongly consider using Micro.blog, but as I said in the beginning, this is more about a technical exploration, so I'll build it out myself.

**Technical Plans**

* The core will use a CQRS / event-source style code architecture. Total overkill for the needs of a blog, but as this is a learning opportunity, I want to give it a try.
* I'll use Tailwind and a rich collection of Phoenix components to structure the UI. There won't be much interactivity on the user side, but the admin area will have some places for me to play. I'm very interested in the developer tooling around component design and management, so I'm hoping something interesting will come out of my time here.
* While the cross-posting will be an internal module at first, I think it is possible to share it more broadly if it is successful. To speak to specific behaviors, I thought the Micro.blog cross-posting feature lacked good observability into what is in progress and managing the format and exception handling (when the share content breaks the platform validation rules).

**Challenges and Risks**

* Importing the old blog content will be a chore but something worth doing. Specifically, I'd like to have better accessibility constraints around media and will likely have to patch older posts with better captions and metadata.
* Not using an out-of-the-box blog system will put notable stress on me to maintain the code and deployment. It will likely be more complex and costly than it was hosting a static website.

I'll do my best to share as I go. If you have any questions, let me know.
