class Retro::Column < ApplicationRecord
  DEFAULT_COLOR = "blue".freeze
  
  belongs_to :board, class_name: "Retro::Board", foreign_key: :retro_board_id
  has_many :cards, class_name: "Retro::Card", foreign_key: :retro_column_id, dependent: :destroy
end
