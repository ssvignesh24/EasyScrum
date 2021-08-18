json.status @user.present?
json.user do
  json.partial! 'power/users/user', user: @user
  json.guestsCount @user.guests.size
  json.retroCount @user.created_retro_boards.size
  json.pokerCount @user.created_poker_boards.size
  json.feedbacksCount @user.feedbacks.size
end