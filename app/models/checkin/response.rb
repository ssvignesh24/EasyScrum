class Checkin::Response < ApplicationRecord
  belongs_to :issue, foreign_key: :checkin_issue_id, class_name: "Checkin::Issue"
  belongs_to :participant, foreign_key: :checkin_participant_id, class_name: "Checkin::Participant"
  has_many :answers, class_name: "Checkin::Answer", foreign_key: :checkin_response_id

  validates :medium, :token, presence: true

  def self.from_token(token)
    return unless token.present?
    computed_token = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, token)
    Checkin::Response.where(token: computed_token).take
  end

  def can_respond_now?
    Time.zone.now < issue.issue_time + 1.day
  end
end
