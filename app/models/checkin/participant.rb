class Checkin::Participant < ApplicationRecord
  belongs_to :checkin, foreign_key: :checkin_checkin_id, class_name: "Checkin::Checkin"
  belongs_to :participant, polymorphic: true
  has_many :responses, class_name: "Checkin::Response", foreign_key: :checkin_participant_id
  
end
