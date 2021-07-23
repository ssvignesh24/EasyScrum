class Poker::Participant < ApplicationRecord
  belongs_to :board, class_name: "Poker::Board", foreign_key: :poker_board_id
  belongs_to :participant, polymorphic: true
  has_many :votes, class_name: "Poker::Vote", foreign_key: :poker_participant_id

end
