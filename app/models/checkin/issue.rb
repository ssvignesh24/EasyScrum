class Checkin::Issue < ApplicationRecord
  belongs_to :checkin, foreign_key: :checkin_checkin_id, class_name: "Checkin::Checkin"
  has_many :responses, class_name: "Checkin::Response", foreign_key: :checkin_issue_id

  validates :issue_time, :started_at, :no_of_participants, :no_of_participants_sent, :no_of_participants_responded, presence: true

  def questions
    checkin.question_as_on(issue_time)
  end

  def blocker_count
    Checkin::Answer
      .joins("inner join checkin_questions on checkin_answers.checkin_question_id = checkin_questions.id and checkin_questions.is_blocker_question is true")
      .joins("inner join checkin_responses on checkin_answers.checkin_response_id = checkin_responses.id")
      .where("checkin_responses.id IN (?)", responses.map(&:id))
      .where("checkin_questions.id IN (?)", questions.map(&:id))
      .where(
        <<-SQL
        (answer_text is not null
        or answer_number is not null
        or answer_checkbox is not null
        or answer_rating is not null
        or answer_datetime is not null
        or answer_date is not null
        or answer_time is not null)
        SQL
        ).size
  end
end
