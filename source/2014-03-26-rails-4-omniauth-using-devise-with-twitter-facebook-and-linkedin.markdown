---
title: Rails 4 OmniAuth using Devise with Twitter, Facebook and Linkedin
date: 2014-03-26 04:41:47
tags: OAuth, Programming, Ruby, Rails
author: Kam Low
author_site: https://plus.google.com/+KamLow
image: logos/omniauth-522x159.png
layout: article
---

<div class="sidebar-section toc">
#### Contents
{:.no_toc}

* ToC
{:toc}
</div>

![OmniAuth](logos/omniauth-158x182.png "OmniAuth"){: .align-left}
There are quite a few OAuth solutions out there, but I want to share the one we use since it allows you to intelligently link multiple OAuth identities with a single user entity. If you use 90% of the code examples on the Internet you will wind up with a new user entity each time the user signs in with a different OAuth provider, and a bunch of very confused users.

The OAuth provider that throws a spanner in the works and adds convolution to our code is Twitter. Unlike other providers, Twitter doesn't share their user's email address, so we need to add an extra step to get it from the user. More info on that [here](#completing-the-signup-process).
<!--  Note that we don't ask Twitter users to "confirm" their email address since they have already associated their Twitter account, and we don't want to be too much of a pain in the ass and remove all the joy from OAuth altogether. 
if a user registers with  in -->

Thanks to everyone who submitted comments and changes! For a list of code changes [see here](#changes).

## Basic Implementation

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
    user_name: 'someuser',
    password: 'somepass',
    authentication => :plain,
    domain => 'somedomain.com'
  }
...
~~~ 

#### config/routes.rb

~~~ ruby
...
  devise_for :users, :controllers => { omniauth_callbacks: 'omniauth_callbacks' }
...
~~~ 

#### app/controllers/omniauth_callbacks_controller.rb

It's worth mentioning that the only safe criteria for matching user entities with OAuth providers is a verified email address, but this will lead to the creation of multiple accounts if the user has different email addresses associated with different OAuth providers. Let's say, for example, the user registers with Facebook, and then later tries to signin with a LinkedIn account that has a different email address associated, the system can only create a new account because there's no way to match the existing user entity with the LinkedIn account.

<!--
also causes issues 
user entities can only matched by a verified email address, so lets say for example, 
, a new account will be created for because there was no way to match the Google account with the existing user entity.
-->

Therefore, to link accounts with multiple providers the `current_user` session must be already set when the OAuth callback returns, and passed to `User.find_for_oauth`. This might sound complicated, but all thats required to link a different provider, Facebook for example, is to `redirect_to user_omniauth_authorize_path(:facebook)` while the user is already logged in.

~~~ ruby
class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def self.provides_callback_for(provider)
    class_eval %Q{
      def #{provider}
        @user = User.find_for_oauth(env["omniauth.auth"], current_user)

        if @user.persisted?
          sign_in_and_redirect @user, event: :authentication
          set_flash_message(:notice, :success, kind: "#{provider}".capitalize) if is_navigational_format?
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

  def after_sign_in_path_for(resource)
    if resource.email_verified?
      super resource
    else
      finish_signup_path(resource)
    end
  end
end
~~~ 

#### app/models/user.rb

~~~ ruby
class User < ActiveRecord::Base
  TEMP_EMAIL_PREFIX = 'change@me'
  TEMP_EMAIL_REGEX = /\Achange@me/

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable
  devise :database_authenticatable, :registerable, :confirmable,
    :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  validates_format_of :email, :without => TEMP_EMAIL_REGEX, on: :update

  def self.find_for_oauth(auth, signed_in_resource = nil)

    # Get the identity and user if they exist
    identity = Identity.find_for_oauth(auth)

    # If a signed_in_resource is provided it always overrides the existing user
    # to prevent the identity being locked with accidentally created accounts.
    # Note that this may leave zombie accounts (with no associated identity) which
    # can be cleaned up at a later date.
    user = signed_in_resource ? signed_in_resource : identity.user

    # Create the user if needed
    if user.nil?

      # Get the existing user by email if the provider gives us a verified email.
      # If no verified email was provided we assign a temporary email and ask the
      # user to verify it on the next step via UsersController.finish_signup
      email_is_verified = auth.info.email && (auth.info.verified || auth.info.verified_email)
      email = auth.info.email if email_is_verified
      user = User.where(:email => email).first if email

      # Create the user if it's a new registration
      if user.nil?
        user = User.new(
          name: auth.extra.raw_info.name,
          #username: auth.info.nickname || auth.uid,
          email: email ? email : "#{TEMP_EMAIL_PREFIX}-#{auth.uid}-#{auth.provider}.com",
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

  def email_verified?
    self.email && self.email !~ TEMP_EMAIL_REGEX
  end
end
~~~ 

## Completing the Signup Process

Most OAuth providers give us all the information we need, but if the user signed up with Twitter, or perhaps for some reason the OAuth provider didn't provide a verified email address, or maybe you just want to get some extra information from the user, then we need to implement an extra step for this.

<!--
  their email address and any other necessary
If the user signed up with Twitter, you will probably want a way to get a valid email address from them
The next steps are optional to get an email address from Twitter users.
-->

#### config/routes.rb

~~~ ruby
...
  match '/profile/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], :as => :finish_signup
...
~~~ 

#### app/controllers/users_controller.rb

If you're using the Devise confirmable module to verify email signups, then you may want to skip email confirmation here in order to avoid killing all the OAuth joy for the user. However, if you do want to force the user to confirm their email address then just comment out the `current_user.skip_reconfirmation!` line below. The real question is; do you trust Twitter users to provide you with a valid email address?

~~~ ruby
class UsersController < ApplicationController
  before_action :set_user, :finish_signup

  ...

  def finish_signup
    if request.patch? && params[:user] #&& params[:user][:email]
      if current_user.update(user_params)
        current_user.skip_reconfirmation!
        sign_in(current_user, :bypass => true)
        redirect_to current_user, notice: 'Your profile was successfully updated.'
      else
        @show_errors = true
      end
    end
  end
  
  private
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      accessible = [ :name, :email ] # extend with your own params
      accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
      params.require(:user).permit(accessible)
    end
end
~~~ 

#### app/views/users/finish_signup.html.erb

In our implementation, the form below only collects an email address from the user, but you could easily add other required fields, and even request the user specify a password at this point so they can login with an email and password later on. Note that the following template uses Bootstrap markup. 

~~~ html
<div id="add-email" class="container">
  <h1>Add Email</h1>
  <%= form_for(current_user, :as => 'user', :url => finish_signup_path(current_user), :html => { role: 'form'}) do |f| %>
    <% if @show_errors && current_user.errors.any? %>
      <div id="error_explanation">
        <% current_user.errors.full_messages.each do |msg| %>
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

#### app/controllers/application_controller.rb

The following method is optional, but it's useful if you want to ensure the user has provided all the necessary information before accessing a specific resource.

You can use it in a `before_filter` like so: `before_filter :ensure_signup_complete, only: [:new, :create, :update, :destroy]`

~~~ ruby
class ApplicationController < ActionController::Base

  ...

  def ensure_signup_complete
    # Ensure we don't go into an infinite loop
    return if action_name == 'finish_signup'

    # Redirect to the 'finish_signup' page if the user
    # email hasn't been verified yet
    if current_user && !current_user.email_verified?
      redirect_to finish_signup_path(current_user)
    end
  end
end
~~~ 

<!--
## Linking Accounts

Ad important factor here is 
-->

Well that's pretty much it! If I left anything out please give me a shout and I'll update the article, cheers!

## Changes

* Add `UsersController.set_user` method for clarity
* Remove duplicate controller methods from `OmniauthCallbacksController`
* Only accept verified email addresses from the provider via 'User.find_for_oauth'
* Remove redundant `gem "omniauth"` from `Gemfile`
* Update `User.find_for_oauth` to better handle `signed_in_resource`. Thanks [@mtuckerb](https://github.com/mtuckerb)
* Rename `UsersController.add_email` to `UsersController.finish_signup`
* Rename `ApplicationController.ensure_valid_email` to `ApplicationController.ensure_signup_complete`
* Override `OmniauthCallbacksController.after_sign_in_path_for` to redirect to `UsersController.finish_signup` instead of forcing via `before_filter` 
* Add `UsersController.user_params` to filter `:password` and `:password_confirmation` when blank
* Temporary email addresses are now unique
* `signed_in_resource` always overrides existing user entity in `User.find_for_oauth`