require 'rails_helper'

RSpec.describe "OmniauthCallbacks", type: :request do
  describe "GET /google_oauth2" do
    it "returns http success" do
      get "/omniauth_callbacks/google_oauth2"
      expect(response).to have_http_status(:success)
    end
  end

end
