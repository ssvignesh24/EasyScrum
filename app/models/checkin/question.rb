class Checkin::Question < ApplicationRecord
  belongs_to :checkin, foreign_key: :checkin_checkin_id, class_name: "Checkin::Checkin"
  has_many :answers, class_name: "Checkin::Answer", foreign_key: :checkin_question_id

  validates :prompt, :answer_type, presence: true
end
