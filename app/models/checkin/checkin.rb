class Checkin::Checkin < ApplicationRecord
  belongs_to :account, optional: true
  belongs_to :created_by, class_name: "::User"
  has_many :questions, class_name: "Checkin::Question", foreign_key: :checkin_checkin_id
  has_many :issues, class_name: "Checkin::Issue", foreign_key: :checkin_checkin_id
  has_many :participants, class_name: "Checkin::Participant", foreign_key: :checkin_checkin_id
  
  validates :title, :send_days, :send_at_time, :medium, presence: true
end
