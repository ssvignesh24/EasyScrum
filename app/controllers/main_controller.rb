class MainController < ApplicationController
  before_action :authenticate_user!
  
  layout 'main'
  
  def redirect
    redirect_to '/dashboard'
  end

  def index
  end
end
