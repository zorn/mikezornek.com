# Research: what should the home page do, and how should it be structured?

Primary-source research input for a future home page decision. This file is **evidence,
not a decision.** The decision (if one is made) belongs in `docs/adr/`.

**Sources accessed 2026-09-17.** Every claim below is tagged as one of: **research
finding** (a usability study or measured data, mostly Nielsen Norman Group and Baymard),
**practitioner opinion** (first-party writing by people who teach consulting positioning
or personal sites; useful but unmeasured), or **observed example** (what a live site
actually does today). Where a source is old, the date is stated so it can be weighed
accordingly. No SEO or marketing blogs are cited as authority.

The home page as of 2026-09-17, before the change this research informed (template:
`themes/reborn/layouts/_default/home.html`): site-wide amber availability banner, purple
masthead with social icons, nav, a two-paragraph bio with a 128px avatar, the five-item
Start Here list, seven recent post cards, then "Browse all posts". There is no
newsletter form on the home page (it renders at the bottom of posts and on
`/newsletter/`) and no consulting call to action beyond the banner.

---

## What this settles

1. **Say who you are and what you do in one line at the top.** This is the most
   consistent finding across NN/g's homepage guidance from 2002 through 2024, and the
   one thing every consultant site surveyed does. The current bio does not say "Elixir"
   until the third sentence and never says "consulting". (Research finding; see Q1.)
2. **The first screen and the first two screenfuls carry most of the attention.** NN/g
   measured 57% of viewing time above the fold and 74% in the first two screenfuls
   (2018). Anything that must be seen goes there. (Research finding; Q1.)
3. **Users discount things that look like ads or that move.** A site-wide colored banner
   with a pulsing dot is exactly the kind of element NN/g says users skip. The banner
   should not be the only consulting pointer on the home page. (Research finding; Q1.)
4. **A real headshot earns attention; a decorative hero does not.** NN/g eyetracking
   shows users study real portraits and ignore stock or decorative imagery, and large
   hero images push useful content below the fold. Keep the avatar; do not add a hero or
   a carousel. (Research finding; Q1.)
5. **Consultant sites and developer blogs split cleanly on the home page.** Consultants
   (Stark, Morgan, Dashbit) put the offer in the hero. Developer bloggers (Lovin,
   Stamatiou, Evans, Coyier, Leopardi, Jurić) show a one-line bio and recent posts and
   no hire-me CTA at all. Nobody surveyed does both well, which is the actual design
   problem here. (Observed examples; Q3.)
6. **Newsletter forms on personal developer sites sit mid-page, after the intro, with a
   one-line promise.** Comeau, Dodds, and Evans do this; NN/g says to set expectations
   at signup. (Research finding plus observed examples; Q1, Q3.)
7. **The Start Here list is well supported.** Nielsen's guideline to "show examples of
   real site content" and Flynn's and Rowse's Start Here rationale both back it.
   (Research finding plus practitioner opinion; Q2.)
8. **Evidence on ordering and on how many recent posts to show is thin.** Nothing
   measured says "five, not seven". Treat those as judgment calls, not findings.

---

## Q1: What does usability research say about home pages and the first screen?

### The homepage must state who you are and what you do

- **Research finding, dated.** Jakob Nielsen, "Top 10 Guidelines for Homepage
  Usability," NN/g, May 11, 2002. Guideline 1: "Start the page with a tagline that
  summarizes what the site or company does, especially if you're new or less than
  famous." Guideline 4: "Your homepage should offer users clear starting points for the
  main 1–4 tasks they'll undertake." Guideline 6: show examples of real site content
  rather than describing it. Guideline 9: "Users often dismiss graphics as ads and focus
  on parts of the homepage that look more likely to be useful." Guideline 10: avoid
  decorative stock art.
  https://www.nngroup.com/articles/top-ten-guidelines-for-homepage-usability/ The
  article is 24 years old; its substance is restated in the 2024 article below, so the
  age is not disqualifying.
