---
title: Middleman Automated GitHub Pages Deployments with Rake
date: 2015-02-09
tags: Middleman, Code, Ruby
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

Supposing you use GitHub pages to host your middleman site, like we do, you will probably want to speed up your deployments with some rakey goodness!

Stick the following `deploy.rake` file in your middleman root directory:

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
    system "git add -A"
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

Now just type `rake publish` And your changes will be live in a few moments. Easy a &pi;!


