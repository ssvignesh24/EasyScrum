class Poker::IssuesController < ApiController
  before_action :set_poker_board
  before_action :set_poker_issue, except: :create
  before_action :enure_permission!

  def create
    raise ApiError::InvalidParameters.new("Summary is empty", { name: "Issue summary is empty"}) if issue_params[:summary].blank?
    @issue = @board.issues.build(summary: issue_params[:summary].strip, is_ghost: false, status: Poker::Issue::STATUS.ADDED, is_selected: false)
    @issue.description = issue_params[:description].strip unless issue_params[:description].blank?
    @issue.link = issue_params[:link] unless issue_params[:link].blank?
    @issue.save!
    PokerBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: 'add_issue'}).merge(default_broadcast_hash))
  end

  def assign
    raise ApiError::Forbidden.new("Action not allowed") unless current_user&.id == @board.created_by_id
    raise ApiError::InvalidParameters.new("Not a valid point", { points: "Invalid point. The point should be any of #{@board.available_votes.map { |v| v['value' ]}.to_sentence}"}) unless @board.available_votes.find { |v| v['value'].to_s == params[:points] }.present?
    @issue.update!(status: Poker::Issue::STATUS.FINISHED, final_story_point: params[:points], total_votes: @issue.votes.size)
    PokerBoardChannel.broadcast_to(@board,  default_broadcast_hash.merge({type: 'assign_story_points', issueId: @issue.id, finalStoryPoint: params[:points], issueStatus: Poker::Issue::STATUS.FINISHED, total_votes: @issue.votes.size}))
  end

  def update_status
    if Poker::Issue::STATUS.values.include?(params[:status])
      Poker::Issue.transaction do
        @board.issues.where(status: [Poker::Issue::STATUS.VOTING, Poker::Issue::STATUS.VOTED]).update_all(status: Poker::Issue::STATUS.ADDED)
        if params[:status] == Poker::Issue::STATUS.SELECTED
          @board.issues.where(is_selected: true).update_all(is_selected: false) 
          @issue.reload.update!(is_selected: true) 
        else
          @issue.update!(status: params[:status]) 
        end
        @issue.update_status_time
      end
    end
    PokerBoardChannel.broadcast_to(@board,  default_broadcast_hash.merge({type: 'update_status', issueId: @issue.id, issueStatus: @issue.status, isSelected: @issue.is_selected}))
  end

  def destroy
    raise ApiError::Forbidden.new("Action not allowed") unless current_user&.id == @board.created_by_id
    @issue.destroy
    PokerBoardChannel.broadcast_to(@board,  default_broadcast_hash.merge({type: 'remove_issue', issueId: @issue.id}))
  end

  def vote
    target_participant = @board.target_participants.where(participant: current_resource).take
    raise ApiError::Forbidden.new("Action not allowed") unless target_participant.present?
    raise ApiError::Forbidden.new("Action not allowed") if @issue.status != Poker::Issue::STATUS.VOTING
    vote_record = @issue.votes.where(target_participant: target_participant).first_or_initialize
    current_vote = @board.available_votes.find{ |v| v['value'] == params[:vote]}
    vote_record.vote = current_vote if current_vote
    vote_record.save!
    PokerBoardChannel.broadcast_to(@board,  default_broadcast_hash.merge({type: 'vote', issueId: @issue.id, voteId: vote_record.id, participantId: target_participant.id, vote: current_vote}))
  end

  def clear_votes
    target_participant = @board.target_participants.where(participant: current_resource).take
    raise ApiError::Forbidden.new("Action not allowed") unless target_participant.present?
    raise ApiError::Forbidden.new("Action not allowed") if @issue.status == Poker::Issue::STATUS.VOTING
    Poker::Issue.transaction do
      @issue.update!(status: Poker::Issue::STATUS.ADDED, final_story_point: nil, total_votes: nil, voting_started_at: nil, voting_completed_at: nil, points_assigned_at: nil)
      @issue.votes.destroy_all
    end
    PokerBoardChannel.broadcast_to(@board,  default_broadcast_hash.merge({type: 'clear_votes', issueId: @issue.id }))
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

  def default_broadcast_hash
    {
      status: true,
      originParticipantId: @board.target_participants.where(participant: current_resource).take&.id
    }
  end
end
