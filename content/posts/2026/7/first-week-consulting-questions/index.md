---
title: "First Week Consulting Questions"
date: 2026-06-30T09:07:10-04:00
description: something tweet like
images:
  - posts/2020/6/book-dreaming-in-code/thumnb.jpeg
draft: true
pain: for a consultant adopting a new project it can be overwhelming and not sure where to start; for a consulting joing a team you have a unique perspective to question the status quo and ask why
fix: provie a brainstormy list of questions to ask yourself and team mates related to onboarding a new project
---

As a consultant I have the benifit of joinging and observing a wide spectrum of projects. 

Some endagements are handoffs or adoptions of software that needs a new owner. Entering these there are a lof of questions to ask and ceremonies to kick off. These ceremonies are all about creating an enviornment where we can quickly and reliably update and change the software while maintining high availabily and user satisfaction.

Other endagedemtns are more so joinging a team, and for these exsisting teams they already have their own cerimonies. As a new face on the team I have a perfect opportunity to challenge what they are doing, and more so to codify why they are doing it. Many team members can get cucumbered to the historic "we've always done it this way" additidute, and if that way is sounds and aligns with their values and mission they great -- if not -- maybe it is time to consider alternitice paths

> aside: At Test Double, there's a term for what happens when you've been inside an organization so long you stop noticing its quirks: you've been 'cucumbered' — left in the brine long enough that you've become indistinguishable from the brine itself. The value a consultant brings in week one isn't really technical at all — it's that they haven't been pickled yet."

> aside: there is a fine line in trying to change the world as a single new person joining a team. in fact you shouldn't. The practive of asking why is not nesisacrily looking for an opportunity to slide in your personal preference workflow -- it is more about creating space for the historic team to have their own introspection. if that leads to change, you need to work out what that change should be through team review and not the wims of a single person, even yourself.

## Onboarding

Two recent client engadgements of mine basically surfaced as the previous developers has moved on our been aquired. the software was live and needed to stay live. My early focus here was to get a domain understand of what the software did and then slowly stabalize it

