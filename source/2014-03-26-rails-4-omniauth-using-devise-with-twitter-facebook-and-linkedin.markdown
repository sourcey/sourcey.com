---
title: Rails 4 OmniAuth using Devise with Twitter, Facebook and Linkedin
date: 2014-03-26 04:41:47
tags: oauth, programming, rails, ruby
layout: blogs
---
There are quite a few OAuth solutions out there, but I want to share the one we use, as it allows you to intelligently link multiple OAuth identities with a single user entity. If you use 90% of the code examples on the internet you will wind up with a new user entity each time the user signs in with a different OAuth provider, and a bunch of very confused users.

The OAuth provider that throws a spanner in the works and adds convolution to our code is Twitter. Twitter doesn't share their user's email address, so we need to add an extra step to get it from the user. Note that we do not ask Twitter users to "confirm" their email address, since they have already associated their Twitter account, and we don't want to be too much of a pain in the ass and remove all the joy from OAuth altogether.

So, without further ado, here is the code:

#### Gemfile
```ruby
gem 'cancan'
gem 'devise'
gem 'omniauth'
gem 'omniauth-twitter'
gem 'omniauth-facebook'
gem 'omniauth-linkedin'
```

#### Generate migrations and models

```ruby
rails generate devise:install
rails generate devise user
rails g migration add_name_to_users name:string
rails g model identity user:references provider:string uid:string oauth_token:string oauth_secret:string oauth_expires_at:datetime

# Modify the db/migrate/[timestamp]_add_devise_to_users.rb to configure the Devise modules you will use.
# We usually enable the "confirmable" module when enabling email signups.
```

#### app/models/identity.rb
```rubyclass Identity < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :user_id, :uid, :provider
  validates_uniqueness_of :uid, :scope => :provider

  def self.find_for_oauth(auth)
    identity = find_by(provider: auth.provider, uid: auth.uid)
    if identity.nil?
      identity = create(uid: auth.uid, provider: auth.provider)
    end
    identity
  end
end
```

#### app/config/initializers/devise.rb
```rubyDevise.setup do |config|
...
  config.omniauth :facebook, "KEY", "SECRET"
  config.omniauth :twitter, "KEY", "SECRET"
  config.omniauth :linked_in, "KEY", "SECRET"
...
end
```

#### config/environments/[environment].rb
```ruby
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
```

#### app/controllers/omniauth_callbacks_controller.rb
```ruby
class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def twitter
    @user = User.find_for_oauth(env["omniauth.auth"], current_user)
    if @user.persisted?
      sign_in_and_redirect @user, :event => :authentication
      set_flash_message(:notice, :success, :kind => "Twitter") if is_navigational_format?
    else
      session["devise.twitter_uid"] = env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def facebook
    @user = User.find_for_oauth(env["omniauth.auth"], current_user)
    if @user.persisted?
      sign_in_and_redirect @user, :event => :authentication
      set_flash_message(:notice, :success, :kind => "Facebook") if is_navigational_format?
    else
      session["devise.facebook_data"] = env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def linkedin
    @user = User.find_for_oauth(env["omniauth.auth"], current_user)
    if @user.persisted?
      sign_in_and_redirect @user, :event => :authentication
      set_flash_message(:notice, :success, :kind => "Linkedin") if is_navigational_format?
    else
      session["devise.linkedin_data"] = env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end
end
```

#### config/routes.rb
```ruby
...
  devise_for :users, :controllers => { omniauth_callbacks: 'omniauth_callbacks' }
...
```

#### app/models/user.rb
```ruby
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
    user = identity.user
    if user.nil?

      # Get the existing user from email if the OAuth provider gives us an email
      user = User.where(:email => auth.info.email).first if auth.info.email

      # Create the user if it is a new registration
      if user.nil?
        user = User.new(
          name: auth.extra.raw_info.name,
          #username: auth.info.nickname || auth.uid,
          email: auth.info.email.blank? ? TEMP_EMAIL : auth.info.email,
          password: Devise.friendly_token[0,20]
        )
        user.skip_confirmation!
        user.save!
      end

      # Associate the identity with the user if not already
      if identity.user != user
        identity.user = user
        identity.save!
      end
    end
    user
  end
end
```

The next steps are optional to get an email address from Twitter users.

#### config/routes.rb
```ruby
...
  get '/users/:id/add_email' => 'users#add_email', via: [:get, :patch, :post], :as => :add_user_email
...
```

#### app/controllers/application_controller.rb
```ruby
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
```

#### app/controllers/users_controller.rb
```ruby
class UsersController < ApplicationController
  before_action :set_user, :add_email
  ...
  def add_email
    if params[:user] && params[:user][:email]
      current_user.email = params[:user][:email]
      current_user.skip_reconfirmation! # don't forget this if using Devise confirmable
      respond_to do |format|
        if current_user.save
          format.html { redirect_to current_user, notice: 'Your email address was successfully updated.' }
          format.json { head :no_content }
        else
          format.html { @show_errors = true }
          format.json { render json: @user.errors, status: :unprocessable_entity }
        end
      end
    end
  end
end
```

#### app/views/users/add_user.html.rb
```ruby
<div id="add-email" class="container">
  ## Add Email
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
```

Well that's pretty much it! If I left anything out please give me a shout and I will update the article. Cheers!