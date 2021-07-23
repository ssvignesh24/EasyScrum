class ApplicationController < ActionController::Base

  def current_resource
    return current_user if user_signed_in?
    Guest.where(id: session[:guest_id]).take if session[:guest_id].present?
  end

  def current_user_type
    user_signed_in? ? "User" : "Guest"
  end

  helper_method :current_resource
  helper_method :current_user_type

  protected

  def set_board
    @board = Retro::Board.where(id: params[:board_id]).take
    raise ApiError::NotFound.new("Invalid retrospective board") unless @board.present?
  end

  def set_column
    @column = @board.columns.where(id: params[:column_id]).take
    raise ApiError::NotFound.new("Invalid retrospective column") unless @column.present?
  end

  def current_retro_participant(board)
    board.target_participants.where(participant: current_resource).take
  end

  def can_modify_retro_board?(board)
    board.created_by == current_resource
  end
end
