---
title: Building and Installing WebRTC on Windows
date: 2017-09-01
tags: WebRTC
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

<div class="sidebar-section toc">
#### Contents
{:.no_toc}

* ToC
{:toc}
</div>

![WebRTC](logos/webrtc-250x250.png "WebRTC"){: .align-left}
Installing WebRTC has left many a good developer balder than at the outset, but hopefully this guide will see you through unscathed.

This guide is written specificaly for 64-bit Windows 10 to build WebRTC `branch-head/60`.

## Install Visual Studio
1.  Install Visual Studio 2015 Update 3 or later. The Community Edition should work if its license is appropriate for you. Use the Custom Install option and select:

    * Visual C++, which will select three sub-categories including MFC
    * Universal Windows Apps Development Tools > Tools
    * Universal Windows Apps Development Tools > Windows 10 SDK (10.0.10586)

## Install the Chromium depot tools

1. Download [depot_tools.zip](https://storage.googleapis.com/chrome-infra/depot_tools.zip) and decompress it.

2. Add depot_tools to the end of your PATH:

    * With Administrator access:
      * `Control Panel > System and Security > System > Advanced system settings`
      * Modify the PATH system variable to include depot_tools

    * Without Administrator access:
      * `Control Panel > User Accounts > User Accounts > Change my environment variables`
      * Add a PATH user variable: `%PATH%;C:\path\to\depot_tools`

3. Run `gclient` from the cmd shell. The first time it is run, it will install its own copy various tools.


## Download the source code

1.  Create a working directory, enter it, and run fetch WebRTC. This guide assumes a specific working folder structure. This operation starts from a base directory, eg., workspace and proceeds from there.

    ~~~bash
    mkdir webrtc-checkout
    cd webrtc-checkout
    fetch --nohooks webrtc
    ~~~

2.  Choose the stable release 60 rather than the most recent release by entering:

    ~~~bash
    cd src
    git branch -r
    git checkout branch-heads/60
    ~~~

3.  Download the code

    ~~~bash
    gclient sync
    ~~~

**Note:** _The download will take a while. Do not interrupt this step or you may need to start all over again (a new `gclient sync` may be enough, but you might also need wipe your `webrtc_checkout\src` folder and start over)._

## Update your checkout

To update an existing checkout, you can run:

~~~bash
git rebase-update
gclient sync
~~~

The first command updates the primary Chromium source repository and rebases any of your local branches on top of tip-of-tree (aka the Git branch `origin/master`). If you don't want to use this script, you can also just use git pull or other common Git commands to update the repo.

The second command syncs the subrepositories to the appropriate versions and re-runs the hooks as needed.

## Building WebRTC library

After you downloading the code, you can start the build from the `webrtc_checkout\src` folder.

The default configuration is for a 64-bit debug build:

~~~bash
gn gen out/x64/Debug --args="is_debug=true use_rtti=true target_cpu=\"x64\""
ninja -C out/x64/Debug boringssl field_trial_default protobuf_full p2p
~~~  

To create a 64-bit release build you must add `is_debug=true` to the GN args

~~~bash
gn gen out/x64/Release--args="is_debug=false use_rtti=true target_cpu=\"x64\""
ninja -C out/x64/Release boringssl field_trial_default protobuf_full p2p
~~~

For a fully optimized release build you can omit symbols and tests like by adding the following arguments `symbol_level=0 enable_nacl=false`.

---

These instructions are derived from following links:

* [https://webrtc.org/native-code/development/](https://webrtc.org/native-code/development/)
* [https://webrtc.org/native-code/development/prerequisite-sw/](https://webrtc.org/native-code/development/prerequisite-sw/)
* [http://dev.chromium.org/developers/how-tos/install-depot-tools](http://dev.chromium.org/developers/how-tos/install-depot-tools)
* [https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md](https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md)
* [https://chromium.googlesource.com/chromium/src/+/master/tools/gn/docs/quick_start.md](https://chromium.googlesource.com/chromium/src/+/master/tools/gn/docs/quick_start.md)
