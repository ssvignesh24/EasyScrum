class Feature < ApplicationRecord
  has_many :plan_features
  has_many :plans, through: :plan_features

  scope :active, -> { where(active: true) }

  def self.enabled?(feature_key)
    feature = Feature.where(key: feature_key).take
    raise "Invalid feature" unless feature.present?
    raise false unless feature.active?
    feature.globally_enabled
  end
end
