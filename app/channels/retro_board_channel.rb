class RetroBoardChannel < ApplicationCable::Channel
  def subscribed
    return unless params[:board_id].present?
    board = Retro::Board.find(params[:board_id])
    return unless board.present?
    stream_for board
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
