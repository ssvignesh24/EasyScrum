json.status true
json.user do
  json.partial! 'users/user', user: current_user
end