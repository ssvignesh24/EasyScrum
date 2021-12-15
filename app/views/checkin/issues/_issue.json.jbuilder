with_response ||= false
timezone = current_resource == User ? current_resource.user_timezone : issue.checkin.created_by.user_timezone

json.(issue, :id)
json.time readable_date(issue.issue_time, timezone)
json.startedAt readable_datetime(issue.started_at, timezone)
json.participants do
  json.total issue.no_of_participants
  json.sent issue.no_of_participants_sent
  json.responded issue.no_of_participants_responded
end

if with_response
  json.responses issue.responses, partial: 'checkin/responses/response', as: :response
end