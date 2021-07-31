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
[
  { name: "Number series(0.5,1,2,3,4,5,6,7,8,9,10,11,12)", cards: %w{0.5 1 2 3 4 5 6 7 8 9 10 11 12}},
  { name: "Fibonacci series(0.5,1,2,3,5,8,13)", cards: %w{0.5 1 2 3 5 8 13}},
  { name: "T-Shirt sizes(XS,S,M,L,XL,XXL)", cards: %w{XS S M L XL XXL}},
].each do |card|
  template = Poker::CardTemplate.where(name: card[:name]).first_or_initialize
  template.cards = card[:cards]
  template.active = true
  template.save!
end