- **Research finding, current.** Huei-Hsin Wang, "Homepage Design: 5 Fundamental
  Principles," NN/g, March 15, 2024. Principle 2: include "a concise tagline on your
  homepage to communicate who you are and what you do," avoid generic welcomes and dense
  text, use authentic imagery rather than stock photos. Principle 3: "the fold remains
  crucial"; show specific content samples, not category labels. Principle 4: use
  specific link labels with high information value instead of vague terms like "Learn
  More." Principle 5: "moving elements are often assumed to be ads"; avoid autoplay and
  popups. https://www.nngroup.com/articles/homepage-design-principles/
- **Research finding, dated.** Jakob Nielsen, "How Long Do Users Stay on Web Pages?",
  NN/g, September 11, 2011: "the first 10 seconds of the page visit are critical" and
  "To gain several minutes of user attention, you must clearly communicate your value
  proposition within 10 seconds."
  https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/
- **Research finding.** Tuch, Presslaber, Stoecklin, Opwis, Bargas-Avila (Google and
  University of Basel), "The role of visual complexity and prototypicality regarding
  first impression of websites," International Journal of Human-Computer Studies 70(11),
  2012. Visual complexity and prototypicality "affect participants' aesthetics ratings
  within the first 50 ms of exposure"; sites with low visual complexity and high
  prototypicality (they look like what users expect a site of that kind to look like)
  rated highest.
  https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/
  Implication: a plain, conventional personal-site layout is an asset, not a weakness.

### Where attention goes: fold, scrolling, scanning

- **Research finding.** Therese Fessenden, "Scrolling and Attention," NN/g, April 15,
  2018: "Users spent about 57% of their page-viewing time above the fold," "74% of the
  viewing time was spent in the first two screenfuls," and "81% of the viewing time is
  spent in the first three screenfuls." Recommendations: place high-priority content and
  CTAs above the fold, avoid false floors, signal that content continues below.
  https://www.nngroup.com/articles/scrolling-and-attention/
- **Research finding.** Amy Schade, "The Fold Manifesto: Why the Page Fold Still
  Matters," NN/g, February 1, 2015: "What is visible on the page without requiring any
  action is what encourages us to scroll." The 100 pixels just above the fold received
  102% more views than the 100 pixels just below it.
  https://www.nngroup.com/articles/page-fold-manifesto/
- **Research finding.** Kara Pernice, "F-Shaped Pattern of Reading on the Web," NN/g,
  November 12, 2017 (reviewed August 19, 2026): "First lines of text on a page receive
  more gazes than subsequent lines," "First few words on the left of each line of text
  receive more fixations than subsequent words," and the recommendation to "Include the
  most important points in the first two paragraphs on the page."
  https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ Applied here:
  the first words of the first bio sentence are "Hello! My name is Mike Zornek. I
  describe myself as both a developer and teacher." The positioning payload (Elixir,
  consulting) is not in the first line.

### Photos, hero images, carousels, banners

- **Research finding, dated.** Jakob Nielsen, "Photos as Web Content," NN/g, October 31,
  2010 (reviewed August 13, 2026): users "pay close attention to photos and other images
  that contain relevant information but ignore fluffy pictures used to 'jazz up' web
  pages." In one study users spent "10% more time viewing the portrait photos" of real
  staff than reading their bios, but "ignore stock photos of generic people."
  https://www.nngroup.com/articles/photos-as-web-content/
- **Research finding.** Kathryn Whitenton, "Image-Focused Design: Is Bigger Better?",
  NN/g, September 28, 2014: "Large images are visually appealing, but they can harm the
  overall user experience if they aren't appropriately prioritized." The Southwest
  example shows a full-bleed image pushing the primary task below the fold.
  https://www.nngroup.com/articles/image-focused-design/
