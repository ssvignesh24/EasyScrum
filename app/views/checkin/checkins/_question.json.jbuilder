json.(question, :id, :prompt, :description, :deleted)
json.checkinId question.checkin_checkin_id
json.answerType question.answer_type
json.isBlocker question.is_blocker_question
json.isMandatory question.is_mandatory
json.options question.config
json.deletedAt question.deleted_at