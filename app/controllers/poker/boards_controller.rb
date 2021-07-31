class Poker::BoardsController < ApiController
  before_action :set_poker_board, only: [:show, :update, :archive, :remove_participant]
  before_action :authenticate_user!, only: [:create, :update, :archive, :destroy, :remove_participant]

  def index
    @boards = current_resource.poker_boards.includes(:target_participants)
  end

  def show
    @current_participant = @board.target_participants.where(participant: current_resource).take
  end

  def create
    raise ApiError::InvalidParameters.new("Name is empty", { name: "Board name is empty"}) if board_params[:name].blank?
    @board = Poker::Board.new(created_by: current_user, name: board_params[:name].strip, status: Poker::Board::STATUS.CREATED).tap do |b|
      b.board_unique_string = OpenSSL::HMAC.hexdigest('sha1', ENV['HASH_SALT'], "#{current_user.id}:#{Time.zone.now.to_i}:#{SecureRandom.hex(12)}")
      if board_params[:template_id].present? && !board_params[:template_id].zero?
        template = Poker::CardTemplate.where(id: board_params[:template_id]).take
        if template
          b.card_template = template
          b.available_votes = template.cards
        end
      elsif board_params[:custom_votes].present?
        b.available_votes = board_params[:custom_votes].split(",").reject(&:blank?)
      end
      b.archived = false
      b.active = true
    end
    Poker::Board.transaction do
      @board.save!
      Poker::Participant.create!(board: @board, participant: current_user, is_spectator: board_params[:is_spectator])
      @board.issues.create!(summary: 'ghost', is_ghost: true, status: Poker::Issue::STATUS.ADDED)
    end
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
    participant = Poker::Participant.where(board: board, participant: guest, is_spectator: false).first_or_create!
    cookies.encrypted[:guest_id] = guest.id
    PokerBoardChannel.broadcast_to(board,  {status: true, type: 'new_participant', participant: { id: participant.id, email: participant.participant.email, name: participant.participant.name } })
    redirect_to "/poker/board/#{board.id}"
  end

  def remove_participant
    raise ApiError::Forbidden.new("Action now allowed") if current_user != @board.created_by
    @participant = @board.target_participants.where(id: params[:participant_id]).take
    raise ApiError::Forbidden.new("You can't remove yourself!") if @participant.participant == current_user
    raise ApiError::NotFound.new("Participant not found") unless @participant.present?
    PokerBoardChannel.broadcast_to(@board,  { status: true, type: 'remove_participant', participantId: @participant.id })
    @participant.destroy!
  end

  def archive
  end

  def destroy
    @board = current_user.created_poker_boards.where(id: params[:board_id]).take
    raise ApiError::Forbidden.new("Action now allowed") if @board&.created_by != current_user
    @board.destroy!
  end

  private
  
  def board_params
    params.require(:board).permit(:name, :template_id, :custom_votes, :is_spectator)
  end

  def show_invitation_error(error)
    flash[:alert] = error
    redirect_to poker_board_invitation_path(params[:token])
  end

  def guest_params
    params.require(:guest).permit(:name, :email)
  end
end
