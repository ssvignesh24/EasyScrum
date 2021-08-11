class Retro::Participant < ApplicationRecord
  belongs_to :board, class_name: "Retro::Board", foreign_key: :retro_board_id
  belongs_to :participant, polymorphic: true
  has_many :cards, class_name: "Retro::Card", foreign_key: :retro_participant_id, dependent: :destroy
  has_many :votes, class_name: "Retro::Vote", foreign_key: :retro_participant_id, dependent: :destroy
  has_many :comments, class_name: "Retro::Comment", foreign_key: :retro_participant_id, dependent: :destroy

end
