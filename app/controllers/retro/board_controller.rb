class Retro::BoardController < ApiController
  before_action :set_board, only: [:show, :destroy]
  before_action :authenticate_user!, only: [:create]

  def index
    @retro_boards = current_resource.retro_boards
  end

  def create
    ApiError::InvalidParameters.new({name: "Name is empty"}) if retro_params[:name].strip.blank?
    @retro_board = Retro::Board.new(created_by: current_user, name: retro_params[:name].strip).tap do |r|
      r.status = Retro::Board::STATUS.CREATED
      r.archived = false
      r.context = retro_params[:context].strip
      if retro_params[:template_id]
        template = Retro::Template.where(id: retro_params[:template_id]).take
        r.template = template if template.present?
      end
      r.board_unique_string = OpenSSL::HMAC.hexdigest('sha1', ENV['HASH_SALT'], "#{current_user.id}:#{current_user_type}:#{Time.zone.now.to_i}:#{SecureRandom.hex(12)}")
    end
    @retro_board.save!
    @retro_board.target_participants.create!(participant: current_user)
  rescue => e
    ErrorReporter.send(e)
    raise ApiError::BadRequest.new("Something went wrong")
  end

  def show
  end

  def accept_invitation
    @token = params[:token]
    return unless @token.present?
    @board = Retro::Board.get_board_by_invitation_token(@token)
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
    board = Retro::Board.get_board_by_invitation_token(token)
    guest = Guest.where(email: guest_params[:email], parent_user_id: board.created_by_id).first_or_initialize
    guest.name = guest_params[:name].strip
    guest.save!
    Retro::Participant.where(board: board, participant: guest).first_or_create!
    session[:guest_id] = guest.id
    redirect_to retro_board_path(board.id)
  end

  private

  def retro_params
    params.require(:retro).permit(:name, :template_id, :context)
  end

  def guest_params
    params.require(:guest).permit(:name, :email)
  end

  def show_invitation_error(error)
    flash[:alert] = error
    redirect_to retro_board_invitation_path(params[:token])
  end
end
