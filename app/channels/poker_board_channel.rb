class PokerBoardChannel < ApplicationCable::Channel
  def subscribed
    return unless params[:board_id].present?
    board = Poker::Board.find(params[:board_id])
    stream_for board
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
