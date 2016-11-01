---
title: Migrating from Wordpress to Middleman
date: 2014-04-04 10:09:32
tags: Programming, Middleman
author: Kam Low
author_site: https://plus.google.com/+KamLow
image: logos/middleman-770x258.png
layout: article
---

<div class="sidebar-section toc">
#### Contents
{:.no_toc}

* ToC
{:toc}
</div>

![Middleman](logos/middleman-770x258.png "Middleman")

Today I decided to take the plunge and convert Sourcey into a static website. Sourcey has been running on Wordpress for the better part of year now, and while Wordpress was the duck's nuts way back then, today's static website generators just have so much to offer.

Static websites are all the rage, and with good reason too. Unless your blog is huge, or you have the need for managed administration (wp dkz ntz), there is really no need for dynamic scripting languages, right? There's something satisfying and geekishly appealing about a static website; one less thing to break, and one less security vulnerability to worry about. Geeks love optimising stuff, and when it comes to building websites, you just don't get any more optimised than static HTML. 

The two main candidates for porting Sourcey to a static platform were [Jekyll](http://jekyllrb.com) and [Middleman](http://middlemanapp.com/). I have used both in the past, and both are built with Ruby (Jekyll has implementations in other languages too, such as a the `grunt-jekyll` plugin), but due to my love affair with Rails and Sinatra I went with Middleman because of the similarities with Rails architecture, and it's superior flexibility.

All in all it took around 10 hours work (including the learning curve), and I'm super glad I did it for a whole bunch of reasons. If you're interested in setting up or converting to a static website then keep on reading because I will be sharing some of the key points...

## Installing Dependencies

Go ahead and install the following dependencies:

1. ruby
2. git
3. middleman ($ `gem install middleman`)
4. bower ($ `npm install -g bower`)

If you haven't already, go and setup your Middleman application using [the official guide](http://middlemanapp.com/basics/getting-started/).

## Installing Zurb Foundation 5

For the CSS framework I went with minimal installation of [Zurb Foundation 5](http://foundation.zurb.com). This is the first time I have used Foundation, and be honest a CSS framework is probably overkill, but the responsive elements and grids have proven very handy already. Anyway, since I've been using Bootstrap quite a bit lately I thought it might be nice to experiment with a new technology. 

Setting up Foundation to play nicely with Middleman is pretty straight forward, just follow the steps below. First add the below `bower.json` and `.bowerrc` files to your middleman folder.

##### bower.json

~~~ javascript
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

~~~ javascript
{
  "directory" : "source/bower_components"
}
~~~ 

Don't forget to expose bower's directory to the sprockets asset path by adding the following somewhere in your `config.rb` file:

~~~ ruby
after_configuration do
  @bower_config = JSON.parse(IO.read("#{root}/.bowerrc"))
  sprockets.append_path File.join "#{root}", @bower_config["directory"]
end
~~~ 

OK, now run $ `bower install` to install Foundation and friends.

Foundation requires Modernizr and JQuery by default.
Now go ahead and create the following files:

##### source/javascripts/modernizr.js

~~~ 
//= require modernizr/modernizr
~~~ 

##### source/javascripts/app.js

~~~ javascript
$(document).foundation();
~~~ 

##### source/javascripts/all.js

~~~ 
//= require jquery/dist/jquery
//= require foundation/js/foundation.min

//= require app
~~~ 

The next step is to setup our stylesheets.

At this point it's a good idea to copy `source/bower_components/foundation/scss/foundation/_settings.scss` to `source/stylesheets/_settings.scss` so any changes you make the won't be overwritten. Feel free to modify it as needed.

##### source/stylesheets/app.css.scss

~~~ css
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

If you haven't exported your Wordpress posts yet do so now as per [the official guide](http://en.support.wordpress.com/export/). 

Now to export your Wordpress XML file just use the `wp2mm` command. 

~~~ 
wp2mm your_wordpress_export.xml
~~~ 

Be sure to check out the Github page for export configuration options: https://github.com/mdb/wp2middleman

## Deploying on Gitbub Pages

The beauty of static hosting is its so easy, just whack it on a server and away you go! I love not having to worry about process monitoring and the like. Even better if someone else hosts the content right? Github pages is great for this since it's free and easy. 

If you haven't already created your git Github repository, do that now. If you're using User Pages the repository must be named like so: _username.github.io_. 

I actually created two separate repositories; one for hosting the Middleman source site, and one for hosting the static Github pages. Most people just use a single repository with two branches, so why do I do it this way you ask? Mainly because I don't want my project repository to be reliant on the Github Pages work flow, <strike>just in case</strike> when I need to switch for whatever reason down the track.

Both repositories are on github, so go ahead and use them as a reference:

* [https://github.com/sourcey/sourcey.com](https://github.com/sourcey/sourcey.com)
* [https://github.com/sourcey/sourcey.github.io](https://github.com/sourcey/sourcey.github.io)

To automate deployment I initially went with the `middleman-deploy` gem since it seemed like the popular choice. For some reason it screwed up my site completely, and all my pages started returning 404. Since I wasn't in any mood for more debugging I decided to check the alternative `middleman-gh-pages` gem, which as it turned out I also had problems of its own. This time I decided to get my hands dirty to fix some small issues, and ended up submitting [neo/middleman-gh-pages#21](https://github.com/neo/middleman-gh-pages/pull/21).

As it turned out I ended up ditching both gems, mainly because at the end of the day `middleman-gh-pages` is designed for Github Project Pages, not User Pages. Incase you don't already know, GitHub offers two types of [Pages](https://help.github.com/articles/user-organization-and-project-pages); User Pages, and Project Pages. Each GitHub account can host a single User Page and an unlimited amount of Project Pages. Basically they are identical to the end-user and differ only in their configuration and the way it's accessed. User Pages are accessed via _username.github.io_ and exist in the `master` branch, and Project Pages are accessed via _username.github.io/projectname_ and exist in the `gh-pages` branch or the project repo.

All I really need is a simple Rake task to automate building the static files locally, and deploying them to Github, so that's exactly what I went with. If you want to use my solution, then just add these two files to your application:

##### Rakefile

~~~ ruby
import 'deploy.rake'
~~~ 

##### deploy.rake

~~~ ruby
desc "build static pages"
task :build do
  p "## Compiling static pages"
  system "bundle exec middleman build"
end

desc "deploy to github pages"
task :deploy do
  p "## Deploying to Github Pages"
  cp_r ".nojekyll", "build/.nojekyll"
  cd "build" do
    system "git add ."
    system "git add -u"
    message = "Site updated at #{Time.now.utc}"
    p "## Commiting: #{message}"
    system "git commit -m \"#{message}\""
    p "## Pushing generated website"
    system "git push origin master"
    p "## Github Pages deploy complete"
  end
end

desc "build and deploy to github pages"
task :publish do
  Rake::Task["build"].invoke
  Rake::Task["deploy"].invoke
end
~~~ 

Now you can use the following commands to update your Github Pages:

~~~ ruby
rake build    # Compile all static files into the build directory
rake deploy   # Deploy the build directory to Github Pages
rake publish  # Build and deploy in one command
~~~ 

To configure Github pages to point to your custom domain ie ``example.com``, follow the steps outlined in [this guide](https://help.github.com/articles/setting-up-a-custom-domain-with-pages) to add a ``CNAME`` file to your repository and setup DNS.


## Static Website Bliss

Hopefully there are some crazy web developers out there will find this post useful, and if you're like me and derive pleasure from the zen of simplification, then welcome to static website bliss! A big thanks to the wonderful devs behind the Middleman project, and if you have any questions or comments then just drop me a line ;)