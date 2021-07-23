class Poker::BoardsController < ApiController
  before_action :set_poker_board, only: [:show, :update, :archive]
  before_action :authenticate_user!, only: [:create, :update, :archive, :destroy]

  def index
    @boards = current_resource.poker_boards
  end

  def show
  end

  def create
  end

  def update
  end

  def accept_invitation
    @token = params[:token]
    return unless @token.present?
    @board = Poker::Board.get_board_by_invitation_token(@token)
  end

  def add_participant
    token = params[:token]
    show_invitation_error("Invalid token") and return unless token.present?
    if guest_params[:email].blank? && guest_params[:name].blank?
      show_invitation_error("Both name and email are empty") and return
    elsif guest_params[:email].blank?
      show_invitation_error("Email is empty") and return
    elsif guest_params[:name].blank?
      show_invitation_error("Name is empty") and return
    elsif !Mail::Address.new(guest_params[:email]).domain.present?
      show_invitation_error("Invalid email address") and return
    end
    board = Poker::Board.get_board_by_invitation_token(token)
    guest = Guest.where(email: guest_params[:email], parent_user_id: board.created_by_id).first_or_initialize
    guest.name = guest_params[:name].strip
    guest.save!
    Poker::Participant.where(board: board, participant: guest, is_spectator: false).first_or_create!
    session[:guest_id] = guest.id
    redirect_to poker_board_path(board.id)
  end

  def archive
  end

  def destroy
  end

  private

  def show_invitation_error(error)
    flash[:alert] = error
    redirect_to poker_board_invitation_path(params[:token])
  end
end