Get the app running in a local development enviornment
- GitHub access
- running the app locally with asdf specific versions or a docker compose setup
- work hard to pin specific database versions and other service versions (you'll be amazed what little bugs pop up)

Run the app as a user
- take lots of annoted screenshots, ask questions
- when asking questions, use a shared Google Doc or GitHub discussions so that there is a paper trail with the answer and random people can chip in (not just the specific person who you might be talking to on zoom)
- Generating artifacts from this discovery work is valuble. Allows future devs and AI to discover them when they have similar questions
- on the topic of artifacts one reason why I lean into GitHub Issues and Discussions is that is is where the code is and less lilely to get lost in a company event like a lost Notion site or even Slack. additionally, when someone searches for a term in gitHub they can find not only the code the issues and discussions around it. you should be very mindful as a team where knowledge goes and why

Being to explore the code base
- pick a feature and look to see how it is implimented
- again, document your questions (and the eventual answers)
- have a peer walk you through their current work or PR

Work to understand how the app is deployed and releases work
- during these adopotion projects it is paramount you have the ability to react to problems or downtime, so getting your head around releases is important
- do a small change and get through the release cycle for the first time
- you've just gone through the basic onboarding process, what you can contribute to those current onboarding docs?

Create Learning Projects
- No doubt this project will include some tech you are less experienced with, identify it and figure out a skill up path for yourself. ask others for advice on how to learn X.

Meet your peers
- setup introduction calls. try to have a call with everyone, even if it is a short social call. You'll be working with the people for a while. get to know them.
- ask them what is working well on the project; what are areas of improvement opportunities.

Resync with your hiring manager
- Now that you've onboarded you'll have a much more detailed picture of the enviornment you are entering into.
- Have some secondary meeting with the person who hired you (or whom you answer to)
- Get your questions answered
- Reaffirm and evolve a clear list of expectations and responsibilities. On some projects I own full stack everything, on others I was asked to focus on more specific project and explicitly not to touch other things.

## Professional Contributions outside of Writing Code

Help build out the playbook
- There are areas of software development that are creative and should be unbound. However once you are in production, have customers and active users there should be a routine of sorts to keep the tains running, on time and in good shape.
- I tend to express this as a playbook, a collection of articles that help people run the platform
- Some of these will be weekly tasks (like have a team sync meeting, check for out of date dependencies, review error tracking from the week before) other might be monthly or yearly, review and plan larger projects, run security audits, verify backup systems.
- some playbooks will be domain specific like, how to reset staging, or how to run a team meeting.


Keep an OPS_LOG.
- I encourage infastrucre as code and that helps to document a lot of operation changes but there are still other things, and for those I encourage an OPS_LOG.
- A simple dated markdown file explaining any kind of manual database shenangins or other edits that were done. 


Keep decision documents
- formally these are called `architecture decision records` [reference](https://github.com/architecture-decision-record/architecture-decision-record) but in my own work I use the hopefully less intimidating "decisions".
- a decsion is any non-trivial, hard to reverse path chosen where it is helpful to capture the context of things consider and paths not chosen.
- like many things, having to actually write out these things is a great way to work out what you actually want to do any why. Sometimes you might even change your first path.

Ubiquitious language
- this is a term that comes from domain driven design and it is a paractice to normalize language and thus to avoid confsion accross the team where managment calls thing X and devs call thing Y.
- Do your best to introduce or reinforce language choice. Again ask why and clarification questions. 
- this is never an overnight effort, and rarely have I been completely successful, but the small wins I have made had large clarity imapcts

Code Review
- While not all teams enforce this, I tend to view outstanding PRs that need code review to be a top priority. This is code/resources/time the company has spent that currently has no impact and the longer is sits in queue the higher risk.
- Thus, if there is an open PR I tend to review that before starting new code of my own.
- I personally and very detail oriented in code reivew. I tend to leave lots of notes and by default consider them things to be considered but not required. If I have an explciit request I'll usually note `Blocking:`. This has caused friction on some teams since PR communication norms vary highly. I generally just recommend being clear about intent here--especially with new people.

Aside: I usually don't use GitHub changes required PR review response because then I become a blocker to having that code merged in. If the code author and other reviews approve, the resolved blocking comment (or they themselves dont condisder it blocking) then so be it.

Aside: With the rise of AI coding, PR review is much harder since when I ask why or what other approaced were considers the PR author may not have anything to say. This is why I think decision docs can help some, as they force the issue a bit.


with all of these you don't need to force other to comply, just lead by example. If these practices are valuable they will be picked up by your team.













## Software Management and Ceremonies

If I am joining a team that already has a locked in software lifecycle, the following is not something I would inject -- i would do the more ask why introspection to allow them to slowly evovled their own processes.

For projects where i have a lot of managfement responsibility this is what I do.

Issue Tracking
- When empowered I like to have a well managed issue tracker. Per previous remarks I tend to use GitHub Issues and GitHub Projects to be as close to the repo as possible.
- I also do this to make sure stakeholders have some vision into what we are working on, be able to see overall epic progress and risk levels against scheudles.

for issues themselves I tend to organize each with a status

- **Opportunities** - Unshaped ideas for work.
- **On Deck** - Work that has been prioritized, well-shaped, and understood.
- **In Progress** - Work that has been started.
- **Needs Review** - Work that has been finished (not merged) but is awaiting peer review.
- **Done (Merged)** - Work that has been merged but not yet deployed.
- **Deployed (Shipped)** - Work that has been deployed to customers.
- **To Be Verified** - Deployed work that is explicitly looking for business review/approval before being considered fully complete.
- **Verified** - Work that has been reviewed by business stakeholders and is considered correct and complete.
- **Canceled** - Work that has been dropped and is no longer being considered.

I like the name opportunites as the term backlog seems to imply this is work we need to do, while opportunities can live around for a while and may never be priortized.

I like having a space to put ideas for public conciseration and disscusion. There is a risk of having the opportunites get too large to browse and sure if that time comes, you need to clean things up and close those issues.

I do also tend to have issue types. These mosly help me explore large opportunity lists


- `Task` - A specific thing to do, including non-code work.
- `Bug` - An unexpected problem or behavior.
- `Feature` - An introduction of new functionality.
- `Enhancement` - An improvement to existing behavior.
- `Enhancement: UI` - Changes to the user interface to improve usability in some fashion not related to new behavior.
- `Security` - Work related to the security of the platform.
- `Code Refactor / DevOps` - Code changes to improve the quality of the code base and other changes that improve developer quality of life.
- `Documentation` - Improvements or additions to captured knowledge.

## Pull Requests

Pull requests should [reference](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) the issue they fix (and thus close). If they are work towards that issue but should not close I usually just say `Related to: #123`.

You should consider having a pull request template.

I like to shape a PR as telling a story, explaining the problem or enahcment request and then explaining you change and how it works towards a resolution to that problem. The PR should also have very clear instructions on how the change can be verified. If the default local dev enviornemnt does not have the needed seeded data to demonstrate the new code, include code so they can seed that scenario.

I tend to make PRs early in my own dev cycle, so people can see what I am working on. I use the "draft" pr type to signal I am not looking for actual code review. Only when the PR is "open" do I want people to review -- and I tend to formally request their review on GitHub. 

## Resources

https://12factor.net/ - This checklist became popular as SaaS was going mainstream, and continues to provide good questions to answer.
https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/ - this feels a little older an quaint compared to the towers of complexitiy we seem to mananage these days, but a good related brainstorming soruce
