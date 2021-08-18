class Poker::BoardsController < ApiController
  before_action :set_poker_board, only: [:show, :update, :archive, :remove_participant, :rename]
  before_action :authenticate_user!, only: [:create, :update, :archive, :destroy, :remove_participant, :rename]

  def index
    @boards = current_resource.poker_boards.includes(:target_participants)
  end

  def show
    @current_participant = @board.target_participants.where(participant: current_resource).take
    if @board.created_by == current_resource
      @show_invite_modal = session["invite_user_p_#{@board.id}".to_sym]
      session.delete("invite_user_p_#{@board.id}".to_sym)
    end
  end

  def create
    raise ApiError::InvalidParameters.new("Name is empty", { name: "Board name is empty"}) if board_params[:name].blank?
    @board = Poker::Board.new(created_by: current_user, name: board_params[:name].strip, status: Poker::Board::STATUS.CREATED).tap do |b|
      b.board_unique_string = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, "#{current_user.id}:#{Time.zone.now.to_i}:#{SecureRandom.hex(12)}")
      if board_params[:template_id].present? && !board_params[:template_id].zero?
        template = Poker::CardTemplate.where(id: board_params[:template_id]).take
        if template
          b.card_template = template
          b.available_votes = template.cards
        end
      elsif board_params[:custom_votes].present?
        votes = board_params[:custom_votes].split(",").reject(&:blank?).uniq
        b.available_votes = votes.map do |vote|
          if vote.to_s.to_s == vote
            { type: 'number', value: vote.to_i }
          elsif vote.to_f.to_s == vote
            { type: 'number', value: vote.to_f }
          else
            { type: 'string', value: vote }
          end
        end
      end
      b.archived = false
      b.active = true
    end
    Poker::Board.transaction do
      @board.save!
      Poker::Participant.create!(board: @board, participant: current_user, is_spectator: board_params[:is_spectator])
      @board.issues.create!(summary: 'ghost', is_ghost: true, status: Poker::Issue::STATUS.ADDED)
      session["invite_user_p_#{@board.id}".to_sym] = true
    end
  end

  def update
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

  def rename
    raise ApiError::Forbidden.new("Action now allowed") if current_user != @board.created_by
    raise ApiError::InvalidParameters.new("Invalid name", { name: "Name is empty"}) if params[:name].blank?
    @board.update(name: params[:name])
  end

  private
  
  def board_params
    params.require(:board).permit(:name, :template_id, :custom_votes, :is_spectator)
  end

  def guest_params
    params.require(:guest).permit(:name, :email)
  end
end
