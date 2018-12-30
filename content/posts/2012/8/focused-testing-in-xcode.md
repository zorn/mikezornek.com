---
title: Focused Testing in Xcode
date: 2012-08-27T03:10:55+00:00
aliases: /2012/08/26/focused-testing-in-xcode/
categories:
  - Tips
  - Xcode

---
I&#8217;ve set a very informal goal to produce content for this blog on a daily basis. We&#8217;re not there yet, but before the night is lost, here is a quick Xcode tip I fell into today.

So I&#8217;m using [RestKit][1] in a client project. In this project we `POST` and `PUT` lots of records. RestKit does not currently have an option to, when serializing a record, include those record attributes which are `nil` as `null`s in the resulting `JSON`. While there has been an ongoing [ticket][2] for this feature, my own release date is approaching and so I dug in this weekend to see what I could do.

As part of adding this code, I wanted to run and make additions to the RestKit test suite, but running the whole suite over and over as you are making very specific changes is a bit of a time waste. Here is my Xcode tip.

When working in an Xcode project that has lots of tests, you can temporarily setup Xcode to only run the tests you are working on by editing the schema. In the schema editor, look for the test action and from there you can expand the test target.

[![Edit Xcode Schema to Focus Your Testing][3]][4]

You&#8217;ll see checkboxes for each test file and they expand further for each test case. Check and uncheck to focus in on the tests you are working around. Hold down the Option key as you click on the checkboxes to turn them all on/off with a single click.

This can seriously speed up your editing cycle. Just make sure to switch them all back on (or do this change on a schema that isn&#8217;t shared in the repo) and verify that the full test suite passes before you commit your changes.

As for my feature, I think I have it working, but will let things settle down before I generate a nice pull request for the RestKit development branch.

 [1]: https://github.com/RestKit/RestKit
 [2]: https://github.com/RestKit/RestKit/issues/669
 [3]: http://mikezornek.com/media/images/edit_xcode_schema_to_focus_your_testing.png "Edit Xcode Schema to Focus Your Testing"
 [4]: http://mikezornek.com/media/images/edit_xcode_schema_to_focus_your_testing.png