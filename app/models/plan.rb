class Plan < ApplicationRecord
  has_many :plan_features
  has_many :features, through: :plan_features

  scope :active, -> { where(active: true) }
  
  class << self
    def basic
      Plan.active.where(key: 'basic').take
    end

    def advanced
      Plan.active.where(key: 'advanced').take
    end

    def pro
      Plan.active.where(key: 'pro').take
    end
  end

  def can_access?(feature_key)
    return unless feature_key.present?
    feature = Feature.active.where(key: feature_key).take
    raise "Feature key is invalid or inactive" unless feature.present?
    return unless feature.globally_enabled
    feature_config(feature)
  end

  def feature_config(feature)
    raise "Invalid feature" if feature.nil? || feature.class != Feature
    plan_features.where(feature: feature).take
  end
end
