json.(feature, :id, :name, :key, :description, :active)
json.globallyEnabled feature.globally_enabled
json.defaultState feature.default_state
json.plans feature.plans.map { |p| p.slice(:id, :key, :name)}