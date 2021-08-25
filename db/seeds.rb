plans = [
  {name: "Basic", key: :basic, description: "Personal or small team"},
  {name: "Advanced", key: :advanced, description: "Large teams"},
  {name: "Pro", key: :pro, description: "Company wide"},
]
plans.each do |data|
  plan = Plan.where(key: data[:key]).first_or_initialize
  plan.active = true
  plan.description = data[:description]
  plan.name = data[:name]
  plan.save!
end
Plan.where.not(key: plans.map{ |x| x[:key] }).update_all(active: false)

features = [
  {name: "Google sign-in", key: :google_oauth, description: "Signup and login with google account", default_state: false },
  {name: "User Tracking", key: :user_tracking, description: "Track user behavious in the application", default_state: true },
  {name: "Checkin", key: :checkin, description: "Daily Checkins", default_state: false },
]
features.each do |data|
  feature = Feature.where(key: data[:key]).first_or_initialize
  feature.active = true
  feature.description = data[:description]
  feature.name = data[:name]
  feature.default_state = data[:default_state]
  feature.globally_enabled = feature.globally_enabled.nil? ? feature.default_state : feature.globally_enabled
  feature.save!
end
Feature.where.not(key: features.map{ |x| x[:key] }).update_all(active: false)

{
  basic: { google_oauth: {}, checkin: { max: 1, custom_questions: true } },
  advanced: { google_oauth: {}, checkin: { max: 99999, custom_questions: true } },
  pro: { google_oauth: {}, checkin: { max: 99999, custom_questions: true } }
}.transform_values(&:with_indifferent_access).each do |plan_key, features|
  plan = Plan.where(key: plan_key).take
  next unless plan.present?
  Feature.where(key: features.keys).find_each do |feature|
    pf = PlanFeature.where(plan: plan, feature: feature).first_or_initialize
    config = features[feature.key]
    pf.config = config || {}
    pf.save!
  end
end

Retro::Template.update_all(active: false)
[
  { name: "The Standard", description: "What went well?, What we should stop doing?, What we can do better?, What should do more of?", columns: [
    { name: "What went well?", color_code: ""},
    { name: "What we should stop doing?", color_code: ""},
    { name: "What we can do better?", color_code: ""},
    { name: "What should do more of?", color_code: ""},
  ]},
  { name: "The 4 L’s", description: "Liked, Learned, Lacked, Longer for", columns: [
    { name: "Liked", color_code: ""},
    { name: "Learned", color_code: ""},
    { name: "Lacked", color_code: ""},
    { name: "Longer for", color_code: ""},
  ]},
  { name: "Start, Stop, Continue", description: "Start, Stop, Continue", columns: [
    { name: "Start", color_code: ""},
    { name: "Stop", color_code: ""},
    { name: "Continue", color_code: ""},
  ]},
  { name: "Glad, Sad, Mad", description: "Glad, Sad, Mad", columns: [
    { name: "Glad", color_code: ""},
    { name: "Sad", color_code: ""},
    { name: "Mad", color_code: ""},
  ]}
].each do |data|
  template = Retro::Template.where(name: data[:name]).first_or_initialize
  template.active = true
  template.description = data[:description]
  template.columns = data[:columns]
  template.save!
end

Poker::CardTemplate.update_all(active: false)
number_cards = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 50, 100].map { |num| { type: 'number', value: num } }
fibonacci_series_cards = [0.5, 1, 2, 3, 5, 8, 13].map { |num| { type: 'number', value: num }}
tshirt_cards = %w{XS S M L XL XXL}.map { |size| { type: 'string', value: size }}
number_cards << { type: 'extra', value: "?" }
number_cards << { type: 'extra', value: "coffee" }
fibonacci_series_cards << { type: 'extra', value: "?" }
fibonacci_series_cards << { type: 'extra', value: "coffee" }
tshirt_cards << { type: 'extra', value: "?" }
tshirt_cards << { type: 'extra', value: "coffee" }
[
  { name: "Fibonacci series(0.5, 1, 2, 3, 5, 8, 13, 50, 100, ?, ☕)", cards: fibonacci_series_cards },
  { name: "Number series(0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 50, 100, ?, ☕)", cards: number_cards },
  { name: "T-Shirt sizes(XS, S, M, L, XL, XXL, XXXL, ?, ☕)", cards: tshirt_cards },
].each do |card|
  template = Poker::CardTemplate.where(name: card[:name]).first_or_initialize
  template.cards = card[:cards]
  template.active = true
  template.save!
end