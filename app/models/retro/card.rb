class Retro::Card < ApplicationRecord
  belongs_to :column, class_name: "Retro::Column", foreign_key: :retro_column_id
  belongs_to :target_participant, class_name: "Retro::Participant", foreign_key: :retro_participant_id
  has_many :comments, class_name: "Retro::Comment", foreign_key: :retro_card_id, dependent: :destroy
  has_many :votes, class_name: "Retro::Vote", foreign_key: :retro_card_id, dependent: :destroy
  delegate :participant, to: :target_participant

end
