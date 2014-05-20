---
title: Precompile Assets Locally for Large Rails Capistrano Deployments
date: 2014-05-20
tags: capistrano, rails, rsync
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

# Precompile Assets Locally for Large Rails Capistrano Deployments

If you've ever had to deploy a large Rails site using Capistrano, 
then you're no doubt aware of how time consuming it is to precompile the assets pipeline on the server-side.

This is not really an issue for a small sites with a few images and JavaScripts, 
but when it starts taking upwards of half an hour to roll out a small time critical patch you know somethings gotta give!

Some people store compiled assets using `git` in either the master or a separate repository, but that's really overkill and a completely unnecessary step. The most efficient way is just to use Capistrano's `run_locally` command compile assets locally and then `rsync` them to the remote server.

The following Capistrano script is what we currently use on a Rails 3.2 site, but it should work with other Rails versions too.
Stick the following task somewhere in your `deploy.rb`:

~~~ ruby
namespace :deploy do
  namespace :assets do
   desc "Precompile assets locally and then rsync to deploy server"
    task :precompile, :only => { :primary => true } do
      run_locally "bundle exec rake assets:precompile"
      servers = find_servers :roles => [:app], :except => { :no_release => true }
      servers.each do |server|
        run_locally "rsync -av ./public/#{assets_prefix}/ #{user}@#{server}:#{current_path}/public/#{assets_prefix}/"
      end
      run_locally "rm -rf public/#{assets_prefix}"
    end
  end
end
~~~

If you're a Windows user you can obtain `rsync` binaries [here](http://www.rsync.net/resources/howto/windows_rsync.html). 
Just add the `cwRsync/bin` folder to your system path and everything will be peaches.
{: .panel .callout .radius}

To make sure assets are compiles we need to call `deploy:assets:precompile` after each deployment. 
The order in which the task is called is no so critical since Rails will be compiling assets from the local repository, 
but I do prefer to call it after everything else is complete just in case anything else fails so we won't have run a costly task for nothing.

A good time to run the task is after `deploy:finalize_update` like so:

~~~ ruby
after "deploy:finalize_update", "deploy:assets:precompile"
~~~