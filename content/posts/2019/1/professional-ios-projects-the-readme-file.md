---
title: "The README File"
date: 2019-01-08T12:51:32-05:00
aliases: /posts/2019/1/anatomy-of-a-modern-ios-project-the-readme-file/
---

> This article is part of a series, [Professional iOS Projects](/professional-ios-projects/).

One of the most crucial documents in any project is its README file, a plain text file (sometimes formatted in [Markdown](https://kirkstrobeck.github.io/whatismarkdown.com/)) located in the root of the project directory, clearly named, usually in all caps, README.

README is the initial point of contact for product owners, current and future developers and sometimes end users. Even if your project is a solo private endeavor taking the time to produce a good REAME file will answer many questions your future self will have.

## Core Components

### Project Name and Branding

Name, tagline, logo, and a short description help market and explain what this project is all about. If available, links to more detailed marketing sites is also helpful.

### Project Status

Many project, particularly open source ones, like to promote their own status regarding test coverage, current versions, continuous integration, and more. Sometimes this comes in the form of small clickable badge images.

Other helpful links for this section would be to a modern CHANGELOG file and Release Note document.

### Feature List

Included towards the top, the goal of this feature list section is to help people understand a project's core competencies and if it is a good match for their needs. Don’t be afraid to embed high level architectural graphs, screenshots thumbnails or links to screencast demos. There is no reason a README should be text only.

### Installation and Getting Started

Dedicated to the users, this section should help people understand what it takes to get to a working version of this software stood up. If prebuilt binaries are available, those should be the linked and recommended.

If there are other setup needs those should be documented here as well. The basic goal is to help the user get to a Hello World demo of the core competency of the project. When it comes to more complex configuration settings, those should probably live in the main documentation, help system.

### Development and Contribution

Dedicated to the current and future developers of the project, this section should help someone who wants to contribute or test a development version of the project how to get their environment prepped and how to build the code base.

If there are processes for contributing bug reports, pull requests or documentation updates those should be documented here as well.

If you have specific code style guidelines, those should also be linked to.

Try not to make too many assumptions (we were all green devs at some point) and be as detailed as possible.

### Deployment

Deployment can mean a lot of different things to different projects but it doesn’t hurt to have a short summary in the README with more details in a separate guide.

If you have an active TestFlight beta page, link to it here.

### Links

While many will encounter your README on places like GitHub, project repos can be moved around, archived, and so on. For that and general convenience, it’s a great idea to have a raw list of project links. From a project’s home page to it’s repository URL to other things like issue trackers, support forums and related blog posts.

If you want to be really helpful link to your competition and other related projects too.

## Licensing

To help make it clear what others can do with this project it’s important to pick and document your license. A LICENSE file is a great place for the full legal speak, but a one liner and link on the README can answer most people's questions in a single glance.

If you need help picking a license [help is available.](https://choosealicense.com/) Also keep in mind the license of any third-party code libraries you are using, be sure to reference those as well.

## Examples

[awesome-labs/iOS-readme-template](https://github.com/awesome-labs/iOS-readme-template)

> README.md template for your iOS open-source projects.

## Apple Radar Bug Report

`#47121832` - Xcode Project Templates should come with a opinionated README template.

---

If you have a suggested edit or addition, [let me know](/contact). See you next time for [Anatomy of a Modern iOS App](/posts/2019/1/new-series-anatomy-of-a-modern-ios-project/).
