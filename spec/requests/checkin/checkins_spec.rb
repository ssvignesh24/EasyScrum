require 'rails_helper'

RSpec.describe "Checkin::Checkins", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/checkin/checkins/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/checkin/checkins/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/checkin/checkins/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/checkin/checkins/destroy"
      expect(response).to have_http_status(:success)
    end
  end

end