- **Research finding.** Kara Pernice, "Carousel Usability," NN/g, September 14, 2013
  (reviewed August 7, 2026): "people often immediately scroll past these large images,"
  and "animated ads get looked at 27% of the time."
  https://www.nngroup.com/articles/designing-effective-carousels/
- **Research finding.** Edward Scott, "10 UX Requirements to Follow for a User-Friendly
  Homepage Carousel Design," Baymard, April 30, 2019, updated April 3, 2025: "46% of all
  homepage carousels on ecommerce sites have UX performance issues"; "a well-performing
  and simpler alternative is to use static content sections." Baymard's corpus is
  ecommerce, so weight accordingly. https://baymard.com/blog/homepage-carousel
- **Guidance, first party.** web.dev, "Largest Contentful Paint (LCP)," updated
  September 4, 2025: "LCP reports the render time of the largest image, text block, or
  video visible in the viewport"; good is 2.5 seconds or less at the 75th percentile.
  https://web.dev/articles/lcp And "Optimize LCP," updated March 31, 2025: "Never
  lazy-load your LCP image"; set `fetchpriority="high"` on a likely LCP image.
  https://web.dev/articles/optimize-lcp Bearing here: a large hero would become the LCP
  element and add a performance liability; the current 256px avatar already uses
  `loading="eager"` (`partials/zorn-avatar.html`), so it is fine as is.

### Credibility and the "about" content

- **Research finding.** Anna Kaley and Jakob Nielsen, "'About Us' Information on
  Corporate Websites," NN/g, May 26, 2019 (70+ users, 100+ sites): users expect About
  content to be "clear, authentic, and transparent"; they favor "realistic photography"
  and content showing "actual employees and products"; many sites "fail to clearly
  explain what they do."
  https://www.nngroup.com/articles/about-us-information-on-websites/
- **Research finding, dated.** Stanford Web Credibility Guidelines, 2002 (4,500
  participants): "Show that there's a real organization behind your site," "Highlight
  the expertise in your organization," "Show that honest and trustworthy people stand
  behind your site," "Make it easy to contact you," "Update your site's content often,"
  "Use restraint with any promotional content."
  https://credibility.stanford.edu/guidelines/index.html Old, but nothing in later NN/g
  work contradicts it.

### Newsletter signup placement

- **Research finding.** Kim Flaherty, "Marketing Email and Newsletters: UX Findings Then
  and Now," NN/g, August 13, 2017: "Subscription forms on websites have become shorter
  and are often embedded into the footer or into other transactions," and "It is still
  good practice to communicate the basics about the subscription at the time of sign up,
  to set expectations." https://www.nngroup.com/articles/newsletters/ NN/g offers no
  measured finding on home page placement specifically; the observed examples in Q3 are
  the best available guide.

---

## Q2: What do practitioners say about a consultant's or blogger's home page?

All of this is **practitioner opinion**: experienced, first party, and unmeasured.

- **Jonathan Stark, positioning statement.** "How To Write A Laser Focused Positioning
  Statement": the template is "I'm a ___ who helps ___ with ___. Unlike my competitors,
  ___." He says it is "typically not used verbatim in marketing materials, but rather as
  a guide for crafting various types of messaging (e.g., tagline, slogan, cocktail party
  answer, etc)."
  https://jonathanstark.com/how-to-write-a-laser-focused-positioning-statement On
  conjunctions: "Conjunctions in an LFPS (such as 'and') usually indicate an
  unwillingness to pick something."
  https://jonathanstark.com/daily/20161024-laser-focused-positioning-statement-review-1
  Relevant because the current bio's self-description is "both a developer and teacher,"
  which is exactly the conjunction he warns about. His own home page practices what he
  teaches: name, headshot, one-line who-I-help statement, one CTA (see Q3).
