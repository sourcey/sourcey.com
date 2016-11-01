---
title: Generating Website Thumbnails in Rails 4 using Dragonfly and wkhtmltoimage
date: 2014-03-15 02:49:02
tags: Programming, Rails, Ruby, Thumbnails
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

I had a joyous time the other day trying to get a new rails app to take thumbnail snapshots of remote websites for [Gardn.net](http://gardn.net)... Actually I lied, it wasn't fun, in was a total pain in the ass - but you know how it is as a developer ;)

There are a few third-party services out there, Bluga.net, Websnapr and ShrinkTheWeb, but they all cost money - and why pay for it when we can build it for free?

I ended up using a combination of <a href="http://wkhtmltopdf.org" target="_blank">wkhtmltoimage</a> and <a href="https://github.com/markevans/dragonfly" target="_blank">Dragonfly</a> to make it work. Wkhtmltoimage is great because it does most of the work; it generates the image from the remote URL using a WebKit renderer, and stores the full size screenshot in a temporary location. Then the temp image file is assigned to the Dragonfly accessor, which processes it and creates our thumbnails on the fly. Carrierwave would be a good alternative to Dragonfly if you wanted to create the thumbnails right away, or defer processing to a background task.

As you can see in the example below, everything happens inside a validator during the `after_save` callback. This way if wkhtmltoimage throws an error we we can say to the user, "well what's up with this dodgey URL?". For maximum scalability you would defer processing to a background task, but the tradeoff is you would be unable to preform real-time validation.

Just drop the following code in your Rails model to make it work. Also make sure you have added Dragonfly to your `Gemfile`, and wkhtmltoimage is in your environment `PATH`.

~~~ ruby
class MySexyModel < ActiveRecord::Base

  ... rails stuff

  # Generate the thumbnail on validate so we can return errors on failure
  validate :generate_thumbnail_from_url

  # Cleanup temp files when we are done
  after_save :cleanup_temp_thumbnail
  
  # Generate a thumbnail from the remote URL
  def generate_thumbnail_from_url

    # Skip thumbnail generation if:
    # a) there are already other validation errors
    # b) an image was manually specified
    # c) an image is already stored and the URL hasn't changed
    skip_generate = self.errors.any? || (self.image_changed? ||
        (self.image_stored? && !self.url_changed?))
    # p "*** generating thumbnail: #{!skip_generate}"
    return if skip_generate

    # Generate and assign an image or set a validation error
    begin
      tempfile = temp_thumbnail_path
      cmd = "wkhtmltoimage --quality 95 \"#{self.url}\" \"#{tempfile}\""
      # p "*** grabbing thumbnail: #{cmd}"
      system(cmd) # sometimes returns false even if image was saved
      self.image = File.new(tempfile) # will throw if not saved
    rescue => e
      # p "*** thumbnail error: #{e}"
      self.errors.add(:base, "Cannot generate thumbnail. Is your URL valid?")
    ensure
    end
  end
  
  # Return the absolute path to the temporary thumbnail file
  def temp_thumbnail_path
    File.expand_path("#{self.url.parameterize.slice(0, 20)}.jpg", Dragonfly.app.datastore.root_path)
  end

  # Cleanup the temporary thumbnail image
  def cleanup_temp_thumbnail
    File.delete(temp_thumbnail_path) rescue 0
  end
end
~~~ 

Here's to keeping it simple! Hopefully this helped make your life more peachy...
<!--
As you can see it's pretty straight forward, and we didn't use any third party services whatsoever!
Don't forget to show your love if this post made your life more peachy.
-->
