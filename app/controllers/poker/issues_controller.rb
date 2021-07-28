class Poker::IssuesController < ApiController
  before_action :set_poker_board
  before_action :set_poker_issue, except: :create
  before_action :enure_permission!

  def create
    raise ApiError::InvalidParameters.new("Summary is empty", { name: "Issue summary is empty"}) if issue_params[:summary].blank?
    @issue = @board.issues.build(summary: issue_params[:summary].strip, is_ghost: false, status: Poker::Issue::STATUS.ADDED)
    @issue.description = issue_params[:description].strip unless issue_params[:description].blank?
    @issue.link = issue_params[:link] unless issue_params[:link].blank?
    @issue.save!
  end

  def assign
    raise ApiError::Forbidden.new("Action not allowed") unless current_user&.id == @board.created_by_id
    raise ApiError::InvalidParameters.new("Not a valid point", { points: "Invalid point. The point should be any of #{@board.available_votes.to_sentence}"}) unless @board.available_votes.include?(params[:points])
    @issue.update(status: Poker::Issue::STATUS.FINISHED, final_story_point: params[:points], total_votes: @issue.votes.size)
  end

  def update_status
    if Poker::Issue::STATUS.values.include?(params[:status])
      Poker::Issue.transaction do
        @board.issues.where(status: [Poker::Issue::STATUS.SELECTED, Poker::Issue::STATUS.VOTING, Poker::Issue::STATUS.VOTED]).update_all(status: Poker::Issue::STATUS.ADDED)
        @issue.update(status: params[:status]) 
      end
    end
  end

  def destroy
    raise ApiError::Forbidden.new("Action not allowed") unless current_user&.id == @board.created_by_id
    @issue.destroy
  end

  def vote
    target_participant = @board.target_participants.where(participant: current_resource).take
    raise ApiError::Forbidden.new("Action not allowed") unless target_participant.present?
    raise ApiError::Forbidden.new("Action not allowed") if @issue.status != Poker::Issue::STATUS.VOTING
    vote_record = @issue.votes.where(target_participant: target_participant).first_or_initialize
    vote_record.vote = params[:vote] if @board.available_votes.include?(params[:vote])
    vote_record.save!
  end

  def clear_votes
    target_participant = @board.target_participants.where(participant: current_resource).take
    raise ApiError::Forbidden.new("Action not allowed") unless target_participant.present?
    raise ApiError::Forbidden.new("Action not allowed") if @issue.status == Poker::Issue::STATUS.VOTING
    Poker::Issue.transaction do
      @issue.update!(status: Poker::Issue::STATUS.SELECTED, final_story_point: nil, avg_story_point: nil, total_votes: nil)
      @issue.votes.destroy_all
    end
  end

  private

  def set_poker_issue
    @issue = @board.issues.where(id: params[:issue_id]).take
    raise ApiError::NotFound.new("Invalid poker issue") unless @issue.present?
  end

  def issue_params
    params.require(:issue).permit(:summary, :description, :link)
  end

  def enure_permission!
    raise ApiError::Forbidden.new("Action now allowed") unless @board.target_participants.where(participant: current_resource).present?
  end
end
