json.status true
json.issue do
  json.partial! "checkin/issues/issue", issue: @issue, with_response: true
end