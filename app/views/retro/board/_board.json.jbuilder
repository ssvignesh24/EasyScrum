full_board ||= false
prev_retro = retro.previous_retro

json.id retro.id
json.name retro.name
json.context retro.context
json.inviteURL "#{ENV['HOST']}retro/board/invite/#{retro.get_invitation_token}"
json.canManageBoard retro.created_by_id == current_user&.id
json.currentParticipantId retro.target_participants.where(participant: current_resource).take&.id
json.currentParticipantName retro.target_participants.where(participant: current_resource).take&.participant&.name
json.createdAt readable_datetime(retro.created_at)
json.actionItems retro.action_items.order(created_at: :desc), partial: 'retro/action_items/action_item', as: :item
json.previousActionItems (prev_retro.present? ? prev_retro.action_items : []), partial: 'retro/action_items/action_item', as: :item
json.previousRetroName prev_retro&.name
if retro.template.present?
  json.template do
    json.id retro.template.id
    json.name retro.template.name
  end
else
  json.template false
end
json.createdBy do
  json.partial! 'users/user', user: retro.created_by
end
json.participantsCount retro.target_participants.size

json.participants retro.target_participants do |t_participant|
  participant = t_participant.participant
  json.id t_participant.id
  json.type t_participant.participant_type
  json.(participant, :name, :email)
end

if full_board
  json.columns retro.columns.order(position: :asc), partial: 'retro/columns/column', as: :column, locals: { full_column: true }
end