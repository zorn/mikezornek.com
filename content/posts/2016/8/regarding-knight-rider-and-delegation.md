---
title: Regarding Knight Rider and Delegation
date: 2016-08-02T22:14:36+00:00
aliases: /2016/08/02/regarding-knight-rider-and-delegation/
categories:
  - Books
  - Coding
  - iOS

---
One of the saddest aspects of being a [Big Nerd Ranch][1] instructor in 2016 is that students these days do not appreciate the Michael Knight is to Delegation, as RoboCop is to Subclassing discussion of yesteryear.

From [Cocoa Programming for OS X: The Big Nerd Ranch Guide][2]:

> **Delegation**
> 
> Let&#8217;s start with a story: Once upon a time, there was a man with no name. Knight Industries decided that if this man were given guns and wheels and booster rockets, he would be the perfect crime-fighting tool. First they thought, &#8220;Let&#8217;s subclass him and override everything we need to add the guns and wheels and booster rockets.&#8221; The problem was that to subclass Michael Knight, they needed to wire his insides to the guns, wheels, and booster rockets &#8211; a time-consuming task requiring lots of specialized knowledge. So instead, Knight Industries created a helper object, the Knight Industries 2000, or &#8220;KITT,&#8221; a well-equipped car designed to assist Michael Knight in a variety of crime- fighting situations.
> 
> While approaching the perimeter of an arms dealer&#8217;s compound, Michael Knight would say, &#8220;KITT, I need to get to the other side of that wall.&#8221; KITT would then blast a big hole in the wall with a small rocket. After destroying the wall, KITT would return control to Michael, who would charge through the rubble and capture the arms dealer.
    
> Note how creating a helper object is different from the RoboCop approach. RoboCop was a man subclassed and extended. The RoboCop project involved dozens of surgeons who extended the man into a fighting machine. This is the approach taken by many object-oriented frameworks.
> 
> In the Cocoa framework, many objects are extended in the Knight Industries way – by supplying them with helper objects. In this section, you are going to provide the speech synthesizer with a type of helper object called a delegate.

What do you think the new metaphor should be?

 [1]: https://www.bignerdranch.com/
 [2]: http://amzn.to/2aOLIBx