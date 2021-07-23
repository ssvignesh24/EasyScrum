require 'rails_helper'

RSpec.describe "Retro::Boards", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/retro/board/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/retro/board/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/retro/board/show"
      expect(response).to have_http_status(:success)
    end
  end

end
