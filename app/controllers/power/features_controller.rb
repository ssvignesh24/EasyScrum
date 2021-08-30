class Power::FeaturesController < PowerController
  def index
    @features = Feature.active
  end

  def toggle
    @feature = Feature.where(id: params[:feature_id]).take
    raise ApiError::NotFound.new("Invalid feature ID") unless @feature.present?
    @feature.update!(globally_enabled: params[:state])
  end
end
