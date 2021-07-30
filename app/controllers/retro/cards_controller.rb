class Retro::CardsController < ApiController
  before_action :set_board
  before_action :set_column

  def create
    raise ApiError::InvalidParameters.new("Message is empty", { message: "Message is empty"}) if card_params[:message].blank?
    Retro::Card.transaction do
      @column.cards.update_all("position = position + 1")
      @card = @column.cards.create!(message: card_params[:message], target_participant: current_retro_participant(@board), position: 1)
    end
    RetroBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: "new_card", columnId: @column.id}).merge(default_broadcast_hash))
  end

  def update
    @card = @column.cards.where(id: params[:card_id]).take
    raise ApiError::Forbidden.new("Action not allowed") unless (@board.created_by_id == current_user&.id) || (@card.participant == current_resource)
    raise ApiError::InvalidParameters.new("Message is empty", { message: "Message is empty"}) if card_params[:message].blank?
    @card.update(message: card_params[:message].strip)
    RetroBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: "update_card", columnId: @column.id}).merge(default_broadcast_hash))
  end

  def destroy
    @card = @column.cards.where(id: params[:card_id]).take
    raise ApiError::Forbidden.new("Action not allowed") unless (@board.created_by_id == current_user&.id) || (@card.participant == current_resource)
    @card.destroy!
    RetroBoardChannel.broadcast_to(@board,  {type: "remove_card", cardId: @card.id, columnId: @column.id}.merge(default_broadcast_hash))
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
    RetroBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: "new_comment", cardId: @card.id, columnId: @column.id}).merge(default_broadcast_hash))
  end

  def remove_comment
    @card = @column.cards.where(id: params[:card_id]).take
    @comment = @card.comments.where(id: params[:comment_id]).take
    raise ApiError::Forbidden.new("Action not allowed") unless (@board.created_by_id == current_user&.id) || (@comment.participant.id == current_resource&.id && @comment.participant.class == current_resource&.class)
    @card = @column.cards.where(id: params[:card_id]).take
    raise ApiError::NotFound.new("Invalid card") unless @card.present?
    raise ApiError::NotFound.new("Invalid comment") unless @comment.present?
    @comment.destroy!
    RetroBoardChannel.broadcast_to(@board,  {type: "remove_comment", cardId: @card.id, columnId: @column.id, commentId: @comment.id}.merge(default_broadcast_hash))
  end

  private

  def card_params
    params.require(:card).permit(:message)
  end

  def comment_params
    params.require(:comment).permit(:message)
  end

  def default_broadcast_hash
    {
      status: true,
      originParticipantId: @board.target_participants.where(participant: current_resource).take&.id,
      canManageCard: false
    }
  end
end
