---
title: "Testing Thoughts"
date: 2022-11-05T18:46:34-04:00
description: something tweet like
images:
  - posts/2020/6/book-dreaming-in-code/thumnb.jpeg
draft: true
---

I've been wanted to write up my own Philosphy of Elixir Testing for a while.

book club is a great execuse to do so.

## Skipping the argument of "should people test"

can't tell people what to do, but I can express why I write tests, what I look gain, the tradeoffs I accept and how I approach what to test and how

## Why do I test

## What is a "unit"

I disagree with guidance that you should have a test file for each source file.

I think you should test the user contract
using function names as describe might signal people to have a 1:1 test for each function in a module.

The goal is to validate the user contract with as little code as possible. We do not want to validate the imlimentation details -- the implimentation will change.

I disagree you need or should try to attain 100% code coverage.

Future article what makes up a test flake?

- forget to teardown things
- random data generation conflicts
- DateTime.now

Like the idea of saving a network response to help setup the test. Good source of documentation.

Just like code there are lot of considerations and then tradeoff decisions. Thats why its valuable to have a Testing Mission Statement to help get the team to agree to some high level values.

web layer
core layer

authenticated user enters the web layer and then if allowed can view the temperature in a housr

need to come up with a consise Testing Values summary.
