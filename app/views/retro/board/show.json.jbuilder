json.status true
json.board do
  json.partial! 'retro/board/board', retro: @board, full_board: true
  json.showInviteModal @show_invite_modal
end