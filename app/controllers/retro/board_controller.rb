class Retro::BoardController < ApiController
  before_action :set_board, only: [:show, :destroy, :rename, :remove_participant]
  before_action :authenticate_user!, except: [:index, :show]
  before_action :enure_permission!, except: [:index, :create, :show]

  def index
    @retro_boards = current_resource.retro_boards.order(created_at: :desc).includes(:action_items)
  end

  def create
    ApiError::InvalidParameters.new({name: "Name is empty"}) if retro_params[:name].strip.blank?
    last_board = nil
    @retro_board = Retro::Board.new(created_by: current_user, name: retro_params[:name].strip).tap do |r|
      r.status = Retro::Board::STATUS.CREATED
      r.archived = false
      r.context = retro_params[:context].strip
      r.config = { anonymous_card: retro_params[:anonymous_card] }
      if retro_params[:template_id]
        if retro_params[:template_id].to_i == -1
          last_board = current_user.created_retro_boards.order(created_at: :desc).first
        elsif !retro_params[:template_id].to_i.zero?
          template = Retro::Template.where(id: retro_params[:template_id]).take
          r.template = template if template.present?
        end
      end
      r.board_unique_string = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, "#{current_user.id}:#{Time.zone.now.to_i}:#{SecureRandom.hex(12)}")
    end
    Retro::Board.transaction do
      @retro_board.save!
      if last_board.present?
        columns = last_board.columns
        columns.each do |col|
          @retro_board.columns.create!(name: col.name, color_code: col.color_code, sort_by: 'default', position: col.position)
        end
      end
      @retro_board.target_participants.create!(participant: current_user)
      session["invite_user_r_#{@retro_board.id}".to_sym] = true
    end
  rescue => e
    ErrorReporter.send(e)
    raise ApiError::BadRequest.new("Something went wrong")
  end

  def show
    if @board.created_by == current_resource
      @show_invite_modal = session["invite_user_r_#{@board.id}".to_sym]
      session.delete("invite_user_r_#{@board.id}".to_sym)
    end
  end

  def destroy
    @board.destroy!
  end

  def rename
    raise ApiError::InvalidParameters.new("Invalid name", { name: "Name is empty"}) if params[:name].blank?
    @board.update(name: params[:name])
  end

  def remove_participant
    raise ApiError::Forbidden.new("Action now allowed") if current_user != @board.created_by
    @participant = @board.target_participants.where(id: params[:participant_id]).take
    raise ApiError::Forbidden.new("You can't remove yourself!") if @participant.participant == current_user
    raise ApiError::NotFound.new("Participant not found") unless @participant.present?
    RetroBoardChannel.broadcast_to(@board,  { status: true, type: 'remove_participant', participantId: @participant.id })
    @participant.destroy!
  end

  private

  def retro_params
    params.require(:retro).permit(:name, :template_id, :context, :anonymous_card)
  end

  def guest_params
    params.require(:guest).permit(:name, :email)
  end

  def enure_permission!
    raise ApiError::Forbidden.new("Action now allowed") unless can_modify_retro_board?(@board)
  end

  def default_broadcast_hash
    {
      status: true,
      originParticipantId: @board.target_participants.where(participant: current_resource).take&.id
    }
  end
end