- **Philip Morgan.** philipmorganconsulting.com now redirects to opportunitylabs.io (an
  agency), and his personal site is philipmorgan.net. The personal home page opens with
  a headshot and a two-part tagline, "Professionally: Helping sales teams increase
  pipeline volume & velocity; Personally: Enjoying finding a home in Missoula, MT,
  making photographs, & navigating midlife." https://philipmorgan.net/ This is the
  closest observed model to mikezornek.com's mixed job: one line for the business, one
  line for the person, side by side. I could not retrieve a first-party article of his
  specifically about home page structure; his published work is on specialization and
  positioning, not page layout.
- **Amy Hoy, Stacking the Bricks.** "6 Critical Mistakes You're Making with Your Landing
  Page," December 10, 2018: the first mistake is "Focusing on the product and not the
  reader"; lead with the reader's concrete pain; "Your copy...is the most precious
  thing, you must make it so easy to see...it's almost impossible not to."
  https://stackingthebricks.com/6-landing-page-mistakes/ This is about sales pages, not
  home pages, so it applies to the consulting sentence, not to the bio.
- **Derek Sivers, /now.** "The /now page movement," October 21, 2015: a /now page is "A
  public declaration of priorities" that also "helps me say no." https://sive.rs/nowff
  nownownow.com/about: "A /now page shares what you'd tell a friend you hadn't seen in a
  year." https://nownownow.com/about Sivers's own home page links /now from the first
  screen (Q3). mikezornek.com already has `/now/` in the nav but the bio does not point
  at it.
- **Pat Flynn, Start Here.** "The Starting Point on Your Blog," March 30, 2011: "Once
  people get to the site, they don't know where to go. There's no starting point. So,
  they leave and many never return." And: "An about page is viewed when people want to
  learn about a website and its author, and a starting point is viewed when people want
  clear direction on what actions to take."
  https://www.smartpassiveincome.com/blog/starting-point-page/ (The `/start-here/` page
  on his site now returns 404.)
- **Darren Rowse, ProBlogger.** Podcast PB111, "How to Create an Effective Start Here
  Page," 2016: a Start Here page exists because "it can be very challenging for a new
  reader coming to your blog to find the right stuff for them." His recommended contents
  include a personal connection, who the blog is for, links to high-impact posts, and
  "Call-to-action to build your email list."
  https://problogger.com/podcast/how-to-create-an-effective-start-here-page-for-your-blog/
  Note that both Flynn and Rowse describe a separate page; mikezornek.com inlines the
  list on the home page, which is a reasonable adaptation for a five-item list but is
  not what they describe.
- **IndieWeb h-card.** "Marking up your homepage profile with a minimal h-card including
  name, url and photo properties covers most h-card usage on the IndieWeb."
  https://indieweb.org/h-card The home bio has the three ingredients but no h-card
  classes (checked: no `h-card` in `themes/reborn/layouts`).
- **Not consulted.** Paul Jarvis's pjrvs.com now 301-redirects to usefathom.com/pjrvs,
  so there is no personal home page to survey. Jason Fried / 37signals publish company
  pages rather than a personal consultant site and were not consulted.

---

## Q3: Survey of live personal and consultant sites

All rows are **observed examples**, fetched 2026-09-17. "Hire CTA" means an explicit
services, coaching, or contact-for-work call to action on the home page. "Newsletter"
means a signup form or a signup link visible on the home page itself.

