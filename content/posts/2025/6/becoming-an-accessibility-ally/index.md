---
title: "Becoming an Accessibility Ally: My Early Journey and Resources"
date: 2025-06-12T10:00:00-04:00
description: In today's post, I'll share some things I learned from the Website Accessibility course and a few tools and resources you can look into if you are interested in leveling up as well.
images:
  - posts/2025/6/becoming-an-accessibility-ally/axe-dev-tools-firefox-extension.webp
pain: web developer who might be less experienced on the frontend wants to be an accessibility ally but is not sure where to start
fix: share my own learning journey from last week, pointing out the resources and tools I discovered along the way
---

Here is a hard truth: while I **want** to be viewed as an ally to accessibility, I probably would not score very high if you judged me by my actions. In the past, I've worked a little extra to find the correct semantic HTML tags to use in various situations. I have included the random image `alt` attribute but not much else.

I had a few peers at my last employment who were more active regarding accessibility. While management or QA rarely prioritized fixes or rejected a PR because of failed accessibility access, there was some effort and discussions in the trenches. I remained mostly on the sidelines, with only one notable unit of work where we evaluated different approaches to keyboard navigation. (This was for a custom, searchable `<select>`, which was used for page navigation. I was refactoring it from a messy Alpine implementation to a more cleaned-up LiveView implementation with JS command patterns.)

Having [left that job](/posts/2025/5/returning-to-self-employment/), the interest in improving my accessibility skills remained, and last week I took action working through Frontend Masters' [Website Accessibility](https://frontendmasters.com/courses/accessibility-v3/) course by Jon Kuperman.

In today's post, I'll share some things I learned from the Website Accessibility course and a few tools and resources you can look into if you are interested in leveling up as well.

## Course Review and Takeaways

This is primarily a video course with some limited live code exercises broken down into the following sections:

### 1. Accessibility Overview

Provided a review of what accessibility is all about, historically and more specifically related to computers and the web. There was a brief review of legal compliance needs and the various web standards that drive accessibility specifications.

