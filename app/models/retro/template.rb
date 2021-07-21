class Retro::Template < ApplicationRecord
  has_many :boards, class_name: "Retro::Board", foreign_key: :retro_template_id
end
