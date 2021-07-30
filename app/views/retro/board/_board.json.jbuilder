full_board ||= false

json.id retro.id
json.name retro.name
json.context retro.context
json.inviteURL "#{ENV['HOST']}retro/board/invite/#{retro.get_invitation_token}"
json.canManageBoard retro.created_by_id == current_user&.id
json.currentParticipantId retro.target_participants.where(participant: current_resource).take&.id
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

if full_board
  json.columns retro.columns.order(position: :asc), partial: 'retro/columns/column', as: :column, locals: { full_column: true }
end