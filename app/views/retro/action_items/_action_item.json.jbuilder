json.(item, :id, :status)
json.actionMessage item.action_message
if item.assigned_to
  json.assignedTo do
    json.id item.assigned_to.id
    json.name item.assigned_to.name
  end
end