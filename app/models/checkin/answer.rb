class Checkin::Answer < ApplicationRecord
  belongs_to :response, foreign_key: :checkin_response_id, class_name: "Checkin::Response"
  belongs_to :question, foreign_key: :checkin_question_id, class_name: "Checkin::Question"
  
end
