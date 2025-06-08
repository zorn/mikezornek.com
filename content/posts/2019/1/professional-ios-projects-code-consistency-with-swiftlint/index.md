---
title: "Code Consistency with SwiftLint"
date: 2019-01-24T12:00:00-05:00
aliases: /posts/2019/1/anatomy-of-a-modern-ios-project-code-consistency-with-swiftlint/
---

> This article is part of a series, [Professional iOS Projects](/professional-ios-projects/).

<img src="book-cover.jpg" style="float: right; width: 300px;" alt="Book Cover: Writing Code No One Else Can Read" data-action="zoom">

Have you ever opened a source file and knew instantly it was written by a specific member of the team because of all the curious syntax choices they made? Perhaps they are green and don’t know the community standards or perhaps they spend most of their days in another language which has its own preferred style. What do you do?

Many programmers would agree at a certain level of maturity we look for code consistency in our own work and in our group projects. However manually enforcing a style guide is extremely tedious, error prone and can get personal real quick. The solution is to find tools that automate a community standard and let them enforce if not generate the code patterns for us.

In this post we’ll introduce and demonstrate one such tool for Swift iOS developers called [SwiftLint](https://github.com/realm/SwiftLint). Its a great first step into a world of consistent code and easy to get integrated into your Xcode project.

## What is SwiftLint?

Wikipedia [describes a linter](<https://en.wikipedia.org/wiki/Lint_(software)>) as:

> Lint, or a linter, is a tool that analyze source code to flag programming errors, bugs, stylistic errors, and suspicious constructs. The term originates from a Unix utility that examined C language source code.

[SwiftLint](https://github.com/realm/SwiftLint) is a tool that can scan your Swift code files and generate a list of warnings and errors based on a community provided collection of rules. It has great Xcode integration and online documentation.

## Installation

There are a few different ways to install SwiftLint. I’ll review the [Homebrew](https://brew.sh/) method as it is the one I prefer. Assuming you have Homebrew already installed, run:

    brew install swiftlint

This will install a command line tool called `swiftlint` and while you can use it from the command line most will want to integrate it with their Xcode project. To do so, you’ll want to add a new Build Phase for your main app target, specifically a Run Script Phase at the end, and insert the following code:

```bash
if which swiftlint >/dev/null; then
  swiftlint
else
  echo "warning: SwiftLint not installed, download from https://github.com/realm/SwiftLint"
fi
```

<figure>
<img src="xcode-build-phase.png" alt="Xcode Build Phase Editor" data-action="zoom"/>
<figcaption>Xcode Build Phase Editor</figcaption>
</figure>

This script will look for the `swiftlint` command line tool. If found, it will run it on your project's source files. If not found, it will still allow the build to finish but will post a short message to the console.

## SwiftLint In Action

With `swiftlint` installed and your Xcode project setup, you now will experience new inline warnings and errors, helping to identify code that might lean away from community standards. Sometimes the warnings or errors will even offer automated fix options too.

<figure>
<img src="xcode-editor.png" alt="Warnings and Errors in Xcode Editor" data-action="zoom"/>
<figcaption>Warnings and Errors in Xcode Editor</figcaption>
</figure>

## Customizing the Rules

Out of the box `swiftlint` will enforce a small subset of the 166 (and growing) rule collection. You can however customize the rules you want to enforce on your project by adding a `.swiftlint.yml` configuration file to the root of your project. Here you can explicitly opt in or disable rules. You can also configure file paths to exclude from rule matching (like `Pods` or `Carthage`). You can even configure some rules, defining the thresholds you want to be held accountable to (think file line size or method line size). More details on this configuration is in the [SwiftLint README](https://github.com/realm/SwiftLint/blob/master/README.md). A [full list of Rules](https://github.com/realm/SwiftLint/blob/master/Rules.md) is also well documented.

If you want to turn a rule off for individual occurrences, check out the inline `disable` and `enable` options:

```swift
// swiftlint:disable colon
let noWarning :String = "" // No warning about colons immediately after variable names!
// swiftlint:enable colon
let hasWarning :String = "" // Warning generated about colons immediately after variable names
```

Personally I recommend turning on all the rules to get started. If you have a previous code base this will probably result in hundreds of warnings and errors but you can easily filter these errors in Xcode to see them, one by one.

When I first started using SwiftLint in a larger project, I did this rule by rule, either fixing the code issues and committing the changes or adding the rule to the disabled list. It took a few hours but was a great way to learn what people considered good standards.

## Related Projects

SwiftLint has been my personal go-to tool of choice but if you want to compare some related projects checkout:

- [GitHub - sleekbyte/tailor: Cross-platform static analyzer and linter for Swift.](https://github.com/sleekbyte/tailor)
- [GitHub - nicklockwood/SwiftFormat: A code library and command-line formatting tool for reformatting Swift code](https://github.com/nicklockwood/SwiftFormat)
- [GitHub - Jintin/Swimat: An Xcode formatter plug-in to format your swift code.](https://github.com/Jintin/Swimat)
- [GitHub - oclint/oclint: A static source code analysis tool to improve quality and reduce defects for C, C++ and Objective-C](https://github.com/oclint/oclint)

## Conclusion

[SwiftLint](https://github.com/realm/SwiftLint) is a easy to install and configure tool that helps you add some code consistency to your Swift Xcode projects. It helps you avoid manual style checks during code reviews leaving more time to focus on actual code quality.
