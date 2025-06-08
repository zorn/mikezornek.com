---
title: "Swift Style: Dequeuing and Populating Cells From UITableView"
date: 2018-10-15T23:03:40+00:00
aliases: /2018/10/15/swift-style-dequeuing-and-populating-cells-from-uitableview/
categories:
  - Coding
  - iOS
  - Tips
---

Everyone has an opinion when it comes to Swift code style, and here is mine when it comes to dequeuing and populating cells from `UITableView`.

First you should know Apple maintains two methods for dequeuing cells from `UITableView`:

    func dequeueReusableCell(withIdentifier identifier: String) -> UITableViewCell?

and

    func dequeueReusableCell(withIdentifier identifier: String, for indexPath: IndexPath) -> UITableViewCell

The second version, with the `indexPath` argument addition and non-optional return value, was added in iOS 6 but strangely the original version was never marked as deprecated. The `indexPath` version is the one you should use. (I know of no reason why anyone should prefer the original, but I welcome feedback.)

Now let&#8217;s take a look at an implimentation:

```swift
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: CustomCell.identifier, for: indexPath)
    if let customCell = cell as? CustomCell {
        customCell.item = itemForIndexPath(indexPath)
    }
    return cell
}
```

First we dequeue our cell. Notice how we use a class property to provide the cell identifier string value. We do it this way to avoid typos and enable easier refactoring.

Also note how we avoid any type casting on this dequeue line and instead capture the cell in a simple `UITableViewCell` reference. We do this because there is a chance that our tableview might not be properly registered with the cell identifier. Under such a scenario we&#8217;ll still get a cell instance but it will not be a `CustomCell` instance. I&#8217;d much rather return a boring `UITableViewCell` than crash with some explicit type casting using `as!` here.

Next we do our type casting using the more forgiving `as?`, making a new casted reference if a match happens.

To populate our cell there are two basic paterns. One would have a very generic cell expose its interface outlets and so you could configure the cell as you see fit depending on your model. The second approach would be to keep the cell&#8217;s outlets private and instead have the cell accept a model the cell is suppose to represent.

I generally lean towards the model approach. I also like to make a method called `itemForIndexPath` which helps if I ever refactor the view and introduce sections. If you are worried about coupling consider building a model just for the cell&#8217;s needs; a `CellViewModel` or something similar.

And finally, we return our cell reference. 👍
