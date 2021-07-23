require 'rails_helper'

RSpec.describe "Poker::Issues", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/poker/issues/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/poker/issues/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/poker/issues/destroy"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /vote" do
    it "returns http success" do
      get "/poker/issues/vote"
      expect(response).to have_http_status(:success)
    end
  end

end
