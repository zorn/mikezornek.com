---
title: Enums and Switches
date: 2013-12-29T17:31:47+00:00
aliases: /2013/12/29/enums-and-switches/
categories:
  - Coding
  - iOS
  - Tips
  - Xcode
---

If you are one to use `enum` to define modes or types in your models or controllers, consider using `switch` statements to help branch the different behaviors. If you do so, the complier will help you when you have forgotten to implement behavior for a `enum` value.

Take for example a view controller that might have different behavior if we are in an editing mode, and even more so the editing is handled differently depending on the target device. For this, let&#8217;s create an `enum` like:

    typedef enum ViewControllerMode : NSUInteger {
        ViewControllerModeDefault = 0,
        ViewControllerModeEditingiPhone,
        ViewControllerModeEditingiPad,
    } ViewControllerMode;

Now if the `tableView:didSelectRowAtIndexPath:` method let&#8217;s use a switch statement to branch behavior depending on the `behaviorMode`.

    -(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
    {
        switch (self.behaviorMode) {
            case ViewControllerModeDefault:
                [self showRecordAtIndexPath:indexPath];
                break;
            case ViewControllerModeEditingiPhone:
                [self editRecordAtIndexPath:indexPath];
                break;
            case ViewControllerModeEditingiPad:
                [self replaceRecordAtIndexPath:indexPath];
                break;
        }
    }

Notice we are not using a switch `default` behavior here. Now let&#8217;s add a new enum type called `ViewControllerModeEditingiWatch` and compile. Tada! The complier has a warning for us.

    Enumeration value 'ViewControllerModeEditingiWatch' not handled in switch

This pattern can be extremely helpful to make sure you are accounting for all needed behaviors. Please consider it next time you are working with `enum`. Thanks!
