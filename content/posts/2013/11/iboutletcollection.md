---
title: IBOutletCollection
date: 2013-11-28T01:35:39+00:00
aliases: /2013/11/27/iboutletcollection/
categories:
  - Coding
  - Interface Design
  - iOS
  - Tips
  - Xcode
---

Did a short show and tell at the last CocoaHeads meeting demoing something I learned at work and hadn&#8217;t known about before, that being `IBOutletCollections`.

For seasoned Cocoa developers we all know that an `IBAction` is typically how a button sends a message to the controller that something should happen. On the flip side there is `IBOutlet` which is a pointer to a view in the UI that let&#8217;s the controller have access, typically to update the view&#8217;s contents or attributes.

Well an `IBOutletCollection` lets you have access to a whole collection of views via a single connection. In code declaring an `IBOutletCollection` is going to look something like this:

    @property (strong, nonatomic) IBOutletCollection(UITextField) NSSet *textFields;

When you declare the type of the outlet you can be specific such as `UITextField` or use higher level classes like `UIView` and connect to many different kinds of views. Technically you can use `NSArray` but since the order isn&#8217;t something I think is guaranteed best to stick to `NSSet`. Finally, while most outlets should be using `weak` references, these use strong since the view controller needs to own the array that contains the connections.

When you want to iterate over the collection just use fast enumeration like you normally would with an `NSSet`.

    - (void)updateUI
    {
        for (UITextField *textField in self.textFields) {
            textField.text = self.mainTextField.text;
            if (self.isBlue) {
                textField.textColor = self.view.window.tintColor;
            } else {
                textField.textColor = [UIColor redColor];
            }
        }
    }

For a simple project demo see my [OutletDemo][1] project on GitHub.

Some real world use cases for `IBOutletCollection` might include theming (outlet collections for various styles, then making connections to view that should be styled) as well as form access and validation. `IBOutletCollection` was introduced in iOS 4 so theres no reason not to check it out. Enjoy.

[1]: https://github.com/zorn/OutletDemo
