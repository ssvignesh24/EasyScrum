class ApplicationController < ActionController::Base

  def current_resource
    return current_user if user_signed_in?
    Guest.where(id: cookies.encrypted[:guest_id]).take if cookies.encrypted[:guest_id].present?
  end

  def current_user_type
    user_signed_in? ? "User" : "Guest"
  end

  helper_method :current_resource
  helper_method :current_user_type

  def after_sign_in_path_for(resource)
    "/dashboard"
  end

  protected

  def as_api
    begin
      yield
    rescue ApiError::BadRequest => e
      render status: :bad_request, json: { status: false, error: e.message }
    rescue ApiError::NotFound => e
      render status: :not_found, json: { status: false, error: e.message }
    rescue ApiError::Forbidden => e
      render status: :forbidden, json: { status: false, error: e.message }
    rescue ApiError::InvalidParameters => e
      render status: :bad_request, json: { status: false, errors: e.errors }
    rescue => e
      ErrorReporter.send(e)
      render status: 500, json: { error: "Something went wrong, please try again"}
    end
  end

  def set_board
    @board = current_resource.retro_boards.where(id: params[:board_id]).take
    raise ApiError::NotFound.new("Invalid retrospective board") unless @board.present?
  end

  def set_column
    @column = @board.columns.where(id: params[:column_id]).take
    raise ApiError::NotFound.new("Invalid retrospective column") unless @column.present?
  end

  def set_checkin
    @checkin = current_resource.checkins.where(id: params[:checkin_id]).take
    raise ApiError::NotFound.new("Invalid checkin") unless @checkin.present?
  end

  def current_retro_participant(board)
    board.target_participants.where(participant: current_resource).take
  end

  def can_modify_retro_board?(board)
    return false unless board.present?
    board.created_by == current_resource
  end

  def can_modify_poker_board?(board)
    board.created_by == current_resource
  end

  def set_poker_board
    @board = current_resource.poker_boards.where(id: params[:board_id]).take
    raise ApiError::NotFound.new("Invalid planning poker board") unless @board.present?
  end

  def ensure_resource!
    return if current_resource.present?
    redirect_to new_user_session_path
  end

  def ensure_board_manage_permission!
    raise ApiError::Forbidden.new("Action now allowed") unless can_modify_retro_board?(@board)
  end
end
