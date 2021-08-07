json.status true
json.actionItem do
  json.partial! 'retro/action_items/action_item', item: @action_item
end