full_checkin ||= false

json.(checkin, :id, :title, :description, :active, :medium)
json.created_by do
  json.partial! "users/user", user: checkin.created_by
end
json.days checkin.send_days.map(&:titleize)
json.sendAtUserTimezone checkin.send_at_user_timezone
json.paused checkin.is_paused
json.time checkin.send_at_time
json.report checkin.needs_report
json.reportAfter checkin.send_report_after_in_hours
json.participantCount checkin.participants.size

if full_checkin
  json.participants checkin.participants do |participant|
    json.id participant.id
    json.target_id participant.participant.id
    json.name participant.participant.name
    json.emaik participant.participant.email
  end
  json.questions checkin.questions.not_deleted, partial: 'checkin/checkins/question', as: :question
end