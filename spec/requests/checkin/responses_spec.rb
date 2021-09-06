require 'rails_helper'

RSpec.describe "Checkin::Responses", type: :request do
  describe "GET /set_answers" do
    it "returns http success" do
      get "/checkin/responses/set_answers"
      expect(response).to have_http_status(:success)
    end
  end

end
