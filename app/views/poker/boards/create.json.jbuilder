json.status true
json.board do
  json.partial! 'poker/boards/board', board: @board
end