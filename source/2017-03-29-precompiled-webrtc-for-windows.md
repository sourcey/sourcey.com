---
title: Pre-compiled WebRTC Libraries for Windows
date: 2017-03-29
tags:
layout: page
---

<!-- <div class="sidebar-section toc">
#### Contents
{:.no_toc}

* ToC
{:toc}
</div> -->

![WebRTC](logos/webrtc-250x250.png "WebRTC"){: .align-left}
After a number of requests from frustrated developers we've started providing precompiled WebRTC native libraries and headers for Windows. There's no need to compile anything or jump through any hoops, just download the packages and extract them to get started.

Weighing in at over **6gb**, the WebRTC repository is an absolute monster with a myriad of dependencies that no developer without a fat paycheck from Google should have to mess with. However, once the fat was trimmed we managed to get the archived file size down to about **2.3mb** for all required dev headers, and **72.3mb** for pre-compiled Debug and Release libraries.

These libraries are provided for use with [LibSourcey](/libsourcey), but can be used by anyone. Builds are not nightly just yet, but we will update the build for every major release and important bugfix.


## Downloads

Libraries have been compiled with Visual Studio 2015 Update 2 on Windows 10, with both `Debug` and `Release` versions provided for `x86` and `x64` architectures. You will need [7-Zip](http://www.7-zip.org/download.html) to extract the archives.


#### master (0e22a4cfd) — Feb 23 07:11:32 2017

<table width="100%">
  <tr>
    <th>File</th>
    <!-- <th>Type</th> -->
<!--     <th>Version</th>  — Feb 23 07:11:32 2017-->
    <th>Size</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="https://github.com/sourcey/webrtc-windows-builds/raw/master/webrtc-master-0e22a4cfd-headers.7z">webrtc-master-0e22a4cfd-headers.7z</a></td>
    <!-- <td>7-Zip `lzma2`</td> -->
<!--     <td>master (0e22a4cfd)</td> -->
    <td>2.3mb</td>
    <td>Development headers</td>
  </tr>
  <tr>
    <td><a href="https://github.com/sourcey/webrtc-windows-builds/raw/master/webrtc-master-0e22a4cfd-vs2015-x64.7z">webrtc-master-0e22a4cfd-vs2015-x64.7z</a></td>
    <!-- <td>7-Zip `lzma2`</td> -->
<!--     <td>master (0e22a4cfd)</td> -->
    <td>72.3mb</td>
    <td>Windows 64-bit (x64) Debug and Release libraries</td>
  </tr>
  <tr>
    <td><a href="https://github.com/sourcey/webrtc-windows-builds/raw/master/webrtc-master-0e22a4cfd-vs2015-x86.7z">webrtc-master-0e22a4cfd-vs2015-x86.7z</a></td>
    <!-- <td>7-Zip `lzma2`</td> -->
<!--     <td>master (0e22a4cfd)</td> -->
    <td>57.9mb</td>
    <td>Windows 32-bit (x86) Debug and Release libraries</td>
  </tr>
</table>


## Compile options

Debug builds have been created with all debug symbols enabled, and release builds have been optimized for for maximum performance. The exact build options used are as follows:

~~~bash
gn gen out/x86/Debug --args="is_debug=true rtc_include_tests=false target_cpu=\"x86\""
gn gen out/x86/Release --args="is_debug=false rtc_include_tests=false target_cpu=\"x86\" is_component_build=true symbol_level=0 enable_nacl=false"
gn gen out/x64/Debug --args="is_debug=true rtc_include_tests=false target_cpu=\"x64\""
gn gen out/x64/Release --args="is_debug=false rtc_include_tests=false target_cpu=\"x64\" is_component_build=true symbol_level=0 enable_nacl=false"
~~~