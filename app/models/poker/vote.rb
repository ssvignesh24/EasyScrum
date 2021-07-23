class Poker::Vote < ApplicationRecord
  belongs_to :issue, class_name: "Poker::Issue", foreign_key: :poker_issue_id
  belongs_to :target_participant, class_name: "Poker::Participant", foreign_key: :poker_participant_id
  delegate :participant, to: :target_participant
end
