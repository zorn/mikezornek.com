---
title: "Circle Sign-Up Forms and Credit Card Fraud"
date: 2023-07-04T13:00:00-04:00
description: A short recap of issues I ran into where people were using my Circle community sign-up form to validate stolen credit cards and Circle's lack of proper response.
---

I'm a long-time fan of work done at freeCodeCamp and was sad to read this article a few years ago about how someone had [used their online donation form to test/validate stolen credit cards](https://www.freecodecamp.org/news/stopping-credit-card-fraud-and-saving-our-nonprofit/) (for later sale on the dark web). The amount of headaches this kind of thing causes (for all parties) is a nightmare. Refunds need to be issued, credit card fees paid regardless of refund status, cleaning up one's accounting and membership books.

A few years later, it was my time to join the party.

Closed now, but in early 2023, I ran a paid-for community called ElixirClub. We ran the group on a platform called [Circle](https://circle.so/). Circle integrates with Stripe for credit card subscriptions, and there was a public sign-up page to join my community.

On June 10th, I started observing lots of new member sign-ups. Most failed because of various expected credit card reasons (bad CVV, expired, etc.), but some were going through. Stripe has [documentation](https://stripe.com/docs/disputes/prevention/card-testing) on this phenomenon.

My initial action was to shut down the sign-up form, contact support for both companies and follow Stripes refund recommendations as speedily as possible.

I won't detail my full interactions but suffice it to say:

**Stripe** was helpful over email and later via phone support. They instructed me on how to issue the refunds and how this concern should be addressed at the web form level. I explained that I was at the mercy of a third-party tool, and they encouraged follow-up so as to make sure this was resolved as best as possible to avoid future issues.

**Circle's** response was less encouraging. It took them multiple days to respond and closed the conversation with: "I added this as a new feature request here, we will discuss and triage it for the next quarter."

Next quarter?

Now my community, ElixirClub, was very small and very quiet, so it was easy to observe and react to the fraud since there were no real sign-ups anyways -- but I feel so bad for the successful Circle community manager who can not do anything to add the needed technical friction to their own sign-up forms and cannot turn if off either. 

I'd be shocked if this was not affecting other Circle users. 

This is not a feature request; this is a **high-priority security issue**, and Circle's failure to see it as such is embarrassing.

ElixirClub is closing for other reasons, so I'm off Circle, but sharing this in the hope it helps awareness of the general issue and nudges Circle to give this problem the attention it deserves.
