class Retro::Comment < ApplicationRecord
  belongs_to :card, class_name: "Retro::Card", foreign_key: :retro_card_id
  belongs_to :target_participant, class_name: "Retro::Participant", foreign_key: :retro_participant_id
  delegate :participant, to: :target_participant
end
