timezone = current_resource == User ? current_resource.user_timezone : response.issue.checkin.created_by.user_timezone
answers = response.answers.to_a

json.(response, :id, :medium)
json.sentAt readable_datetime(response.sent_at, timezone)
json.respondedAt readable_datetime(response.responded_at, timezone)
json.participant do
  participant = response.participant.participant
  json.participant_id response.participant.id
  json.(participant, :id, :name, :email)
  json.type participant.class.to_s
  if participant.class == User
    json.avatarUrl participant.avatar_url
  end
end

# json.answers response.answers do |answer|
#   json.id answer.id
#   json.value answer.value
#   json.question do
#     json.id answer.question.id
#     json.prompt answer.question.prompt
#   end
# end

json.questions response.issue.questions do |question|
  answer = answers.find { |a| a.checkin_question_id == question.id }
  
  json.(question, :id, :prompt)
  json.isMandatory question.is_mandatory
  json.isBlocker question.is_blocker_question
  json.answer do
    if answer.present?
      json.(answer, :id, :value)
    end
  end
end