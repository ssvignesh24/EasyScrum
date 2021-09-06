class Checkin::Answer < ApplicationRecord
  belongs_to :response, foreign_key: :checkin_response_id, class_name: "Checkin::Response"
  belongs_to :question, foreign_key: :checkin_question_id, class_name: "Checkin::Question"

  def set_answer(answer)
    raise "Answer not present" unless answer.present?
    case question.answer_type
    when 'text'
      self.answer_text = answer.strip
    when 'number'
      self.answer_number = answer.to_i.to_s == answer ? answer.to_i : answer.to_f
    when 'datetime'
      self.answer_datetime = parse_date_time(answer)
    when 'date'
      self.answer_date = parse_date_time(answer)
    when 'time'
      self.answer_time = parse_date_time(answer)
    when 'rating5', 'rating10'
      rating = answer.to_i
      raise "Invalid rating" if rating < 0 || rating > 10
      self.answer_rating = rating
    when 'dropdown'
      self.answer_select = answer.strip
    when 'checklist'
      self.answer_checkbox = Array.wrap(answer).map(&:presence).compact
    else
      raise "Invalid answer type: #{question.answer_type}"
    end
  end

  def value
    case question.answer_type
    when 'text'
      return answer_text
    when 'number'
      return answer_number
    when 'datetime'
      return answer_datetime
    when 'date'
      return answer_date
    when 'time'
      return answer_time
    when 'rating5', 'rating10'
      return answer_rating
    when 'dropdown'
      return answer_select
    when 'checklist'
      return answer_checkbox
    else
      raise "Invalid answer type: #{question.answer_type}"
    end
  end

  private

  def parse_date_time(answer)
    participant = response.participant.participant
    user_timezone = participant.class == User ? participant.user_timezone : response.issue.checkin.created_by.user_timezone
    Time.find_zone(user_timezone).parse(answer.strip).in_time_zone("UTC")
  end
  
end
