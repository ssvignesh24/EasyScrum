json.status @user.present?
json.feature do
  json.partial! 'power/features/feature', feature: @feature
end