json.status true
json.boards @boards, partial: 'poker/boards/board', as: :board
json.totalCount @boards.size
json.cardTemplates Poker::CardTemplate.active do |card_template|
  json.(card_template, :id, :name, :cards)
end