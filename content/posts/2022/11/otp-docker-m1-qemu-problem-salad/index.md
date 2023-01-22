---
title: "Otp Docker M1 Qemu Problem Salad"
date: 2022-11-17T15:58:30-05:00
description: something tweet like
images:
  - posts/2020/6/book-dreaming-in-code/thumnb.jpeg
draft: true
---

In the sprit getting double value out of work efforts I wanted to do a little journal about a build issue I have. 

So I am doing part time maintance for a client and working to update the version of Elixir and OTP they are using as a step one towards other technical debt payments.

They use Elixir releases created in a Docker container which are deployed to Amazon. Nothing too special.

The deployment target architecture, and the architecture we use for the Docker image is `linux/amd64`. I am building the image on my M1 Mac, and thus the fun begins.

This project has been using OTP 23 but with version OTP 24 the JIT compiler was added. This seems to make Docker (through it's internal depenandancy `qemu` very unhappy).

There are closed GitHub issues where the projects point at one another and forum threads of people continuing to run into trouble.

I myself do not have a simple path forward.

I think the simplist answer is to work towards assembling the deployment Docker image in CI, where it can build as `linux/amd64` and not `linux/arm64`

If I wanted to make this work locally on my Mac I might be able to use something like buildx, which would first seemingly create a build enviornment host using `linux/amd64` which then inside builds the deployment image. That is just layers upon layers of emulation and virtual machines. It might work but I'm a Docker novice and so it scares me a little.

The think that stumps me is that, there has got to be tons of Elixir devs using M1 Macs but deploying to `linux/amd64` targets. I'm surprised this is a more worked out issue. Maybe they are all just building in the cloud like I plan to. :shrug:


https://elixirforum.com/t/building-elixir-erlang-linux-amd64-application-image-on-apple-silicon/43913/9
https://elixirforum.com/t/arm64-otp-25-qemu-mix-local-hex-force-hangs/48664
https://elixirforum.com/search?q=qemu

https://community.fly.io/t/error-deploying-app-on-m1-pro-qemu-uncaught-target-signal-11-segmentation-fault-core-dumped/3575/2
https://community.fly.io/t/different-docker-hosts-why-and-why-am-i-getting-a-segmentation-fault-when-i-try-to-deploy/3049
https://community.fly.io/t/docker-weirdness-when-building-elixir-phoenix-project/1695/6
https://community.fly.io/t/error-deploying-app-on-m1-pro-qemu-uncaught-target-signal-11-segmentation-fault-core-dumped/3575
https://community.fly.io/search?q=qemu

https://github.com/iautom8things/test-arm64-qemu-issue

https://github.com/docker/for-mac/issues/6261
https://github.com/docker/for-mac/issues/6075
https://github.com/docker/for-mac/issues/5123#issuecomment-784992589

https://stackoverflow.com/questions/71294078/docker-emulating-an-image-trough-qemu-macos-with-m1
https://stackoverflow.com/questions/69189991/docker-running-linux-amd64-image-in-apple-m1-and-getting-qemu-uncaught-target


https://jitsu.com/blog/multi-platform-docker-builds



https://erica.works/docker-on-mac-m1/
