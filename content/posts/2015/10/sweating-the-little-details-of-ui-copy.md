---
title: Sweating the Little Details of UI Copy
date: 2015-10-15T22:10:43+00:00
aliases: /2015/10/15/sweating-the-little-details-of-ui-copy/
categories:
  - Interface Design
  - iOS
---

While user interface design is not a core responsibility at my current job I do believe it is an important skill in my field and I try to improve all the time. A large aspect of user interface design is choosing the right words. For example, a good UI designer when crafting an iOS alert will honor and consider Apple recommendations. Some notes from the [HIG][1]:

> Place buttons appropriately. Ideally, the button that&#8217;s most natural to tap should meet two criteria: It should perform the action that users are most likely to want and it should be the least likely to cause problems if a user taps it inadvertently. Specifically:
>
> - When the most likely button performs a nondestructive action, it should be on the right in a two-button alert. The button that cancels this action should be on the left.
> - When the most likely button performs a destructive action, it should be on the left in a two-button alert. The button that cancels this action should be on the right.
>
> Give alert buttons short, logical titles. The best button titles consist of one or two words that describe the result of tapping the button. Follow these guidelines as you create titles for alert buttons:
>
> - As with all button titles, use title-style capitalization and no ending punctuation.
> - As much as possible, use verbs and verb phrases that relate directly to the alert text—for example, “Cancel,” “View All,” “Reply,” or “Ignore.”
> - Use “OK” for a simple acceptance option if there is no better alternative. Avoid using “Yes” or “No.”
> - Avoid “you,” “your,” “me,” and “my” as much as possible. Button titles that use these words are often ambiguous and can appear patronizing.

My personal pet peeve isn&#8217;t mentioned in the HIG but is present in almost all systems that require a user account:

> Forget your password?

**I hate that phrase.** I find it to be patronizing and judgmental. As if I&#8217;m suppose to remember every password I ever created for every little web site and service. Who could?

Additionally, it&#8217;s misleading. If I click a link labeled &#8220;New Comment&#8221; I expect to be provided a form to make a new comment. If click a link to &#8220;Forget your password?&#8221; do I expect some flashy animated GIF that will erase some data from my brain? What I want is a link to &#8220;Reset Password&#8221;. The link title &#8220;Reset Password&#8221; is clear, focused on the target action to be performed and does not have a hint of judgement.

Sweat the little things. Read and then reread the [interface guidelines][1]. Be able to explain why for all your interface choices. Have fun.

[1]: https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/index.html
