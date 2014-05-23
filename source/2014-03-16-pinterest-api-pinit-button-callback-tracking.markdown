---
title: Pinterest API Pinit Button Callback Tracking
date: 2014-03-16 09:23:33
tags: api, pinterest, programming, rails
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
# Pinterest API Pinit Button Callback Tracking

Unlike the Facebook and Twitter button APIs, the Pinterest button does not provide us with any callback tracking capabilities. So how do we verify that a user has completed a Pinit action? 

The solution is a little trickier than the other buttons, which give us client side callbacks, but it's still pretty straight forward. To track Pinterest action events we need to pass the necessary parameters to the media URL we give to Pinterest, and point it to a server-side script for verification. This way when Pinterest makes a request for the media URL, we can track and verify the Pinit action as completed. Get the gist?

To break it down a little more the workflow is like this:
<ul>
  <li>User clicks in Pinit button. Event is captures by JS and the initial unvalidated interaction is saved to the database.</li>
  <li>User creates the pin, and the Pinterest server requests the pinned media from our verification script URL.</li>
  <li>We ensure the request is authentic, set the interaction as validated, and serve up the image.</li>
  <li>Voila! We have successfully validated the Pinit action.</li>
</ul>

Here is some pseudo Ruby code that we have used successfully in a recent Rails project.

~~~ ruby
  # routes.rb

  resources :interactions
  get '/interactions/verify/:action_id/:user_id/:entity_id(.:format)' => 'interactions#verify', :as => :verify_interaction
~~~ 

~~~ ruby
  # interactions_controller.rb

  # POST /interactions
  # save the interaction when the client clicks on the pin button
  def create
    @interaction = Interaction.new(interaction_params)

    respond_to do |format|
      if @interaction.save
        format.js   { }
        format.json { render json: @interaction }
      else
        format.js   { flash.now[:error] = "Failed to save your interaction: #{@interaction.errors.full_messages.join('. ')}" }
        format.json { render json: @interaction.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET /interactions/verify/:action_id/:user_id/:entity_id(.:format)  
  # verify the interaction when the remote server requests the media entity
  def verify
    case params[:action_id]

    # verify the pinit action
    when "pinit"
      #p "*** pinterest validation from: #{request.env.inspect}"

      # ensure the request originates from pinterest servers
      if request.env['HTTP_REFERER'].starts_with? 'http://www.pinterest.com'

        # grab the interaction entity 
        o = Interaction.where(
          ['user_id = (?) AND entity_id = (?) AND action = (?)',
            params[:user_id], params[:entity_id], params[:action_id]]).first	
        if o
          
          # verify the action on the first request
          o.update_attribute(:verified, true) unless o.verified?

          # redirect to the image that is being pinned
          # p "*** interaction verified"
          redirect_to entity_image_url(o.entity, 'jpg')
          return
        end
      end
    # verify other actions...
    end

    # no joy here ...
    Rails.logger.info "*** Interaction not verified: #{params.inspect}"
    render nothing: true, status: :not_found     
  end
~~~ 

Happy hacking!