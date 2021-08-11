require 'rails_helper'

RSpec.describe "Guests", type: :request do
  describe "GET /new" do
    it "returns http success" do
      get "/guests/new"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /verify_email" do
    it "returns http success" do
      get "/guests/verify_email"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/guests/create"
      expect(response).to have_http_status(:success)
    end
  end

end
