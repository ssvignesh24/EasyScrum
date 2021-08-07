class Retro::ActionItemsController < ApiController
  before_action :authenticate_user!
  before_action :set_board
  before_action :ensure_board_manage_permission!

  def create
    raise ApiError::InvalidParameters.new("Empty action", { action: "Action message is blank "}) if params[:text].blank?
    @action_item = @board.action_items.create!(action_message: params[:text].strip, status: Retro::ActionItem::STATUS.PENDING, created_by: current_user)
    RetroBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: "create_action_item"}).merge(default_broadcast_hash))
  end

  def toggle
    @action_item = @board.action_items.where(id: params[:item_id]).take
    raise ApiError::NotFound.new("Invalid action item") unless @action_item.present?
    if @action_item.status == Retro::ActionItem::STATUS.PENDING
      @action_item.update!(status: Retro::ActionItem::STATUS.COMPLETED)
    elsif @action_item.status == Retro::ActionItem::STATUS.COMPLETED
      @action_item.update!(status: Retro::ActionItem::STATUS.PENDING)
    end
    RetroBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: "toggle_action_item"}).merge(default_broadcast_hash))
  end

  def destroy
    @action_item = @board.action_items.where(id: params[:item_id]).take
    @action_item&.destroy
    RetroBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: "delete_action_item"}).merge(default_broadcast_hash))
  end

  private

  def default_broadcast_hash
    {
      status: true,
      originParticipantId: @board.target_participants.where(participant: current_resource).take&.id
    }
  end
end
