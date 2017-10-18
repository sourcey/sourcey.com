---
title: Precompiled WebRTC Libraries 
date: 2017-04-17
tags:
layout: page_full
---

<!-- 
<div class="sidebar-section toc">
#### Contents
{:.no_toc}

* ToC
{:toc}
</div>
-->
<!-- subtitle: Latest builds for Linux and Windows -->
<!-- ![WebRTC](logos/webrtc-250x250.png "WebRTC"){: .align-left} -->
<!-- ## Downloads -->

<div class="row">
<div class="columns medium-3 show-for-medium-up text-center">
  <img alt="WebRTC" title="WebRTC" class="no-style" src="/images/logos/webrtc-250x250.png" width="185">
</div>

<div class="columns medium-9">
Save yourself the tears and frustration — precompiled native WebRTC libraries and development headers are available for download here. Linux and Windows `Debug` and `Release` builds are provided for `x86` and `x64` architectures. <a href="#usage">Usage instructions are below</a>

<div id="webrtc-filters" class="row collapse">
<div class="columns small-4" style="padding-right: 0.9375rem">
<button data-dropdown="filter-platform" class="small secondary radius button dropdown expand no-margin" aria-expanded="false" aria-controls="filter-platform">Platform</button>
<ul id="filter-platform" data-dropdown-content class="f-dropdown" aria-hidden="true" tabindex="-1">
  <li><a href="#" data-filter="platform" data-value="linux">Linux</a></li>
  <li><a href="#" data-filter="platform" data-value="win">Windows</a></li>
</ul>
</div>
<div class="columns small-4">
<button data-dropdown="filter-arch" class="small secondary radius button dropdown expand no-margin" aria-expanded="false" aria-controls="filter-arch">Architecture</button>
<ul id="filter-arch" data-dropdown-content class="f-dropdown" aria-hidden="true" tabindex="-1">
  <li><a href="#" data-filter="arch" data-value="x64">x64</a></li>
  <li><a href="#" data-filter="arch" data-value="x86">x86</a></li>
</ul>
</div>
<div class="columns small-4" style="padding-left: 0.9375rem">
<button data-dropdown="filter-branch" class="small secondary radius button dropdown expand no-margin" aria-expanded="false" aria-controls="filter-version">Version</button>
<ul id="filter-branch" data-dropdown-content class="f-dropdown" aria-hidden="true" tabindex="-1">
  <!--   
  <li><a href="#" data-filter="branch" data-value="branch-heads/58">branch-heads/58</a></li>
  <li><a href="#" data-filter="branch" data-value="branch-heads/57">branch-heads/57</a></li> 
  -->
</ul>
</div>
</div>

</div>
</div>

<table id="webrtc-builds" width="100%">
  <thead>
    <tr>
      <th>File</th>
      <th>Platform</th>
      <th>Version</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>

<script>
var $root = $('#webrtc-builds tbody');

// $.getJSON("/webrtc-precompiled-builds/manifest.json", function(data) {
$.getJSON("https://raw.githubusercontent.com/sourcey/webrtc-precompiled-builds/master/manifest.json", function(data) {
  console.log('Loaded manifest', data)

  var builds = [];
  $.each(data, function(key, val) {
    $root.append(
      '<tr data-platform="' + val.target_os + '" data-arch="' + val.target_cpu + '" data-branch="' + val.branch + '">' +
        '<td>' + 
          '<a href="https://github.com/sourcey/webrtc-precompiled-builds/raw/master/' + val.file + '">' + val.file + '</a>' +
          '<small>CRC: ' + val.crc + '</small>' + 
        '</td>' +
        '<td>' + (val.target_os == 'linux' ? 'Linux' : 'Windows') + ' ' + val.target_cpu + '</td>' +
        '<td>' + 
          (val.latest ? '<span class="success round label right">Latest</span>' : ''
) + 
          val.date + 
          // '<small>SHA: ' + val.sha + '</small>' +
          '<small>Branch: ' + val.branch + '</small>' +
          '<small>Revision: ' + val.revision + '</small>' +
        '</td>' +
      '</tr>');

    if (builds.indexOf(val.branch) === -1)
        builds.push(val.branch);
  });

  for (var i = 0; i < builds.length; i++) { 
    $('#filter-branch').append(
      '<li><a href="#" data-filter="branch" data-value="' + builds[i] + '">' + builds[i] + '</a></li>');
  }
});

