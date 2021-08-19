class Checkin::Issue < ApplicationRecord
  belongs_to :checkin, foreign_key: :checkin_checkin_id, class_name: "Checkin::Checkin"
  has_many :responses, class_name: "Checkin::Response", foreign_key: :checkin_issue_id

  validates :issue_date, :started_at, :no_of_participants, :no_of_participants_sent, :no_of_participants_responded, presence: true
end
