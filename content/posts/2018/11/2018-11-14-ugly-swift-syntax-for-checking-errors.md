---
title: Ugly Swift Syntax for Checking Errors
date: 2018-11-14T19:19:08+00:00
url: /2018/11/14/ugly-swift-syntax-for-checking-errors/
categories:
  - Coding
  - Gripes

---
A common code pattern I see a lot in iOS code is:

```swift
service.execute(request) { (response, error) in
    if let error = error {
        handleError(error)
        return
    }

    // work with response...
}
```

I don&#8217;t like that `if` statement. I&#8217;d much rather use a `guard` statement.

For those who don&#8217;t know `guard`, the [docs][1] explain:

> A `guard` statement, like an `if` statement, executes statements depending on the Boolean value of an expression. You use a `guard` statement to require that a condition must be true in order for the code after the guard statement to be executed. 

I like `guard` over `if` cause it&#8217;s more expressive about my intentions that the code after it **should only run** if there was no error found. Unfortunately, because of the boolean nature of the `guard` clause, to do this requires using Implicitly Unwrapped Optionals.

```swift
service.execute(request) { (response, error) in
    guard error == nil else {
        handleError(error!)
        return
    }

    // work with response...
}
``` 

I really try to avoid Implicitly Unwrapped Optionals, so much so I use [SwiftLint][2] to throw warnings for their use. Adding lint exceptions for this regular occurrence, for me, is not an option.

If you have more control over the `service` implementation you might choose to use a `Result` type.

```swift
enum Result<T> {
    case success(T)
    case failure(Error)
}

service.execute(request) { (result) in
    switch result {
    case .failure(let error):
        handleError(error)
    case .success(let response):
        handleResponse(response)
    }
}
``` 

I generally like this but it doesn&#8217;t work if you need to support a mixed Swift/Objective-C environment. It also doesn&#8217;t account UIKit itself does not use a Result type.

Code should be beautiful and so I think it&#8217;s important to document these things. I&#8217;d love to find a better solution and welcome [feedback][3].

 [1]: https://docs.swift.org/swift-book/LanguageGuide/ControlFlow.html
 [2]: https://github.com/realm/SwiftLint
 [3]: mailto:mike@mikezornek.com