function updateVisibleEntries() {
  var filters = $('#webrtc-filters li.active').map(function() {
    var $a = $(this).find('a');
    return { name: $a.data('filter'), value: $a.data('value') };
  }).get();
  // console.log(filters)

  $root.find('tr').show();
  for (var i = 0; i < filters.length; i++) { 
    var filter = filters[i];
    console.log('tr[data-' + filter.name + '!="' + filter.value + '"]')
    $root.find('tr[data-' + filter.name + '!="' + filter.value + '"]').hide();
  }
}

$('#webrtc-filters').on('click', 'li a', function() {
  event.preventDefault();
  var $link = $(this)
    , $list = $link.parents('ul:first')
    , $button = $list.parent('div').find('button');
  $list.find('li').removeClass('active');
  $link.parents('li:first').addClass('active');
  $button.text($link.text());
  $(document).click();
  updateVisibleEntries();
})
</script>

<style>
/*#main .content img.align-left {
  max-width: 150px;
  margin-bottom: 20px;  
}*/

#webrtc-filters {
  margin-top: 25px;    
  padding-top: 0.9375rem;

  border-top: 1px solid #f0f0f2;
}
#webrtc-filters p {
  margin-bottom: 0.9375rem;  

}
#webrtc-filters .button {
  padding-left: 0.9375rem;
  text-align: left;
}

#webrtc-builds {
  margin-bottom: 35px;
}
#webrtc-builds a {
  font-weight: bold;
}
#webrtc-builds small {
  font-size: 80%;
  color: #888;
  display: block;
}
</style>

## About

After a number of requests we've started providing WebRTC builds to assist [LibSourcey](/libsourcey) developers. All the libraries and headers required for native WebRTC development on Windows and Linux are included in the builds, and although the builds are designed for LibSourcey developers, they are completely portable and can be used by all. 

The WebRTC repository is a monster weighing in at over **10gb** with a myriad of dependencies that no developer without a fat paycheck from Google should ever have to mess with. However, once the excess fat has been trimmed it's possible to get the archived build size down to about `50mb` including all static libraries and headers. Jenny Craig would be proud!


## Usage

Download the packages for your platform and architecture, extract them, and link them with your project - there's no need to compile anything or jump through any hoops. 

On Windows you will need [7-Zip](http://www.7-zip.org/download.html) to extract the archives, and on Linux the archives are in `.tar.gz` format. All static WebRTC libraries have meen merged into a single library for convenience (`libwebrtc_full.lib` on Windows and `libwebrtc_full.a` on Linux), so you just need to link this one library with your project to include all WebRTC components.

The folder structure is setup so you can extract both the `x64` and `x86` archives from the same build version into a single root directory:

~~~bash
webrtc-build/
├── third_party/      <-- webrtc dependency headers
├── webrtc/           <-- webrtc core headers
└── lib/
    ├── x64/
    │   ├── Debug     <-- x64 debug libraries
    │   ├── Release   <-- x64 release libraries
    ├── x86/
    │   ├── Debug     <-- x86 debug libraries
    │   ├── Release   <-- x86 release libraries
~~~


## Build details

Windows libraries are compiled with Visual Studio 2015 Update 3, while Linux builds are compiled with `gcc` on Ubuntu 16.10.

Debug builds have been created with all debug symbols enabled, and release builds have been optimized for for maximum performance. The exact `gn` build options used are as follows:

~~~bash
gn gen out/x86/Debug --args="is_debug=true rtc_include_tests=false target_cpu=\"x86\""
gn gen out/x86/Release --args="is_debug=false rtc_include_tests=false target_cpu=\"x86\" symbol_level=0 enable_nacl=false"
gn gen out/x64/Debug --args="is_debug=true rtc_include_tests=false target_cpu=\"x64\""
gn gen out/x64/Release --args="is_debug=false rtc_include_tests=false target_cpu=\"x64\" symbol_level=0 enable_nacl=false"
~~~