| Site | First screen | Hire CTA | Newsletter on home | Recent posts |
| --- | --- | --- | --- | --- |
| jonathanstark.com (consultant) | B&W headshot, "Hi! I'm Jonathan Stark," one line: "I help freelancers, consultants, and other independent professionals make more and work less without hiring." Button: "Get Daily Pricing Tips »" | Yes, mid-page: "Browse Coaching Options »" and "Browse Workshops & Books »" plus three testimonials | Yes, in the top nav, hero, and footer | No |
| philipmorgan.net (consultant) | Headshot, name, two-part tagline: "Professionally: Helping sales teams...; Personally: Enjoying finding a home in Missoula..." | Yes, a paragraph pitching OpportunityLabs.io | No | No (nav link to Posts) |
| dashbit.co (Elixir consultancy) | "Build Elixir applications with speed and confidence"; subscription offer; "Learn more" button | Yes: "Get in touch" in nav plus contact form at bottom; team bios with credentials | No | No |
| sive.rs | "(Everything here is 100% me, no AI.)" then a "me in 10 seconds" bio, links to /about and /now, "Contact me" | No (contact only) | No | Yes, "newest articles" |
| brianlovin.com | Name and one line: "I'm a software designer living in San Francisco, currently making AI products at Notion." | No | No | Yes, five essays, then projects |
| paulstamatiou.com | Name, "Welcome to my corner of the web...", current role, short credentials, no hero image | No (footer Contact only) | No (RSS) | Yes, ten posts with thumbnails |
| joshwcomeau.com | Nav, then articles and tutorials list; no bio hero | No hire CTA; courses linked in footer | Yes, mid-to-lower: "Want to know when I publish new content? Enter your email to join my free newsletter:" | Yes, plus a "Popular Content" top-ten list |
| kentcdodds.com | Headline "Helping people make the world a better place through quality software," illustration, three buttons: "Read the blog," "Take a course," "Learn more about Kent," intro video | Courses section ("My flagship training"); no consulting CTA | Yes, twice (main content and footer) | Yes, three featured posts |
| jvns.ca | "Hey! I'm Julia. Welcome to my blog. Here's every post I've ever written, organized by category. Enjoy!" | No; a line about zines at Wizard Zines | Yes, a link to a "weekly digest of these blog posts" | Yes, ten most recent, then full archive by category |
| chriscoyier.net | Name and title line, headshot, "I'm a web designer, developer, educator, and business owner," logos for ShopTalk and CSS-Tricks | No | No | Yes, with excerpts |
| andrealeopardi.com (Elixir core team) | Name, short intro (platform engineer at Knock, Elixir core team since 2016, focus areas), no photo | No; a Teaching section | No | Yes, nine posts with descriptions |
| peterullrich.com (Elixir developer, educator) | Portrait, "Hey, I'm Peter! Developer & Educator.", one-paragraph bio, social links | No | Nav link only, no form | Yes, ten posts with thumbnails and tags |
| mitchellhanberg.com (Elixir tooling) | "Staff Software Engineer," short bio, "Get in touch" via GitHub or email | No | Footer link only | No; projects and talks instead |
| theerlangelist.com (Saša Jurić) | Blog title and tagline, bio paragraph with RSS, Twitter, GitHub links | No | No | Yes, plus the latest post inline |
| zachdaniel.dev (Substack) | Name, "Kindling for thought.", avatar, "Over 1,000 subscribers," Subscribe button | No | Yes, the whole first screen is a subscribe gate | No |

Not retrievable: germsvel.com (connection refused on 2026-09-17). Redirected away:
pjrvs.com (to usefathom.com), philipmorganconsulting.com (to opportunitylabs.io).

What the table shows: every consultant site leads with a who-I-help line and puts the
offer within the first two screenfuls; every developer blog leads with a one-line bio
and recent posts; the three developer sites with a newsletter form (Comeau, Dodds,
Evans) place it after the intro and before or beside the recent posts, with a one-line
promise. No surveyed site uses a site-wide availability banner, a carousel, or a
full-bleed hero. Only Kent C. Dodds uses an illustration in the hero, and his page is a
course business as much as a blog.

---

## Q4: What this means for mikezornek.com

Prioritized. Each item names its evidence. Items 1 through 3 are the ones the evidence
supports most strongly; 4 through 7 are cheaper and lower stakes.

