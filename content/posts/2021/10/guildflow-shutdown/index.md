---
title: "Shutting Down my Side Project Guildflow"
date: 2021-11-08T12:00:00-04:00
description: I am shutting down Guildflow because after living in the meetup headspace for two years I have a hard time seeing a pathway to some level of financial stability which could properly compensate me for my time investment.
---

It is with a heavy heart I share my decision to shut down my side project [Guildflow]. In the spirit of the blog I thought I would document some project history and how I got here.

[Guildflow]: https://guildflow.com

## Project Background

My history attending and organizing meetups in Philadelphia goes pretty deep. I found meetup groups to be a great way to meet like-minded developers who over time would become good friends and coworkers. **Meetup groups were a huge positive impact for me.** 

In early 2019 I was looking to sink my teeth into a new side project. I was not very happy with Meetup.com, the website we used to run Philly CocoaHeads and Philly Elixir. The platform in general had become pretty stagnant and had a bunch of restrictions on data access for things like member email addresses. There was also this shady practice where if you stopped paying the group subscription fee, Meetup.com would sell ownership of your group to any member with a credit card. The parent company of Meetup.com was WeWork, who was known to me as a bad actor in the coworking world. WeWork had Meetup.com do questionable promotions of their spaces as well as experimented with an unwise scheme to charge end users to attend events. In short, while I had a large passion for meetups themselves, I was concerned Meetup.com would be unusable in a few years.

The goals of my side project, in order of importance:

* An opportunity to get deeper experience with Elixir and Phoenix (new tools I embraced after getting out of Apple development).
* A drive to build software that I would personally use and was built for a audience / purpose I could stand behind.
* Create a modest stream of product revenue so that I could, over the long term, supplement and maybe replace my consulting income.

I decided to work on a tool for meetup groups.

Guildflow would be a calendar and group management tool for meetup organizers which focused on privacy and data-ownership. One might choose to use Guildflow to help run their meetup group over other tools like Meetup.com or Facebook Groups.

## Development History

The very first commit for Guildflow happened on April 10, 2019. Development was slow with inconsistent momentum. I was actively contracting and most of my Guildflow time was random nights and weekends with a few scattered months of action if I was in-between paid work. This being a learning project, I was also slow since I was still getting comfortable with Elixir and Phoenix. Considering the goals of the project this was expected and fine, but it lengthened the whole project lifecycle.

