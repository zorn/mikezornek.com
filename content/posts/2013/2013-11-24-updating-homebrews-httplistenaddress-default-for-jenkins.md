---
title: Updating Homebrew’s “httpListenAddress” Default for Jenkins
date: 2013-11-25T02:49:20+00:00
url: /2013/11/24/updating-homebrews-httplistenaddress-default-for-jenkins/
categories:
  - Coding
  - Continuous Integration
  - iOS
  - JavaScript
  - Tips
  - Xcode

---
I&#8217;ve setup some Jenkins servers in the past for Ruby on Rails apps but these days we are trying to get things running for iOS deployment and testing at work.

To experiment with some plugins and such I have my own Mac mini and installed Jenkins via Homebrew. Overall it&#8217;s working great though I was a bit stumped as to why I couldn&#8217;t load the Jenkins webpages outside of using `localhost:8080` on the Mac mini itself. Worked fine last I did a clean install.

Turns out the Launch Agent settings Homebrew gives you (located at `~/Library/LaunchAgents/homebrew.mxcl.jenkins.plist` for me) will launch with the following command line parameter `--httpListenAddress=127.0.0.1`. Edit this to `0.0.0.0` (the default) to allow all addresses.

> I know this isn&#8217;t the most enjoyable blog post but wanted to post it as Google Food for others who might run into the issue.

Other related posts:

  * [Advanced Jenkins for iOS and Mac][1]
  * [Running Frank as Part of iOS CI][2]

 [1]: http://www.sailmaker.co.uk/blog/2013/04/02/advanced-jenkins-for-ios-and-mac/
 [2]: http://blog.thepete.net/blog/2012/07/22/running-frank-as-part-of-ios-ci/