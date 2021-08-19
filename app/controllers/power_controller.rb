class PowerController < ApiController
  before_action :authenticate_user!
  before_action :authenticate_power_user!
  skip_around_action :as_api, only: :index

  def index
  end


end
