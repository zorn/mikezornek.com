---
title: The World Needs a Better Core Data
date: 2016-06-07T19:50:24+00:00
aliases: /2016/06/07/the-world-needs-a-better-core-data/
categories:
  - Coding
  - Gripes
  - iOS
  - Xcode
---

Lots of WWDC predictions out there this week. Here&#8217;s a dream of mine. Sadly one that I&#8217;ve given up on, at least from Apple.

## A Better Core Data.

- Tracking state is 1970s thinking. We should be tracking changes over time and rendering the current state of the object graph.
- Migrations, the number one feature. As you add new entities to a store, you do so through a migration. Change a column name, you do it through a migration. The current Core Data migration story is embarrassingly complex and very fragile. We need to have trust in our migrations.
- A single, focused, persistent store format. Allowing people to choose between XML, Binary, SQLite, InMemory and Custom adds more pain than it solves. Keep things simple. One on-disk format.
