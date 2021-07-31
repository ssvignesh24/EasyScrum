class Retro::Template < ApplicationRecord
  has_many :boards, class_name: "Retro::Board", foreign_key: :retro_template_id

  scope :active, -> { where(active: true) }
end
