require 'rails_helper'

RSpec.describe "Poker::Boards", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/poker/boards/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/poker/boards/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/poker/boards/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/poker/boards/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /accept_invitation" do
    it "returns http success" do
      get "/poker/boards/accept_invitation"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /add_participant" do
    it "returns http success" do
      get "/poker/boards/add_participant"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /archive" do
    it "returns http success" do
      get "/poker/boards/archive"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/poker/boards/destroy"
      expect(response).to have_http_status(:success)
    end
  end

end
