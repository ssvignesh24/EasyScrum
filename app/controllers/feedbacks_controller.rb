class FeedbacksController < ApiController
  def create
    rating = feedback_params[:rating].to_i
    raise ApiError::InvalidParameters.new("No rating", { rating: "Please provide a rating"}) if rating.zero?
    raise ApiError::InvalidParameters.new("Invalid rating", { rating: "The given rating is invalid"}) if rating > 10 || rating < 1
    @feedback = Feedback.create!(feedback_by: current_resource, rating: rating, feedback_comment: feedback_params[:comment])
  end

  private

  def feedback_params
    params.require(:feedback).permit(:rating, :comment)
  end
end
