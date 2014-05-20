---
title: Rails 4 OmniAuth using Devise with Twitter, Facebook and Linkedin
date: 2014-03-26 04:41:47
tags: oauth, programming, rails, ruby
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

# Rails 4 OmniAuth using Devise with Twitter, Facebook and Linkedin

There are quite a few OAuth solutions out there, but I want to share the one we use since it allows you to intelligently link multiple OAuth identities with a single user entity. If you use 90% of the code examples on the internet you will wind up with a new user entity each time the user signs in with a different OAuth provider, and a bunch of very confused users.

The OAuth provider that throws a spanner in the works and adds convolution to our code is Twitter. Twitter doesn't share their user's email address, so we need to add an extra step to get it from the user. Note that we do not ask Twitter users to "confirm" their email address, since they have already associated their Twitter account, and we don't want to be too much of a pain in the ass and remove all the joy from OAuth altogether.

Thanks to everyone who submitted comments and changes! For a list of code changes [see here](#changes).

So, without further ado, here is the code:

#### Gemfile

~~~ ruby
gem 'devise'
gem 'omniauth'
gem 'omniauth-twitter'
gem 'omniauth-facebook'
gem 'omniauth-linkedin'
~~~ 

#### Generate migrations and models

~~~ ruby
rails generate devise:install
rails generate devise user
rails g migration add_name_to_users name:string
rails g model identity user:references provider:string uid:string

# Modify the db/migrate/[timestamp]_add_devise_to_users.rb to configure the Devise modules you will use.
# We usually enable the "confirmable" module when enabling email signups.
~~~ 

#### app/models/identity.rb

~~~ ruby
class Identity < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :uid, :provider
  validates_uniqueness_of :uid, :scope => :provider

  def self.find_for_oauth(auth)
    identity = find_by(provider: auth.provider, uid: auth.uid)
    identity = create(uid: auth.uid, provider: auth.provider) if identity.nil?
    identity
  end
end
~~~ 

#### app/config/initializers/devise.rb

~~~ ruby
Devise.setup do |config|
...
  config.omniauth :facebook, "KEY", "SECRET"
  config.omniauth :twitter, "KEY", "SECRET"
  config.omniauth :linked_in, "KEY", "SECRET"
...
end
~~~ 

#### config/environments/[environment].rb

~~~ ruby
...
  # Email
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.perform_deliveries = true
  config.action_mailer.default_url_options = { :host => config.app_domain }
  config.action_mailer.smtp_settings = {
    address: 'smtp.gmail.com', 
    port: '587',
    enable_starttls_auto: true,
    user_name: '',
    password: '',
    authentication => :plain,
    domain => 'somedomain.com'
  }
...
~~~ 

#### app/controllers/omniauth_callbacks_controller.rb

~~~ ruby
class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def self.provides_callback_for(provider)
    class_eval %Q{
      def #{provider}
        @user = User.find_for_oauth(env["omniauth.auth"], current_user)

        if @user.persisted?
          sign_in_and_redirect @user, event: :authentication
          set_flash_message(:notice, :success, kind: #{provider}.capitalize) if is_navigational_format?
        else
          session["devise.#{provider}_data"] = env["omniauth.auth"]
          redirect_to new_user_registration_url
        end
      end
    }
  end

  [:twitter, :facebook, :linked_in].each do |provider|
    provides_callback_for provider
  end
end
~~~ 

#### config/routes.rb

~~~ ruby
...
  devise_for :users, :controllers => { omniauth_callbacks: 'omniauth_callbacks' }
...
~~~ 

#### app/models/user.rb

~~~ ruby
class User < ActiveRecord::Base
  TEMP_EMAIL = 'change@me.com'
  TEMP_EMAIL_REGEX = /change@me.com/

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable
  devise :database_authenticatable, :registerable, :confirmable,
    :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  validates_format_of :email, :without => TEMP_EMAIL_REGEX, on: :update

  def self.find_for_oauth(auth, signed_in_resource = nil)

    # Get the identity and user if they exist
    identity = Identity.find_for_oauth(auth)
    user = identity.user ? identity.user : signed_in_resource

    # Create the user if needed
    if user.nil?

      # Get the existing user by email if the OAuth provider gives us a verified email
      # If the email has not been verified yet we will force the user to validate it
      email = auth.info.email if auth.info.email && auth.info.verified_email
      user = User.where(:email => email).first if email

      # Create the user if it is a new registration
      if user.nil?
        user = User.new(
          name: auth.extra.raw_info.name,
          #username: auth.info.nickname || auth.uid,
          email: email ? email : TEMP_EMAIL,
          password: Devise.friendly_token[0,20]
        )
        user.skip_confirmation!
        user.save!
      end
    end

    # Associate the identity with the user if needed
    if identity.user != user
      identity.user = user
      identity.save!
    end
    user
  end
end
~~~ 

The next steps are optional to get an email address from Twitter users.

#### config/routes.rb

~~~ ruby
...
  get '/users/:id/add_email' => 'users#add_email', via: [:get, :patch, :post], :as => :add_user_email
...
~~~ 

#### app/controllers/application_controller.rb

~~~ ruby
  # This filter could go anywhere the user needs to have a valid email address to access
  before_filter :ensure_valid_email

  def ensure_valid_email
    # Ensure we don't go into an infinite loop
    return if action_name == 'add_email'

    # If the email address was the temporarily assigned one, 
    # redirect the user to the 'add_email' page
    if current_user && (!current_user.email || current_user.email == User::TEMP_EMAIL)
      redirect_to add_user_email_path(current_user)
    end
  end  
~~~ 

#### app/controllers/users_controller.rb

~~~ ruby
class UsersController < ApplicationController
  before_action :set_user, :add_email
  ...
  def add_email
    if params[:user] && params[:user][:email]
      current_user.email = params[:user][:email]

      # Note: When using the Devise confirmable module I choose to skip email validation
      # here if the user has signed up with Twitter.
      # Just remove the following line if you want the user to confirm their email address. 
      current_user.skip_reconfirmation!

      if current_user.save
          redirect_to current_user, notice: 'Your email address was successfully updated.'
      else
          @show_errors = true
      end
    end
  end
  
  private
    def set_user
      @user = User.find(params[:id])
    end
end
~~~ 

#### app/views/users/add_user.html.rb

Note that the following template uses Bootstrap markup.

~~~ html
<div id="add-email" class="container">
  <%= form_for(@user, :as => 'user', :url => add_user_email_path(@user), :html => { role: 'form'}) do |f| %>
    <% if @show_errors && @user.errors.any? %>
      <div id="error_explanation">
        <% @user.errors.full_messages.each do |msg| %>
          <%= msg %><br>
        <% end %>
      </div>
    <% end %>
    <div class="form-group">
      <%= f.label :email %>
      <div class="controls">
        <%= f.text_field :email, :autofocus => true, :value => '', class: 'form-control input-lg', placeholder: 'Example: email@me.com' %>
        <p class="help-block">Please confirm your email address. No spam.</p>
      </div>
    </div>
    <div class="actions">
      <%= f.submit 'Continue', :class => 'btn btn-primary' %>
    </div>
  <% end %>
</div>
~~~ 

Well that's pretty much it! If I left anything out please give me a shout and I'll update the article, cheers!

## Changes

* Added `UsersController.set_user` method for clarity
* Removed duplicate controller methods from `OmniauthCallbacksController`
* Only accept verified email addresses from the provider via 'User.find_for_oauth'
* Removed redundant `gem "omniauth"` from `Gemfile`
* Updated `User.find_for_oauth` to better handle `signed_in_resource`. Thanks [@mtuckerb](https://github.com/mtuckerb)