Over the course of the project I did reach out and run some customer interviews probably like 8 or so. Half were people I knew casually and the other half strangers from random LinkedIn connections or other introductions. This helped but I for sure fell victim to many of the bad questions and lies as described in [The Mom Test](http://momtestbook.com/). In short, I was so excited to scratch my own itch and experiment with Elixir/Phoenix that I jumped into the tech **way** too fast.

My first public sharing of work came from [a blog post in September 2019](https://mikezornek.com/posts/2019/9/my-new-project-club-house-hosting/) alongside updates in [October](http://mikezornek.com/posts/2019/10/club-house-hosting-dev-diary-1/) and [November](https://mikezornek.com/posts/2019/11/club-house-hosting-dev-diary-2/). By March 2020 I was actually ready to do an limited alpha launch. Remember what else happened in March 2020?

Launching meetup software during those initial US COVID lockdowns was, to put it bluntly, devastating. I can't remember being personally productive at all during March/April 2020. It was scary and stressful. My paid work contract was cut short on April 1st and new contracts were not to be found.

By June I started to get back in the swing of things. I still did not have paying work but did launch a [new Android Book Club](https://mikezornek.com/posts/2020/6/an-android-book-club-for-ios-developers/), hosted on Guildflow. Over the rest of the summer I would work on new marketing pages, videos and features for Guildflow. 

The meetup world was still in a state of shock during the summer of 2020. Some groups did find ways to do online meetings, but it came with new challenges and was mostly built on the backs of pre-existing personal relationships. Many groups were falling apart. No new groups were forming. No one was interested in new meetup software offerings.

By the fall I started to get some contracting interest once again and ended up starting a gig in October 2020. It was an Elixir contract, and having the Guildflow project as a reference, even doing a little code walk during the interview process, helped a ton. One downside of the new gig was that it was a full time engagement, which I traditionally avoid so I can keep pushing on my own projects but after being out of work all summer I needed to take it.

Through the fall I did find some time to work on Guildflow, getting custom pages, editable navigation and group messaging all working. I even pulled in my Philly Elixir group from Meetup.com to now be hosted on Guildflow.

After that feature push, in February 2021 I decided to put Guildflow on hold. COVID had just spiked during the winter the US, we did not (at the time) have an approved vaccine. It was hard to imagine a near term future where I could observe active in-person meetups who would potentially use my software. To continue to develop in a vacuum seemed like a bad idea. I would take some time off, work on an upcoming apartment move and revisit Guildflow in the future.

Over time I have revisited Guildflow ever three months or so, doing small SSL security updates and other little bug fixes. We still used it for Philly Elixir so I needed it to keep working. Today however I have made the decision to officially discontinue the project.

## What Did I Learn?

Having saturated myself in the meetup headspace for the last two years, I've been trying to share my learnings and observations on the [Guildflow blog](https://guildflow.com/blog/), which has some great content I am proud of. I'm hopeful I can transplant some of those posts to my personal blog. Anyways, this is all to say, I have a lot of opinions about meetups. To summarize as best as I can:

### The most complex problems around running a meetup group, have very little to do with the quality of the group management tools. The real challenges are finding an audience and generating rewarding, goal-oriented content that enables that audience to evolve into a true community.

While the Meetup.com tools are lackluster they are good enough for most people. The real asset of Meetup.com is the user base. Using the Meetup.com platform introduces your group to new people. Many group organizers do not have the time or passion to do that kind of marketing outreach on their own so they get tremendous value from the Meetup.com user base.

Group organizers will complain about the high Meetup.com monthly fee and they will complain about data access issues but there is no observable trend of them actively looking for alternatives. I think there was a potential tipping point moment when the WeWork owners of Meetup.com (at the time) started experimenting with charging the end users for access but they quickly backed away from that and eventually Meetup.com was sold to new investors.

### Bigger Trends of Meetups

The other big take away I have is that the cultural concept of a traditional "meetup" being downward trending. This downward trend was historically observable but COVID has exacerbated it tremendously.

I feel like many people traditionally consider a tech meetup to consist of "a monthly in-person event, in the board room of company X, where people interested in tech Y come by to see an educational presentation, talk shop and eat pizza". 

As much as this format has been enjoyed by myself and others I suspect this format is dying.

**It is dying because of the internet.** No one needs to wait for the monthly meetup (or conference for that matter) to see a static, non-interactive demo of new tech Y, or to talk shop with peers. There are SO MANY other productive outlets online for this; from Twitter, to blogs, to YouTube, to GitHub, to Slack and Discord, to email newsletters, and so on. 

**It is dying because remote work is here to stay.** COVID is still here and that means hesitance about in-person events, but it also means the conference room you used to met at isn't there anymore because the company went full remote or they can't allow the random public in. The people who would normally stop by your meetup after work no longer drive into town for a job, they work from home.

Traditional meetups might be dying but **communities** will live on.

I think the meetup groups that survive will rethink their positioning and build thriving communities around [goal-oriented events](https://guildflow.com/blog/goal-oriented-side-event-ideas/).

## Why the Guildflow Shutdown?

While I continue to be supportive about the positive impact of local tech communities, or meetups if we still want to hang on to that term, my observation is that these groups are generally run by two types of people:

* the **passionate volunteer** who loves the technology so much they just want to share it with like-minded people
* the **corporate evangelist** who is running the group as part of their job to educate the public and get traction for their employer's interests

One of initial goals for Guildflow was: "Create a modest stream of product revenue so that I could, over the long term, supplement and later replace my consulting income." The problem I have is:

The **passionate volunteer** has very little real money to spend. Historically, they could not even get enough money to cover the pizza costs when passing around a donation jar. Their time is very limited for meta-group responsibilities like group marketing. They get tremendous value and exposure from the network effect of the current the Meetup.com platform which I am unlikely to successfully compete with. 

The **corporate evangelist** has some money to spend but they are also interested in harvesting the group membership data for aggressive and questionable recruiting or marketing purposes. I am not really interested in participating in that kind of business.

I am shutting down Guildflow because after living in the meetup headspace for two years I have a hard time seeing a pathway to some level of financial stability which could properly compensate me for my time.

I could have tried to pivot my codebase to other group/calendaring needs (and I might just do that) BUT as I explore next project ideas I don't want to have historic assets or a sunk cost fallacy prevent me from fresh audiences and concepts.

## What's Next?

First, I have some shutdown tasks for Guildflow, like moving Philly Elixir to a new home, migrating some blog posts and archiving my stuff.

As for next side project, I dunno. I have a lot of soul searching going on right now. A few bullets of thought:

* Do more customer interviews.
* Build smaller MVPs and faster.
* More open source.
* More sharing of progress.

Be sure to [follow](https://mikezornek.com/follow/) me to hear more over the coming months.
