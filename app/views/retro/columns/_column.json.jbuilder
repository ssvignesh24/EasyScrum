json.(column, :id, :name, :position)
json.colorCode column.color_code
json.cardsCount column.cards.size
json.cards column.cards.order(position: :asc), partial: 'retro/cards/card', as: :card