---
title: Dynamically Rendering AJAX Pinterest Buttons
date: 2014-03-16 04:02:53
tags: api, javascript, pinterest, programming
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article 
---
# Dynamically Rendering AJAX Pinterest Buttons

<a href="http://www.pinterest.com/sourcey/" title="Sourcey on Pinterest" target="_blank">Pinterest</a> is a pretty hot topic in Social Marketing right now. Their APIs and documentation are still quite underdeveloped, so over the course of my next few posts I will offering some up Pinterest hacking tips for developers.

The first is how to render Pinterest buttons loaded dynamically using JavaScript. The Pinterest documentation is pretty scarce, so us developers are left to trawl through the source code for some of the answers - but they are there!

### Method one

The most common way to achieve this, although it's not my preferred way, is by using the "data-pin-build" attribute of the script tag to map the function for rendering dynamic buttons.

~~~ 
<script defer="defer" src="//assets.pinterest.com/js/pinit.js" data-pin-build="parsePins"></script>
~~~

Buttons can now be rendered as follows:

~~~ javascript  
// render buttons inside a scoped DOM element
window.parsePins(pbtn[0]);

// render the whole page
window.parsePins();
~~~ 

### Method two

An alternative method for people who like to hack in JavaScript, and don't much like including a shit tonne of script tags in the page header can use this script as a starting point (yes it uses JQuery, which can be easily substituted).

~~~ javascript
var Pinterest = {
    load: function(callback) {
        $.getScript('//assets.pinterest.com/js/pinit.js', callback)
    },

    // Get the Pinterest instance
    get: function() {
      for (var i in window) {
         if (i.indexOf('PIN_') == 0 && typeof window[i] == 'object') {
            return window[n]
         }
      }
    },

    // Render Pinterest buttons
    render: function(el) {
        this.get().f.render.buttonPin(el);
    }
}
~~~ 

The script can be used like so:

~~~ javascript
Pinterest.load(function(callback) {
    Pinterest.render($('button-element')[0]);
});
~~~ 

Happy Pinterest hacking!