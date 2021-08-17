json.status true
json.feedbacks @feedbacks do |feedback|
  json.(feedback, :id, :rating)
  json.addedOn readable_datetime(feedback.created_at)
  json.feedbackComment feedback.feedback_comment
  json.by do
    json.(feedback.feedback_by, :id, :name, :email)
    json.type feedback.feedback_by_type
  end
end