json.status true
json.board do
  json.partial! 'retro/board/board', retro: @retro_board
end