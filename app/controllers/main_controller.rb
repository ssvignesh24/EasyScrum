class MainController < ApplicationController
  before_action :ensure_resource!
  
  layout 'main'
  
  def redirect
    redirect_to '/dashboard'
  end

  def index
  end
end
