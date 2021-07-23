require 'rails_helper'

RSpec.describe "Retro::Cards", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/retro/cards/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/retro/cards/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/retro/cards/destroy"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /vote" do
    it "returns http success" do
      get "/retro/cards/vote"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /unvote" do
    it "returns http success" do
      get "/retro/cards/unvote"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /add_comment" do
    it "returns http success" do
      get "/retro/cards/add_comment"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /remove_comment" do
    it "returns http success" do
      get "/retro/cards/remove_comment"
      expect(response).to have_http_status(:success)
    end
  end

end
