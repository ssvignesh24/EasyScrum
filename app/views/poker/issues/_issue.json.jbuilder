json.(issue, :id, :summary, :description, :status, :link)
json.boardId issue.poker_board_id
json.isGhost issue.is_ghost
json.votes do
  json.finalStoryPoint issue.final_story_point
  json.avgStoryPoint issue.avg_story_point
  json.totalVotes issue.total_votes
  if @current_participant
    json.currentUserVote issue.votes.where(target_participant: @current_participant).take&.vote
  end
  json.participant_votes issue.votes do |vote|
    json.(vote, :id, :vote)
    json.targent_participant_id vote.target_participant.id
  end
end