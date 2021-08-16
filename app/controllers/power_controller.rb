class PowerController < ApiController
  before_action :authenticate_user!
  before_action :authenticate_power_user!
  skip_around_action :as_api, only: :index

  def index
  end

  protected

  def authenticate_power_user!
    redirect_to "/dashboard" unless current_user.power_user?
  end
end
