class Retro::Column < ApplicationRecord
  belongs_to :board, class_name: "Retro::Board", foreign_key: :retro_board_id
  has_many :cards, class_name: "Retro::Card", foreign_key: :retro_column_id
end
