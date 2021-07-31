json.status true
json.boards @retro_boards, partial: 'retro/board/board', as: :retro
json.totalCount @retro_boards.size
json.boardTemplates Retro::Template.active do |template|
  json.(template, :id, :name, :description)
end