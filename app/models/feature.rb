class Feature < ApplicationRecord
  has_many :plan_features
  has_many :plans, through: :plan_features

  scope :active, -> { where(active: true) }

end
