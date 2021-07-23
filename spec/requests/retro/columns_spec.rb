require 'rails_helper'

RSpec.describe "Retro::Columns", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/retro/columns/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/retro/columns/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/retro/columns/destroy"
      expect(response).to have_http_status(:success)
    end
  end

end
