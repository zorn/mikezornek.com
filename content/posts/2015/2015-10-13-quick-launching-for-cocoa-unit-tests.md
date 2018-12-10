---
title: Quick Launching for Cocoa Unit Tests
date: 2015-10-14T01:22:26+00:00
url: /2015/10/13/quick-launching-for-cocoa-unit-tests/
categories:
  - Coding
  - Continuous Integration
  - Tips

---
I was doing some proofreading and research today regarding the latest testing features in Xcode 7. In the process I ended up rereading this article from [Mark Dalrymple on code coverage][1]. It&#8217;s a great article but it also reminded me of a little tip I wanted to share on the blog.

    - (BOOL)application:(UIApplication *)application
        didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
        ...
        // bail out early if we're running as a test harness.
        if (NSClassFromString(@"XCTestCase")) return YES;
    
        // otherwise load the main storyboard.
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"MainStoryboard" bundle:nil];
        UIViewController *vc = [storyboard instantiateInitialViewController];
        ...
    }
    

Not only can this type of check help speed up your unit test times by a little bit, but, it also makes sure you aren&#8217;t loading things like crash log capture tools, performance monitoring injections, or other things that might otherwise interfere with your unit test logic or code coverage numbers. Now if you are doing the new UI testing you&#8217;ll probably have to use some other kind of flag to define this path, but regardless the core idea is the same.

 [1]: https://www.bignerdranch.com/blog/weve-got-you-covered/