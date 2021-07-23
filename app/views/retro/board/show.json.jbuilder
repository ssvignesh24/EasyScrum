json.status true
json.board do
  json.partial! 'retro/board/board', retro: @board, full_board: true
end