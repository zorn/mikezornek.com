---
title: "Swift UInt vs Int"
date: 2020-04-09T15:23:36-04:00
---

I'm giving major consideration to ustilizing Swift's `UInt` type for function returns and calculated properties in the future.

Yes this does burden the user of my code or SDK to do the occational type conversion, which is the only reason I've ever heard why the community uses `Int` even for variables that should not be negative, but I think the expressiveness outweighs the negative of more code.

I generally like to fall in line with the community when it comes to coding standards to help my code "fit in" but this issue has bothered me since day one of learning Swift. Would love to hear some feedback on this from expereinced Swift developers.