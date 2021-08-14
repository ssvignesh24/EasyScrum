json.(card, :id, :message, :position)
json.voteCount card.votes.size
json.columnId card.retro_column_id
json.canManageCard (card.participant.id == current_resource.id && card.participant.class.to_s == current_resource.class&.to_s ) || (current_resource.class&.to_s == "User" && card.column.board.created_by_id == current_resource.id)
json.comments card.comments.order(created_at: :asc), partial: 'retro/cards/comment', as: :comment
# json.participant do
#   json.partial! 'retro/board/participant', participant: card.participant
# end
json.voted card.has_voted?(current_resource)