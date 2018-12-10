---
title: Isolating Mac Application Menu Behaviors
date: 2016-09-12T17:34:58+00:00
url: /2016/09/12/isolating-mac-application-menu-behaviors/
categories:
  - Coding

---
## A Place for Everything, and Everything in It&#8217;s Place

My side project is a Mac app and last week I was working on a small story about sending feedback.

> **Send Feedback under Help Menu**
> 
> As a user,
    
> I want to be able to Submit Feedback via the Help menu,
    
> So that I let the developer know what I’d like changed.
> 
> Acceptance Criteria:
> 
>   * Under the Help menu there should be option to submit feedback.
>   * Upon selecting this menu item a new email will be open.
>   * to: `mzornek+storyteller@gmail.com`
>   * subject: `[Storyteller Feedback] [1.0(101)]` — that is the version number and build number

This was easy enough to get working but I wasn&#8217;t in love with my first implementation. If you read up on the [Menu documentation][1] for macOS you&#8217;ll find out application menus will follow the [Responder Chain][2] . A responder chain of a document-based application looks like this:

![responder chain of a document-based application][3]

Now while this is a document-based application this behavior is an application-level behavior. The best spot to put it is in the `AppDelegate` but I don&#8217;t like polluting that class.

My new solutions helps improve the situation in lieu of the framework&#8217;s design constraints. I still have the `IBAction` inside the `AppDelegate` but it now forwards the behavior to another object that is more isolated, with a single responsibility and is easier to test.

    // AppDelegate+SubmitFeedback.swift
    import Cocoa
    
    extension AppDelegate {
        @IBAction private func submitFeedback(sender: AnyObject?) {
            submitFeedbackService.submitFeedback()
        }
    }
    
    
    // SubmitFeedbackService.swift
    import Cocoa
    
    protocol URLOpener {
        func openURL(url: NSURL) -> Bool
    }
    
    extension NSWorkspace: URLOpener { }
    
    struct SubmitFeedbackService {
    
        private var to: String {
            return "mzornek+storyteller@gmail.com".urlEscape()
        }
    
        private var subject: String {
            return "[Feedback: Storyteller \(versionString)] ".urlEscape()
        }
    
        private var versionString: String {
            let appVersion = NSBundle.mainBundle().appVersion
            let bundleVersion = NSBundle.mainBundle().appBundleVersion
            return "\(appVersion) (\(bundleVersion))"
        }
    
        private let urlOpener: URLOpener
    
        init(workspace: URLOpener = NSWorkspace.sharedWorkspace()) {
            urlOpener = workspace
        }
    
        func submitFeedback() {
            let urlTemplate = "mailto:\(to)?subject=\(subject)"
            guard let emailURL = NSURL(string: urlTemplate) else {
                assertionFailure("Email should parse fine.")
                return
            }
            urlOpener.openURL(emailURL)
        }
    }
    
    private extension String {
        func urlEscape() -> String {
            guard let result = self.stringByAddingPercentEncodingWithAllowedCharacters(NSCharacterSet.URLQueryAllowedCharacterSet()) else {
                assertionFailure("Could not escape string for URL")
                return self
            }
            return result
        }
    }
    
    // SubmitFeedbackServiceTests.swift
    
    import XCTest
    @testable import Storyteller
    
    class SubmitFeedbackServiceTests: XCTestCase {
    
        func testCallingSubmitFeedbackOpensAMailtoURL() {
            let mockWorkspace = NSWorkspaceMock()
            let service = SubmitFeedbackService(workspace: mockWorkspace)
            service.submitFeedback()
            XCTAssertNotNil(mockWorkspace.lastOpenedURL)
            XCTAssertEqual(mockWorkspace.lastOpenedURL!.scheme, "mailto")
        }
    
    }
    
    class NSWorkspaceMock: NSObject, URLOpener {
        var lastOpenedURL: NSURL?
        func openURL(url: NSURL) -> Bool {
            lastOpenedURL = url
            return true
        }
    }
    

Feels cleaner to me but I welcome feedback. I also suspect `SubmitFeedbackService` will evolve in time as there is other communication needs in the future.

PS: I hope to share more about the implementation of project in the future. I know there is a void of Mac application programming discussions going on out in the web. I will try to help out with my own journalling the best I can. Questions welcome.

 [1]: https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/MenuList/MenuList.html#//apple_ref/doc/uid/10000032-SW1
 [2]: https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/EventOverview/EventArchitecture/EventArchitecture.html#//apple_ref/doc/uid/10000060i-CH3-SW2
 [3]: http://mikezornek.com/media/images/doc_based_responder_chain.png "responder chain of a document-based application"