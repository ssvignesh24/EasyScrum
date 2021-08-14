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

  def toggle_vote
    @card = @column.cards.where(id: params[:card_id]).take
    retro_participant = @board.participant_id_of(current_resource)
    raise ApiError::Forbidden.new("Action not allowed") unless retro_participant.present?
    if @card.has_voted?(current_resource)
      @card.votes.where(target_participant: retro_participant).destroy_all
      @action = 'unvote'
    else
      @card.votes.where(target_participant: retro_participant).first_or_create!  
      @action = 'vote'
    end
    RetroBoardChannel.broadcast_to(@board,  {type: "vote_change", voteCount: @card.votes.size, cardId: @card.id, columnId: @column.id}.merge(default_broadcast_hash))
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

  def rearrange
    Retro::Card.transaction do
      @card = @column.cards.where(id: params[:card_id]).take
      @to_col = @board.columns.where(id: params[:to_column_id]).take
      @from_col = @board.columns.where(id: params[:from_column_id]).take
      next unless @card.present? && @to_col.present? && @from_col.present?
      if(@to_col == @from_col)
        if params[:new_index].to_i < @card.position
          @to_col.cards.where("position >= ? AND position < ?", params[:new_index].to_i, @card.position).where.not(id: @card.id).update_all("position = position + 1")
        else
          @to_col.cards.where("position <= :new_index AND position > :old_index", new_index: params[:new_index].to_i, old_index: @card.position).update_all("position = position - 1")
        end
      else
        @to_col.cards.where("position >= ?", params[:new_index]).update_all("position = position + 1")
        @from_col.cards.where("position >= ?", @card.position).update_all("position = position - 1")
        @card.column = @to_col
      end
      @card.position = params[:new_index].to_i
      @card.save!
    end
    col_changes = [JSON.parse(render_to_string(partial: 'retro/columns/column', locals: {column: @to_col })), JSON.parse(render_to_string(partial: 'retro/columns/column', locals: {column: @from_col }))]
    col_changes = col_changes.map do |col|
      col['cards'] = col['cards'].map { |c| c.except('voted') }
      col
    end
    RetroBoardChannel.broadcast_to(@board,  {type: "rearrange", affectedColumns: col_changes, columnId: @column.id}.merge(default_broadcast_hash))

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
