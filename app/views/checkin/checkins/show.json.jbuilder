json.status true
json.checkin do
  json.partial! "checkin/checkins/checkin", checkin: @checkin, full_checkin: true, include_issues: true
end