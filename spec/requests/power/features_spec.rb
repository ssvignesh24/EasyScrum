require 'rails_helper'

RSpec.describe "Power::Features", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/power/features/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /toggle" do
    it "returns http success" do
      get "/power/features/toggle"
      expect(response).to have_http_status(:success)
    end
  end

end
