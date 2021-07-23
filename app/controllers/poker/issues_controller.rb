class Poker::IssuesController < ApiController
  before_action :set_poker_board
  before_action :set_poker_issue, except: :create
  before_action :enure_permission!

  def create
  end

  def update
  end

  def destroy
  end

  def vote
  end

  private

  def set_poker_issue
    @issue = @board.issues.where(id: params[:issue_id]).take
    raise ApiError::NotFound.new("Invalid poker issue") unless @issue.present?
  end

  def enure_permission!
    raise ApiError::Forbidden.new("Action now allowed") unless @board.target_participants.where(participant: current_resource).present?
  end
end
