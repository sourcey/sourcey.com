---
title: Building the Perfect Rails 5 API Only App
date: 2015-12-26
tags: Rails, API
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

This how-to guide aims to help you get started the right way using Rails 5 to build the perfect API.
Thanks to the new `rails-api` gem that ships as part of the Rails 5 core, Rails is now an ideal candidate for building streamlined APIs quickly and easily.

Until now, arguably the best option for creating APIs in Ruby has been Grape, and while Grape is still a brilliant option (especially if you like to DIY), there are some great advantages to using Rails 5 in API mode, such as; ActiveRecord by default, a strong developer community, and having the asset pipeline and front end features available should you need them as your project evolves.  

## Installing Rails 5

First, make sure you are running Ruby 2.2.2+ or newer as it's required by Rails 5, then go ahead an install the Rails gem:

~~~bash
gem install rails

# version should be >= Rails 5.0.0
rails --version
~~~

According to the official [Rails guide](http://edgeguides.rubyonrails.org/api_app.html) all we need to do to create an API only Rails app is to pass the `--api` option at the command line when creating a new Rails app, like so:

~~~bash
rails new api_app_name --api
~~~

The next thing is to run `bundle` and `rake` inside our app directory to install the default gems and setup the database:

~~~bash
cd  <parent-folder-path>/api_app_name
bundle install
bin/rake db:setup
~~~

Now we have a shiny new API only Rails app without any of the incumbent front end bloat, and all of the inherent Railsy goodness. Nice!

## Using RSpec for Testing

Before going any further let's setup [RSpec](http://rspec.info) for spec testing our application. The reason why it's good to setup RSpec first is that we can save a bit of time using the built-in RSpec generators to auto generate default model and controller specs for us each time we use `rails generate scaffold` to generate resources later on. To install RSpec, go ahead and add the [rspec-rails](https://github.com/rspec/rspec-rails) gem to your Gemfile in the `:development, :test` group:

~~~ruby
group :development, :test do

  # Use RSpec for specs
  gem 'rspec-rails', '>= 3.5.0'

  # Use Factory Girl for generating random test data
  gem 'factory_girl_rails'
end
~~~

Update your bundle:

~~~bash
bundle
~~~

Run the RSpec installer:

~~~bash
bin/rails g rspec:install  
~~~

Finally, you can get rid of the `test` directory in Rails, since we won't be writing unit tests, but writing specifications instead.

## Bulding Your API

Lets start building out our API controllers.

When an app is created with the `--api` flag you can use the default scaffold generators to generate your API resources as normal, without the need for any special arguments.

~~~bash
bin/rails g scaffold user name email
~~~

This will generate the following file structure:

~~~bash
      invoke  active_record
   identical    db/migrate/20151222022044_create_users.rb
   identical    app/models/user.rb
      invoke    rspec
      create      spec/models/user_spec.rb
      invoke      factory_girl
      create        spec/factories/users.rb
      invoke  resource_route
       route    resources :users
      invoke  scaffold_controller
   identical    app/controllers/users_controller.rb
      invoke    rspec
      create      spec/controllers/users_controller_spec.rb
      create      spec/routing/users_routing_spec.rb
      invoke      rspec
      create        spec/requests/users_spec.rb

~~~

Note that no views are created since we are running in API mode.

Go ahead and repeat the process with as many resources as you like, and once you're done you can migrate and run the app:

~~~bash
bin/rake db:migrate

# run the default server on port 3000
bin/rails s
~~~

Your new API is now up and running on [http://localhost:3000](http://localhost:3000). Sweet!

You're not done yet though, there are still a bunch of important points for consideration...

## Serializing API Output

In it's current state our app will just spit out a JSON representation of every column in the database so we need a way to control what data gets served through the API.

Normally we would use a front end templating engine such as `jbuilder` for this purpose,
but since we're not using views in our super streamlined API app, that's not going to be an option.

Fortunately AMS (Active Model Serializers) is here to save the day. AMS provides a clean layer between the model and the controller that lets us to call `to_json` or `as_json` on the `ActiveRecord` object or collection as normal, while outputing our desired API format.

Go ahead and add the `active_model_serializers` gem to your Gemfile:

~~~ruby
gem 'active_model_serializers'
~~~

Update your bundle:

~~~bash
bundle
~~~

Now lets create a default serializer for our User model:

~~~bash
rails g serializer user
~~~

In `app/serializers/user_serializer.rb`, we find this code:

~~~ruby
class UserSerializer < ActiveModel::Serializer
  attributes :id
end
~~~

Note that only the `:id` attribute is added by default. That's not going to be much use to us, so
go ahead and add the `:name` and `:email` attributes to the serializer:

~~~ruby
class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email
end
~~~

If your model has relationships just declare them on the serializer as you would any other attributes to be serialized in the output.
{: .panel .callout .radius}

You may also need to include the `ActionController::Serialization` dependency in your controller like so:

~~~ruby
class ApplicationController < ActionController::API
  include ActionController::Serialization

  # ...
end
~~~

Now when you hit and User related API endpoint only the attributes in the `UserSerializer` will be rendered. Nice!

Check the [active_model_serializers](https://github.com/rails-api/active_model_serializers) gem homepage for more detailed configuration options.

## Enabling CORS

If you're building a public API you'll probably want to enable Cross-Origin Resource Sharing (CORS), in order to make cross-origin AJAX requests possible.

This is made very simple by the `rack-cors` gem. Just stick it in your Gemfile like so:

~~~ruby
gem 'rack-cors'
~~~

Update your bundle:

~~~bash
bundle
~~~

And put something like the code below in `config/application.rb` of your Rails application. For example, this will allow GET, POST or OPTIONS requests from any origin on any resource.

~~~ruby
module YourApp
  class Application < Rails::Application

    # ...

    config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins '*'
        resource '*', :headers => :any, :methods => [:get, :post, :options]
      end
    end

  end
end
~~~

For more detailed configuration options please see the gem documentation: https://github.com/cyu/rack-cors

## Versioning Your API

Before releasing your public API into the wild, you should consider implementing some form of versioning.
Versioning breaks your API up into multiple version namespaces, such as `v1` and `v2`,
so that you can maintain backwards compatibility for existing clients whenever you introduce breaking changes into your API, simply by incrementing your API version.

This guide will show you how to setup versioning with the following URL format:

~~~
GET http://api.mysite.com/v1/users/
~~~

Using a subdomain instead of something like `/api/v1/users/` is just a preference, although both are easy to accomplish in Rails.

We can use a directory structure like this to keep our controller code clean by defining all our `v1` controllers within the `Api::V1` namespace:

~~~
app/controllers/
.
|-- api
|   `-- v1
|       |-- api_controller.rb
|       `-- users_controller.rb
|-- application_controller.rb
~~~

Here's what the controllers look like:

~~~ruby
# app/controllers/api/v1/api_controller.rb

module Api::V1
  class ApiController < ApplicationController
    # Generic API stuff here
  end
end
~~~

~~~ruby
# app/controllers/api/v1/users_controller.rb

module Api::V1
  class UsersController < ApiController

    # GET /v1/users
    def index
      render json: User.all
    end

  end
end
~~~

Now let's setup our `config/routes.rb` to tie everything together:

~~~ruby
constraints subdomain: 'api' do
  scope module: 'api' do
    namespace :v1 do
      resources :users
    end
  end
end
~~~

The `scope module: 'api'` bit lets us route to controllers in the API module without explicitly including it in the URL. However, the version `v1/` is part of the URL, and we also want to route to the V1 module, so we use `namespace`.

Now you're API routes are looking pretty sharp!

## Rate Limiting and Throttling

To protect our API from DDoS, brute force attacks, hammering, or even to monetize with paid usage limits, we can use a Rake [middleware](http://guides.rubyonrails.org/rails_on_rack.html) called `Rack::Attack`. The [rack-attack](https://github.com/kickstarter/rack-attack) gem was released by Kickstarter, and it allows us to:

* **whitelist**: Allowing it to process normally if certain conditions are true
* **blacklist**: Sending a denied message instantly for certain requests
* **throttle**: Checking if the user is within their allowed usage
* **track**: Tracking this request to be able to log certain information about our requests

Get started by adding the dependency to your Gemfile:

~~~ruby
gem 'rack-attack'
~~~

Update your bundle:

~~~bash
bundle
~~~

Now update your `config/application.rb` file to include it into your middleware stack:

~~~ruby
module YourApp
  class Application < Rails::Application

    # ...

    config.middleware.use Rack::Attack

  end
end
~~~

Create a new initializer file in `config/initializers/rack_attack.rb` to configure your `Rack::Attack` rules. The example below is very basic, and it should give a good starting point although you may have different requirements altogether.

~~~ruby
class Rack::Attack

  # `Rack::Attack` is configured to use the `Rails.cache` value by default,
  # but you can override that by setting the `Rack::Attack.cache.store` value
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  # Allow all local traffic
  whitelist('allow-localhost') do |req|
    '127.0.0.1' == req.ip || '::1' == req.ip
  end

  # Allow an IP address to make 5 requests every 5 seconds
  throttle('req/ip', limit: 5, period: 5) do |req|
    req.ip
  end

  # Send the following response to throttled clients
  self.throttled_response = ->(env) {
    retry_after = (env['rack.attack.match_data'] || {})[:period]
    [
      429,
      {'Content-Type' => 'application/json', 'Retry-After' => retry_after.to_s},
      [{error: "Throttle limit reached. Retry later."}.to_json]
    ]
  }
end
~~~

For a full list of configuration options check the [Rack::Attack](https://github.com/kickstarter/rack-attack) gem homepage.

Now that your API is safe from brute force attacks and bad client code you can sleep a little better at night!

## Authenticating Your API

Let's lock our API down with some authentication.

As a rule API's should be stateless, and therefore should not have any knowledge of cookies or sessions.

If you require sessions then you should be looking at implementing some form of [OAuth](http://oauth.net/2) based authentication, but that won't be covered in this guide.
{: .panel .callout .radius}

A good way of authenticating API requests is using HTTP token based authentication, which involves clients including a API key of some sort in the HTTP `Authorization` header of each request, like so:

~~~
Authorization: Token token="WCZZYjnOQFUYfJIN2ShH1iD24UHo58A6TI"
~~~

First let's update create a migration to add the `api_key` attribute to our `User` model:

~~~ruby
rails g migration AddApiKeyToUsers api_key:string
~~~

Now update the `User` model to include the following methods:

~~~ruby
class User < ActiveRecord::Base

  # Assign an API key on create
  before_create do |user|
    user.api_key = user.generate_api_key
  end

  # Generate a unique API key
  def generate_api_key
    loop do
      token = SecureRandom.base64.tr('+/=', 'Qrt')
      break token unless User.exists?(api_key: token)
    end
  end
end
~~~

On the controller side we can implement the authentication using the built in `authenticate_or_request_with_http_token` Rails method.

~~~ruby
class ApplicationController < ActionController::Base
  include ActionController::HttpAuthentication::Token::ControllerMethods

  # Add a before_action to authenticate all requests.
  # Move this to subclassed controllers if you only
  # want to authenticate certain methods.
  before_action :authenticate

  protected

  # Authenticate the user with token based authentication
  def authenticate
    authenticate_token || render_unauthorized
  end

  def authenticate_token
    authenticate_with_http_token do |token, options|
      @current_user = User.find_by(api_key: token)
    end
  end

  def render_unauthorized(realm = "Application")
    self.headers["WWW-Authenticate"] = %(Token realm="#{realm.gsub(/"/, "")}")
    render json: 'Bad credentials', status: :unauthorized
  end
end
~~~

Now we can test our authenticated API using `curl`:

~~~bash
curl -H "Authorization: Token token=PsmmvKBqQDOaWwEsPpOCYMsy" http://localhost:3000/users
~~~

## Conclusion
{:.no_toc}

Now you have the keys to the castle, and all the basics for building an API the Rails way.

Hopefully then guide was helpful for you, and if you want any points clarified or just want to say thanks then feel free to use the comments below.

Cheers, and happy coding!
