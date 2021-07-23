class Poker::CardTemplate < ApplicationRecord
  has_many :boards, class_name: "Poker::Board", foreign_key: :poker_card_template_id
end
