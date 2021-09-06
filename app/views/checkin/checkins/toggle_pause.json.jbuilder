json.status true
json.checkin do
  json.partial! "checkin/checkins/checkin", checkin: @checkin
end