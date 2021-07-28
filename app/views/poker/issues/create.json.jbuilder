json.status true
json.issue do
  json.partial! 'poker/issues/issue', issue: @issue
end