The section ends with installing a screen reader, which will be used in the next section. For me, it was the built-in macOS VoiceOver tool, but [other tools were provided](https://learn-a11y.netlify.app/screen-reader-setup) for Windows and Linux.

### 2. Semantic HTML & Assistive Devices

Reviewed image alt text, semantic HTML, the cost and complexity of using `<div>` elements as intended buttons, and screen reader-only content. We then use our new screen readers to work through some examples, demonstrating how the screen readers consume content using good examples, bad examples, and encouragement to make the bad examples work better.

I've used VoiceOver a little in the past. We did some very rudimentary demos of it when I taught the iOS classes for Big Nerd Ranch, but it was never something I leaned on much professionally. The space to use it on some basic exercises helped me greatly. I feel comfortable now, enabling it to walk content and even flip through rotor menus to see how it can navigate.

### 3. Managing Focus and Tab Order

This section reviewed keyboard navigation using tab order to influence the flow, what focus is all about, and how the focus should be visualized. I appreciated the candor of the instructor in reviewing what the accessibility standards ask for regarding focus visuals and how this often feels confrontational to some design teams who want to execute a particular look.

### 4. ARIA Labels & Roles

[Right from MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA):

> Accessible Rich Internet Applications (ARIA) is a set of roles and attributes that define ways to make web content and web applications (especially those developed with JavaScript) more accessible to people with disabilities.

In this section, the instructor reviewed some examples of ARIA. These specifically relate to me as a web application developer, as I often develop component abstractions that might not fit the standard markup. I can use ARIA roles and labels to decorate my markup to inform assistive devices better.

There was an exciting review of [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions), which is a way you can decorate areas of the page that are updating in real-time (like LiveView things). You can even use [a politeness setting](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live#values) to help share if the update should interrupt the flow of content or be presented at a break.

### 5. Color Contrast

Reviewed how a lack of color contrast can impact people's readability with low vision. This section also talked about how you might choose contrasting colors with intent but get poor outcomes for people with color blindness.

An example was shared from a Bloomberg article titled [Designing the Terminal for color accessibility](https://www.bloomberg.com/ux/2021/10/14/designing-the-terminal-for-color-accessibility/):

![An animation comparing our Default Color Scheme to a CVD Color Scheme with a Deuteranopia simulation overlay. This example exposes how the CVD color scheme (right) improved the color accessibility of the "up" and "down" market sentiment compared to the default color scheme (left).](/posts/2025/6/becoming-an-accessibility-ally/color-vision-deficiency-demo.gif)

Notice how the design chooses red and green with a wanted contrasting visual concept, but when viewed by people with color vision issues, they will not see that contrast. To make it work for those people, choose different colors or offer alternative themes.

### 6. Accessibility Tools & Testing

The course closes by providing lists and demos of various tools (which I will include in my own resources section below).

### Course Review

I enjoyed the course greatly. The video runtime total was about 2.5 hours and I probably spent 5-6 hours working through the content, pausing to read up and try things out. It is an excellent fit for the introduction I was looking for. The exercises were helpful but felt a little too open-ended for me. (I am extremely biased, however, to my own teaching patterns from my Big Nerd Ranch days.)

I was not an active paying Frontend Masters member before taking the course. I will likely keep it going for a few months and have bookmarked some follow-up course ideas. (I joined back in 2018 when I was first trying to figure out my exit plan from Apple, and took a few React and other web dev courses.)

In addition to the paid for courses, Frontend Masters has lots of smaller [tutorials](https://frontendmasters.com/tutorials/) and [blog posts](https://frontendmasters.com/blog/) that might interest you.

## Resources and Tools

With the course behind me, I wanted to apply what I've learned and start with my blog as soon as possible.

One of the first tools I used was the [axe DevTools Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/). This extension can help point out accessibly concerns (like label-less form elements, color contrast issues, and way more) with good notes on how to approach each problem. The company behind this is [Deque](https://www.deque.com) (which is actually where one of my accessibility-fluent peers went to work). A bit of a warning, many of the tools Deque offers have open source availability, but their website kind of steers you to buy the paid-for version, so be prepared to go hunting a bit.

![axe DevTools Firefox extension showing a few errors](/posts/2025/6/becoming-an-accessibility-ally/axe-dev-tools-firefox-extension.webp)

Another tool I relied on was [RocketValidator](https://rocketvalidator.com). This tool will accept a single URL, validate it and then follow the site links to provide a full review of your site. This is a paid tool, but you can use a very helpful and usable free tier to get started.

![A error filled version of a RocketValidator report.](/posts/2025/6/becoming-an-accessibility-ally/rocket-validator-report-red.webp)

See the [initial report for yourself](https://rocketvalidator.com/s/7b6cc10c-42ed-43f5-9abc-9ac27e3591c7). (Note: this is the pre-fix version of the report. I've fixed a ton of those issues.)

When solving the issues I saw on my public site, I relied on the local HTML validator of the [Web Developer Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/web-developer/) to help me make sure I was solving the issue. This extension is packed with helpful tools, but today, the `Validate Local HTML` tool was invaluable, letting me test local dev changes without publishing.

![A list of tools offered by the Web Developer extension.](/posts/2025/6/becoming-an-accessibility-ally/firefox-web-developer-extension.webp)

Towards the end of applying my fixes, I also utilized the [WAVE (Web Accessibility Evaluation Tool)](https://wave.webaim.org/) provided by the [WebAIM organization](https://webaim.org/). The presentation of structured content and inline overlays of problem areas was helpful—an [example report](https://wave.webaim.org/report#/https://learn-a11y.netlify.app/screen-reader) using one of the test pages from the course.

![WAVE Screenshot](/posts/2025/6/becoming-an-accessibility-ally/wave-tool.webp)

With most of the accessibility issues resolved, I still had some recommended tools I wanted to try.

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) is a popular web performance tool. It does include some automated accessibility checks but is way more focused on performance. There are [browser extensions](https://addons.mozilla.org/en-US/firefox/addon/google-lighthouse/) for Lighthouse, but you can also run it from [the web](https://pagespeed.web.dev).

I used some Lighthouse feedback to make some [slight changes](https://github.com/zorn/mikezornek.com/blob/2449017836dee2fbc0c91f2d120a8bd80a72aee7/themes/reborn/layouts/partials/head.html#L74) to my image preloads to ultimately help with `Largest Contentful Paint (LCP)` timings and drawing the page faster.

![Lighthouse screenshot](/posts/2025/6/becoming-an-accessibility-ally/lighthouse.webp)

What also caught my eye was some [Lighthouse CI tools](https://github.com/GoogleChrome/lighthouse-ci/). These can slip into your CI toolchain to generate reports, and enforce performance requirements. I did some [experiments](https://github.com/zorn/mikezornek.com/blob/main/.github/workflows/lighthouse.yaml) but would need more time to work correctly. There is even a [server](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md#the-lighthouse-ci-server) you can run so you might track the status of various performance metrics over time. This could be really powerful for a site of importance, but it is well outside my work scope this week.

In addition to Lighthouse CI, I also took note of [Pa11y](https://pa11y.org/) and its [own Dashboard tools](https://github.com/pa11y/pa11y-dashboard?tab=readme-ov-file#pa11y-dashboard) which seem to solve similar automated measurements over time.

## More Resources

- [WebAIM](https://webaim.org/) (web accessibility in mind) has a wonderful collection of articles and resources that can help provide curated and more accessible guidance.
- [Accessibility Weekly Newsletter](https://a11yweekly.com/issues/) is a weekly dose of web accessibility to help you bring it into your everyday work. Delivered to your inbox each Monday, curated by David A. Kennedy.
- The W3C [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/) develops standards and support materials to help you understand and implement accessibility. This is a general index with lots of information.
- The [Web Content Accessibility Guidelines (WCAG) docs](https://www.w3.org/WAI/standards-guidelines/wcag/) can be a little dense but helpful to reference if you are debating different approaches.

## Notes

- VoiceOver will often read the file names, so if you can avoid gibberish names like `20e47595573f720f.jpg`, please do.
- Generally speaking [accessibility conformance](https://www.w3.org/WAI/WCAG21/Understanding/conformance#conformance-requirements) is measured and labeled with `A`, `AA`, and `AAA`; and you may see tools like color contrast saying `A` level conformance is met but `AA` is not.
- I think automation such as CI running these tools and inline component testing of accessibility will be important if a team wants to maintain an accessible site over time. I'd similarly recommend bi-yearly (or more often) manual audits to identify improvement opportunities.

## Future Enhancements

- GitHub and other sites provide this cool detection of `tab` and immediately show a `Skip to Content` link at the top, and when you press `Enter,` it jumps to the content. I would love to add that to my blog.
- Many web apps have aligned on showing keyboard shortcuts using `?`. I want to consider doing that for future web apps and maybe even search tools for the blog.
- I've started moving my blog videos into a simple S3 bucket store. I want to figure out a way to provide text transcripts for them.

Every journey begins with a small step. I enjoyed the opportunity to skill up with accessibility, and hope to continue to apply it to future work.
