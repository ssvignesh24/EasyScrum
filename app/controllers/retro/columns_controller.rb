class Retro::ColumnsController < ApiController
  before_action :set_board
  before_action :ensure_board_manage_permission!

  def create
    raise ApiError::InvalidParameters.new("Column name is empty", { name: "Column name is empty" }) if column_params[:name].blank?
    raise ApiError::InvalidParameters.new("Column name already taken", { name: "Column name already taken"}) if @board.columns.where(name: column_params[:name].strip).exists?
    last_position = @board.columns.size
    @column = @board.columns.new(name: column_params[:name].strip, color_code: column_params[:color_code]&.strip || Retro::Column::DEFAULT_COLOR).tap do |col|
      col.sort_by = 'default'
      col.position = last_position + 1
    end
    @column.save!
    RetroBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: "new_column"}).merge(default_broadcast_hash))
  end

  def update
    @column = @board.columns.where(id: params[:column_id]).take
    raise ApiError::NotFound.new("Invalid column") unless @column.present?
    raise ApiError::InvalidParameters.new("Column name is empty", { name: "Column name is empty" }) if column_params[:name].blank?
    raise ApiError::InvalidParameters.new("Column name already taken", { name: "Column name already taken"}) if @board.columns.where(name: column_params[:name].strip).exists?
    @column.update(name: column_params[:name])
    RetroBoardChannel.broadcast_to(@board,  JSON.parse(render_to_string).merge({type: "update_column"}).merge(default_broadcast_hash))
  end

  def destroy
    @column = @board.columns.where(id: params[:column_id]).take
    raise ApiError::NotFound.new("Invalid column") unless @column.present?
    @column.destroy!
    RetroBoardChannel.broadcast_to(@board,  {type: "remove_column", columnId: @column.id}.merge(default_broadcast_hash))
  end

  private

  def column_params
    params.require(:column).permit(:name, :color_code)
  end

  def default_broadcast_hash
    {
      status: true,
      originParticipantId: @board.target_participants.where(participant: current_resource).take&.id
    }
  end
end
