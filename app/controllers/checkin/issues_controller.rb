class Checkin::IssuesController < ApiController
  before_action :set_checkin, only: [:show]

  def show
    @issue = @checkin.issues.where(id: params[:issue_id]).take
    raise ApiError::NotFound.new("Invalid issue date") unless @issue.present?
  end
end
