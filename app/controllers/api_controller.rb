class ApiController < ApplicationController
  before_action :ensure_resource!
  around_action :as_api

end
