---
title: "Migrating JSON File Schema Changes in Swift"
date: 2020-09-01T11:26:25-04:00
description: A demonstration of how you could save your Swift app's storage as a simple JSON file and then migrate the file schema changes over time. This is particularly useful when you have users generating data and documents in beta builds while the app internals are changing a lot.
images:
  - posts/2020/9/migrating-json-file-schema-changes-in-swift/thumb.jpeg
---

As part of my [side project bartering](/posts/2020/8/bartering-with-other-developers-on-side-projects/), I've build a simple open source Xcode project that demonstrate how you could save your Swift app's storage as a simple JSON file and then migrate the file schema changes over time. This is particularly useful when you have users generating data and documents in beta builds while the app internals are changing a lot.

The code is in written in Swift and is utilizing a Xcode 12-specific SwiftUI project, though the core ideas are general purpose.

https://github.com/zorn/VersionedFilesDemo

Video walk through:

{{< video filename="migrating_json_file_schema_changes_in_swift.mp4" youtube="VUc_7E2w5jc" title="Migrating JSON File Schema Changes in Swift" >}}
