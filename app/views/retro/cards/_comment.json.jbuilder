json.(comment, :id)
json.message comment.comment_text
json.participant do
  json.partial! 'retro/board/participant', participant: comment.participant
end