---
title: Migrating from Wordpress to Middleman
date: 2014-04-04 10:09:32
tags: programming, symple, video, webrtc
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
Sourcey has been running on a Wordpress (2013-2014) for the better part of year now, but for me as a developer there has always been a nagging feeling that there is a better way. Static websites wre all the rage recently, especially for smaller sites, and with good reason! There's something satisfying about a static website; one less thing to break, and one less security vulnerability to worry about. Nice! Geeks love optimisation, and when it comes to websites you don't just any more optimised than (well written :P) static HTML. 
Anyway, whats the point of using a dynamic scripting language for serving blog atricles and documentation? 

The two main candidates for porting Sourcey to a static platform were [Jekyll](http://jekyllrb.com) and [Middleman](http://middlemanapp.com/). I have used both in the past, and both are built with Ruby (Jekyll has implementations in other languages too, such as this gruntjs plugin) but due to my love affair with Rails and Sinatra I went with Middleman because the similarities in architecture and it's flexible design and implementation.

## Installing Dependencies

Go ahead and install the following dependencies.

1. ruby
2. git
3. middleman ($ `gem install middleman`)
4. bower ($ `npm install -g bower`)

Now setup your Middleman application using [the official guide](http://middlemanapp.com/basics/getting-started/).

## Installing Zurb Foundation 5

For the CSS framework I went with Zurb Foundation 5. I'll admit this is the first time I have used Foundation, but since I have been using Bootstrap a lot recently I thought it might be nice to experiment with a new technology. Setting up Foundation to play nicely with Middleman is pretty straight forward, just follow the steps below:

Add the `bower.json` and `.bowerrc` files to your middleman folder.

##### bower.json

~~~ 
{
  "name": "your-app-name",
  "version": "0.0.1",
  "private": "true",
  "dependencies": {
    "foundation": "zurb/bower-foundation"
  }
}
~~~ 

##### .bowerrc

~~~ 
{
  "directory" : "source/bower_components"
}
~~~ 

Don't forget to add bower's directory to the sprockets asset path by adding the following to the end of your `config.rb` file:

~~~ 
...
after_configuration do
  @bower_config = JSON.parse(IO.read("#{root}/.bowerrc"))
  sprockets.append_path File.join "#{root}", @bower_config["directory"]
end

~~~ 

OK, we're ready to run $ `bower install` to install Foundation and friends.

Now go ahead and create the following files:

##### source/javascripts/modernizr.js

~~~ 
//= require modernizr/modernizr
~~~ 

##### source/javascripts/app.js

~~~ 
$(document).foundation();
~~~ 

##### source/javascripts/all.js

~~~ 
//= require jquery/dist/jquery
//= require foundation/js/foundation.min

//= require app
~~~ 

The next step is to setup our stylesheets.

At this point it's a good idea to copy `source/bower_components/foundation/scss/foundation/_settings.scss` to `source/stylesheets/_settings.scss` so any canges you make the won't be overwritten. Feel free to modify it as needed.

##### source/stylesheets/app.css.scss

~~~ 
@import "settings";
@import "foundation.scss";
~~~ 

Now to update our HTML layout file to work with Zurb and the changes we have made:

~~~ 
<!doctype html>
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= data.page.title || "The Middleman" %></title>
    
    <%= stylesheet_link_tag "app" %>
    <%= javascript_include_tag "modernizr" %>
  </head>
  
  <body class="<%= page_classes %>">
    <%= yield %>

    <%= javascript_include_tag  "all" %>
  </body>
</html>
~~~ 

## Migrating from Wordpress

Migrating from Wordpress to Middleman wasn't too painful with the help of the `wp2middleman` gem, which can be installed as follows:

~~~ 
git clone http://github.com/mdb/wp2middleman
cd wp2middleman
bundle install
rake install
~~~ 

If you havent exported your Wordpress posts yet do so now as per [the official guide](http://en.support.wordpress.com/export/). 

Now to export your Wordpress XML file just use the `wp2mm` command. 

~~~ 
wp2mm your_wordpress_export.xml
~~~ 

Be sure to check out the Github page for export configuration options: https://github.com/mdb/wp2middleman

## Deploying on Gitbub Pages

We chose to deploy our site on Github pages since it is free and easy. Initially I chose `middleman-deploy`, but all my pages started returning 404, so I checked out the alternative `middleman-gh-pages` which worked a treat after some Windows niggles which I posted a fix for https://github.com/neo/middleman-gh-pages/pull/21

Add this to your Gemfile:

~~~ 
gem "middleman-gh-pages"
~~~ 

You'll also need to require the gem in your Rakefile:
~~~ 
require 'middleman-gh-pages'
~~~ 

Now run `bundle install`

If you haven't already created your git Github repository, do that now and `git push` your changes.

The process for deploying your site with Middleman Github Pages as follows:

~~~ 
rake build    # Compile all static files into the build directory
rake publish  # Build and publish to Github Pages
~~~ 

Visit https://github.com/neo/middleman-gh-pages for a full list of configuration options.

## Static Bliss

I hope you found this post useful, and welcome to static bliss! If you have any questions or comments, just drop me a line...

