json.status true
json.checkins @checkins, partial: 'checkin/checkins/checkin', as: :checkin
json.totalCount @checkins.size