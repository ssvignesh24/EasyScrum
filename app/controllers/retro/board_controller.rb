class Retro::BoardController < ApiController
  before_action :set_board, only: [:show, :destroy]

  def index
    @retro_boards = current_user.created_retro_boards
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

  private

  def retro_params
    params.require(:retro).permit(:name, :template_id, :context)
  end
end
