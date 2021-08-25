class Guest < ApplicationRecord
  belongs_to :parent_user, class_name: "User"
  has_many :retro_board_participants, class_name: "Retro::Participant", as: :participant
  has_many :retro_boards, through: :retro_board_participants,  source: :board 
  has_many :poker_board_participants, class_name: "Poker::Participant", as: :participant
  has_many :poker_boards, through: :poker_board_participants,  source: :board
  has_many :feedbacks, as: :feedback_by 

  delegate :can_access?, to: :parent_user

end