1. **Rewrite the first line of the bio as a positioning line that names Elixir and the
   audience.** Something in the shape of "I'm an Elixir developer who helps small teams
   ship and stabilize Phoenix apps, and I write here about the craft." The rest of the
   bio can stay personal. Evidence: NN/g tagline guidance (2002 and 2024), the 10-second
   value proposition finding (2011), the F-pattern finding that the first words of the
   first line get the most fixations (2017), and Stark's positioning template and his
   warning about "and" (practitioner). Every consultant site in Q3 does this; the
   current first line does not.
2. **Add one in-flow consulting sentence or small card directly after the bio, above
   Start Here, with a specific link label.** For example: "Need Elixir help now? I run a
   fixed-price two-week sprint. See the sprint →" linking to `/elixir-consulting/`. Do
   not rely on the banner alone: NN/g finds users dismiss elements that look like ads or
   that move (2002 guideline 9; 2024 principle 5), and the banner is amber, site-wide,
   and animated. Keep it, but treat it as a notice, not the CTA. NN/g principle 4 also
   argues for replacing the banner's "Details →" with a label that says what is behind
   it. Placement inside the first two screenfuls follows the 57% / 74% attention finding
   (2018). Observed: Stark, Morgan, and Dashbit all place the offer in the first two
   screens; Philip Morgan's two-line "Professionally / Personally" tagline is the
   closest model for a page that must also stay personal.
3. **Add the newsletter signup to the home page, below Start Here and above Recent
   Posts, with the one-line promise from `/newsletter/`.** Evidence: NN/g says to set
   expectations at signup (2017); Rowse lists an email CTA as a standard Start Here
   element (practitioner); Comeau, Dodds, and Evans all place a form or link after the
   intro (observed). The existing Kit partial (`partials/newsletter-signup.html`)
   already renders elsewhere, so this is a placement decision. A prior decision parked
   the home page form; this evidence argues for revisiting that in an ADR rather than
   silently reversing it.
4. **Keep the real headshot and the personal details; do not add a hero image,
   illustration, or carousel.** Evidence: NN/g finds users study real portraits and
   ignore decorative imagery (2010) and that large images push tasks below the fold
   (2014); Baymard and NN/g both document carousel failure (2013, 2019/2025); web.dev
   warns a large hero becomes the LCP element. The Phillies and video games sentence is
   the "honest and trustworthy people" signal Stanford and NN/g's About Us research
   describe. The avatar is already `loading="eager"`, so nothing to fix there.
5. **Keep the Start Here list, and add one line saying who it is for.** The list is
   backed by Nielsen's "show examples of real site content" (2002, restated 2024) and by
   Flynn and Rowse (practitioner). Rowse's checklist adds "clear identification of your
   target audience," which the current lead line ("New here? Here are some quality posts
   to get you started.") does not do. Evidence for the count is absent; five is a
   judgment call and fine.
6. **Link `/now/` from the bio, not only from the nav.** Sivers's argument that a /now
   page answers "what are you up to these days" is practitioner opinion, but his home
   page and Andrea Leopardi's both surface it near the top, and it costs a few words. It
   also serves Stanford's "show it's been reviewed recently" guideline.
7. **Mark up the bio as an h-card.** Add `h-card`, `p-name`, `u-url`, and `u-photo`
   classes to the existing avatar and name; the IndieWeb page says this minimal set
   "covers most h-card usage." Zero visual change, low priority.
8. **Do not spend effort on reordering or trimming the recent-posts block.** No source
   measures whether seven cards or five is better. Nielsen's guideline 8 (keep an
   archive link) is already satisfied by "Browse all posts →." Leave it unless something
   above needs the space.

Explicitly not supported by anything found: a hero with a big illustration (Dodds is the
only example and it is a course business), a modal or slide-in signup (NN/g 2024
principle 5 says skip popups), and a video introduction on the home page (no research
either way; Dodds uses one, nobody else surveyed does).

---

## Sources

Research findings:

- Nielsen, "Top 10 Guidelines for Homepage Usability," NN/g, 2002-05-11.
  https://www.nngroup.com/articles/top-ten-guidelines-for-homepage-usability/
