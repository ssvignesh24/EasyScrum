last_board = current_user ? current_user.created_retro_boards.order(created_at: :desc).first : nil
json.status true
json.boards @retro_boards, partial: 'retro/board/board', as: :retro
json.totalCount @retro_boards.size
if last_board
  json.boardTemplates [Retro::Template.active.to_a, OpenStruct.new(id: -1, name: "Previou retro template", description: last_board.columns.map(&:name).to_sentence)].flatten do |template|
    json.(template, :id, :name, :description)
  end
else
  json.boardTemplates Retro::Template.active.to_a.flatten do |template|
    json.(template, :id, :name, :description)
  end
end