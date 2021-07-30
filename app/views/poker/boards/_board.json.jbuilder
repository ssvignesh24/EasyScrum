full_board ||= false

json.(board, :id, :name, :archived, :active)
json.inviteURL "#{ENV['HOST']}poker/board/invite/#{board.get_invitation_token}"
json.canManageBoard board.created_by_id == current_user&.id
json.availableVotesString board.available_votes.join(", ")
json.availableVotes board.available_votes
json.currentParticipantId board.target_participants.where(participant: current_resource).take&.id
if board.card_template.present?
  json.card_template do
    json.(board.card_template, :id, :name)
  end
else
  json.template false
end
json.createdBy do
  json.partial! 'users/user', user: board.created_by
end
json.participantsCount board.target_participants.size
json.participants board.target_participants do |t_participant|
  participant = t_participant.participant
  json.id t_participant.id
  json.type t_participant.participant_type
  json.(participant, :name, :email)
end
if full_board
  json.issues board.issues.order(created_at: :desc), partial: 'poker/issues/issue', as: :issue
end