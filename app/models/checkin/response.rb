class Checkin::Response < ApplicationRecord
  belongs_to :issue, foreign_key: :checkin_issue_id, class_name: "Checkin::Issue"
  belongs_to :participant, foreign_key: :checkin_participant_id, class_name: "Checkin::Participant"
  has_many :answers, class_name: "Checkin::Answer", foreign_key: :checkin_response_id

  validates :medium, :token, presence: true
end
