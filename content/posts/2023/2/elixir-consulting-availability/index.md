---
title: "Spring 2023 Elixir Consulting Availability"
date: 2023-02-20T11:17:10-05:00
description: I am looking for my next consulting gig.
images:
    - /posts/2023/2/elixir-consulting-availability/job-hunt.jpeg
aliases: 
    - /posts/2022/8/elixir-consulting-availability/
    - /posts/2022/12/elixir-consulting-availability/
---

I am looking for my next consulting gig. 

I want to contribute to an **Elixir**, **Phoenix**, and/or **LiveView** project. An ideal engagement is around **20-32 hours per week**; leaving time to maintain other active projects. Larger commitments will be considered for the right project fit.

My rate is **$150-200/hour**, with discounts available for perks or prepayment.

I am a senior developer and can help augment your team with skills, including:

* Mentoring junior developers (or those new to Elixir).
* Helping the product team define features, identify edge cases, and break down work.
* Support the development team with project documentation improvement goals.
* Integrate with the design team as their developer advocate, helping transform idealized mockups into a component-based design system crafted for LiveView specifics.
* Assist the QA team in identifying and resolving bugs. I am particularly good at breaking software.

Working on open-source projects and tools is a notable plus. 

When evaluating a potential gig, I'll do my best during the introduction interviews to ask questions to determine if the project values align with my [personal values](https://mikezornek.com/values/). Any examples you can provide to help with that determination are particularly welcome.

If you have a project or referral, please [shoot me an email](mailto:zorn@zornlabs.com) or [grab some time on my calendar](https://savvycal.com/zorn/chat). 

# Elixir Demo Reel

Anyone considering hiring me will ask about my past Elixir projects. These span a mix of private contracts, personal projects, and non-personal branded blog posts. The following documents showcase some of my recent projects to spark consulting-related conversations.

In recent years I've contributed to many Elixir-based consulting projects, including:

## NAME REDACTED: Healthcare-related Platform 

For this project, I acted as a part-time tech lead and managed another individual contributor. Day-to-day tasks involved working with the founders to break down and prioritize work, build out tickets that the individual contributor would focus on, and then code review those changes. I also helped the founder spec out a significant project proposal. 

The codebase was a mix of Elixir, Phoenix, LiveView, and React. We also used Oban for job processing and Absinthe for a GraphQL API (that powered a React Native mobile app). Some of my time was dedicated to updating these libraries to more modern versions. To help manage our work, we used GitHub Projects and GitHub Discussions (in favor of Slack). It worked very well, and I appreciated the async communication style.

I still help with maintenance on this project via a limited retainer.

## NAME REDACTED: Consumer Car Matchmaker

Part of a large team migrating a large Java codebase. As a member of the leads team, I helped build systems that would capture leads (on LiveView-based forms, as well as Facebook marketing integrations). Created workflows to process the leads through an internal delivery network requiring integrations across a dozen external vendors with a wide range of interfaces. SOAP in 2021—-who knew? A significant priority of my time here was to help mentor other full-time developers new to Elixir.

## NAME REDACTED: Text and Voice Communications Product

As part of a medium-sized team, I helped to clean up some unwanted technical debt, refactoring many historic Ember pages to LiveView and allowing the full-timers to focus on new product developments. I worked in a manager-like role for the first half of the engagement. I would define work, answer design questions, craft and assign stories, pair with individual contributors, and do code reviews. After an unexpected need to take some family leave, I returned as an individual contributor, helping to complete the last of the Ember conversions, which involved advanced JavaScript integrations, file uploading, and CSV processing in a LiveView wizard-like experience.

## [Roar For Good](https://www.roarforgood.com/): Hotel Security

Helped build internal Phoenix web applications to track equipment (Bluetooth waypoints, routers, etc.) across hotel installation sites. Participated in code design discussions within a team where we were all new to Elixir. 

# Personal Demonstrations

Client code is not open source and is hard to showcase. I have done some public/open-source things I'll share below.

## Franklin

[Franklin](https://github.com/zorn/franklin) is an experimental take on what it might look like to run my blog with an Elixir/Phoenix/LiveView app. It is an opportunity to learn event-sourcing/CQRS patterns and the newer Phoenix Component tooling.

The project is still underway and not deployed, but you can check out its [repo](https://github.com/zorn/franklin) and [project board](https://github.com/users/zorn/projects/1/views/5).

## Blog Post: Webhook Signature Matching

While working on one of the above projects, I integrated with the Facebook Leads system in which we'd get webhook notifications of captured leads. We would have to process the leads and bring them into our internal format while ensuring the design was fault tolerant for downtime and other expected chaos. After working on this, I was able to extract some knowledge gained around webhook signatures, which I posted on my Elixir blog:

[Securing Webhook Payload Delivery in Phoenix](https://elixirfocus.com/posts/securing-webhook-payload-delivery-in-phoenix/)

## ElixirFocus (previously Phoenix by Example)

ElixirFocus was an attempt to make an Elixir-specific blog that would be separate from my personal blog. It is kind of on hiatus as I now question how I want to manage my published work, but for the sake of skill demonstration, I'll share a few articles I think were notable and I'm proud of:

* [Personal Phoenix 1.6 Upgrade Notes](https://elixirfocus.com/posts/phoenix-1.6-upgrade-notes/)
* [Using Schemaless Changesets to Separate Concerns Between the Web Context and the Business Context](https://elixirfocus.com/posts/ecto-schemaless-changesets/)
* [Improve the Clarity of Your Elixir Code Through Expressive and Consistent Language](https://elixirfocus.com/posts/programming-terminology/)

## ElixirFocus Open Source Projects

A fundamental goal of ElixirFocus was to have [open source projects](https://elixirfocus.com/projects/) that backed up the code presented in each blog post.

* [GitHub - elixirfocus/greeter](https://github.com/elixirfocus/greeter) Greeter is a hello world style example app to help introduce the core concepts of the Phoenix Framework written in Elixir.
* [GitHub - elixirfocus/get_shorty](https://github.com/elixirfocus/get_shorty) GetShorty is a simple open-source link shortener written in Elixir and Phoenix, built to help express project norms.
* [GitHub - elixirfocus/tic_tac_toe](https://github.com/elixirfocus/tic_tac_toe) A simple take at a TicTacToe game written in Elixir. Part of a local meetup event where we were all asked to build the same game and compare our work.
* [GitHub - elixirfocus/retro_taxi](https://github.com/elixirfocus/retro_taxi)  Built using LiveView, this (currently incomplete and on-hold) project was created to help people run team retrospective meetings. It does showcase some meaningful LiveView code to break down components and manage state for a shared-live editable web experience for multiple users on the same "board".

## Guildflow

For a while, I was working on a Meetup-like product called Guildflow. It was written in Elixir and Phoenix, and while it is no longer in production, it did serve as a meaningful place where I practiced and improved my Elixir skills. You can watch some historic Guildflow demos on this Vimeo channel: <https://vimeo.com/channels/guildflow>. 
