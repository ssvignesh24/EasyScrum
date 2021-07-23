class Retro::CardsController < ApiController
  before_action :set_board
  before_action :set_column

  def create
    raise ApiError::InvalidParameters.new("Message is empty", { message: "Message is empty"}) if card_params[:message].blank?
    Retro::Card.transaction do
      @column.cards.update_all("position = position + 1")
      @card = @column.cards.create!(message: card_params[:message], target_participant: current_retro_participant(@board), position: 1)
    end
  end

  def update
    @card = @column.cards.where(id: params[:card_id]).take
    raise ApiError::Forbidden.new("Action not allowed") unless (@board.created_by_id == current_user&.id) || (@card.participant == current_resource)
    raise ApiError::InvalidParameters.new("Message is empty", { message: "Message is empty"}) if card_params[:message].blank?
    @card.update(message: card_params[:message].strip)
  end

  def destroy
    @card = @column.cards.where(id: params[:card_id]).take
    raise ApiError::Forbidden.new("Action not allowed") unless (@board.created_by_id == current_user&.id) || (@card.participant == current_resource)
    @card.destroy!
  end

  def vote
  end

  def unvote
  end

  def add_comment
    @card = @column.cards.where(id: params[:card_id]).take
    raise ApiError::NotFound.new("Invalid card") unless @card.present?
    raise ApiError::InvalidParameters.new("Comment is empty") if comment_params[:message].strip.blank?
    @comment = @card.comments.create!(comment_text: comment_params[:message].strip, target_participant: current_retro_participant(@board))
  end

  def remove_comment
    raise ApiError::Forbidden.new("Action not allowed") unless (@board.created_by_id == current_user&.id) || (@comment.participant.id == current_resource&.id && @comment.participant.class == current_resource&.class)
    @card = @column.cards.where(id: params[:card_id]).take
    raise ApiError::NotFound.new("Invalid card") unless @card.present?
    @comment = @card.comments.where(id: params[:comment_id]).take
    raise ApiError::NotFound.new("Invalid comment") unless @comment.present?
    @comment.destroy!
  end

  private

  def card_params
    params.require(:card).permit(:message)
  end

  def comment_params
    params.require(:comment).permit(:message)
  end
end
