class OmniauthCallbacksController < ApplicationController
  def google_oauth2
    state = JSON.parse(Base64.decode64(params[:state])) rescue nil
    is_signup = state.try(:[], 'origin') == 'signup' 
    valid_response, @user = User.from_omniauth(request.env['omniauth.auth'], is_signup)

    if @user && @user.persisted?
      flash[:notice] = I18n.t 'devise.omniauth_callbacks.success', kind: 'Google'
      sign_in_and_redirect @user, event: :authentication
    else
      session['devise.google_data'] = request.env['omniauth.auth'].except('extra') # Removing extra as it can overflow some session stores
      redirect_to (is_signup ? signup_path : new_user_session_path) , alert: valid_response ? "Unable to identify account with email, try signing up" : "Unable to authenticate with Google"
    end
  end

  def failure
  end
end
 