- Wang, "Homepage Design: 5 Fundamental Principles," NN/g, 2024-03-15.
  https://www.nngroup.com/articles/homepage-design-principles/
- Nielsen, "How Long Do Users Stay on Web Pages?", NN/g, 2011-09-11.
  https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/
- Fessenden, "Scrolling and Attention," NN/g, 2018-04-15.
  https://www.nngroup.com/articles/scrolling-and-attention/
- Schade, "The Fold Manifesto," NN/g, 2015-02-01.
  https://www.nngroup.com/articles/page-fold-manifesto/
- Pernice, "F-Shaped Pattern of Reading on the Web," NN/g, 2017-11-12, reviewed
  2026-08-19. https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- Nielsen, "Photos as Web Content," NN/g, 2010-10-31, reviewed 2026-08-13.
  https://www.nngroup.com/articles/photos-as-web-content/
- Whitenton, "Image-Focused Design: Is Bigger Better?", NN/g, 2014-09-28.
  https://www.nngroup.com/articles/image-focused-design/
- Pernice, "Carousel Usability," NN/g, 2013-09-14, reviewed 2026-08-07.
  https://www.nngroup.com/articles/designing-effective-carousels/
- Kaley and Nielsen, "'About Us' Information on Corporate Websites," NN/g, 2019-05-26.
  https://www.nngroup.com/articles/about-us-information-on-websites/
- Flaherty, "Marketing Email and Newsletters: UX Findings Then and Now," NN/g,
  2017-08-13. https://www.nngroup.com/articles/newsletters/
- Scott, "10 UX Requirements to Follow for a User-Friendly Homepage Carousel Design,"
  Baymard, 2019-04-30, updated 2025-04-03. https://baymard.com/blog/homepage-carousel
- Tuch et al., "The role of visual complexity and prototypicality regarding first
  impression of websites," IJHCS 70(11), 2012.
  https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/
- Stanford Web Credibility Guidelines, 2002.
  https://credibility.stanford.edu/guidelines/index.html
- web.dev, "Largest Contentful Paint (LCP)," updated 2025-09-04.
  https://web.dev/articles/lcp
- web.dev, "Optimize Largest Contentful Paint," updated 2025-03-31.
  https://web.dev/articles/optimize-lcp

Practitioner opinion:

- Stark, "How To Write A Laser Focused Positioning Statement."
  https://jonathanstark.com/how-to-write-a-laser-focused-positioning-statement
- Stark, "Laser-focused positioning statement review #1," 2016-10-24.
  https://jonathanstark.com/daily/20161024-laser-focused-positioning-statement-review-1
- Hoy, "6 Critical Mistakes You're Making with Your Landing Page," 2018-12-10.
  https://stackingthebricks.com/6-landing-page-mistakes/
- Sivers, "The /now page movement," 2015-10-21. https://sive.rs/nowff and
  https://nownownow.com/about
- Flynn, "The Starting Point on Your Blog," 2011-03-30.
  https://www.smartpassiveincome.com/blog/starting-point-page/
- Rowse, "PB111: How to Create an Effective Start Here Page for Your Blog," 2016.
  https://problogger.com/podcast/how-to-create-an-effective-start-here-page-for-your-blog/
- IndieWeb, "h-card." https://indieweb.org/h-card

Observed examples (all fetched 2026-09-17): https://jonathanstark.com/ ,
https://philipmorgan.net/ , https://dashbit.co/ , https://sive.rs/ ,
https://brianlovin.com/ , https://paulstamatiou.com/ , https://www.joshwcomeau.com/ ,
https://kentcdodds.com/ , https://jvns.ca/ , https://chriscoyier.net/ ,
https://andrealeopardi.com/ , https://peterullrich.com/ ,
https://www.mitchellhanberg.com/ , https://www.theerlangelist.com/ ,
https://www.zachdaniel.dev/
