json.(comment, :id)
json.message comment.comment_text
json.author comment.participant.name
json.participant do
  json.partial! 'retro/board/participant', participant: comment.participant
  json.targetParticipantId comment.target_participant.id
end