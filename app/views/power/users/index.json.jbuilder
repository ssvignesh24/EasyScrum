json.status true
json.users @users, partial: 'power/users/user', as: :user
json.totalCount @users.size