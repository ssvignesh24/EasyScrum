require 'rails_helper'

RSpec.describe "Power::Users", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/power/users/index"
      expect(response).to have_http_status(:success)
    end
  end

end
