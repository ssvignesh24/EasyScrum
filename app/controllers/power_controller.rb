class PowerController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_power_user!

  def index
  end

  protected

  def authenticate_power_user!
    redirect_to "/dashboard" unless current_user.power_user?
  end
end
