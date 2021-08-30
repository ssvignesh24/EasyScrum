class Checkin::CheckinsController < ApiController
  before_action :set_checkin, only: [:show, :update, :destroy]

  def index
    @checkins = current_resource.class == User ? current_user.created_checkins.active : current_resource.checkins.active
  end

  def show
  end

  def create
    Checkin::Checkin.transaction do
      @checkin = Checkin::Checkin.new(checkin_params.slice(:title, :description)).tap do |checkin|
        checkin.created_by = current_user
        checkin.account = current_user.account
        checkin.send_days = checkin_params[:days].map(&:downcase)
        checkin.send_at_user_timezone = false
        checkin.medium = [Checkin::Checkin::MEDIUM.EMAIL]
        checkin.is_paused = false
        checkin.active = true
        checkin.send_at_time = checkin_params[:time]
        checkin.needs_report = checkin_params[:send_report_at].present? && checkin_params[:report_emails].size > 0
        checkin.send_report_after_in_hours = checkin_params[:send_report_at]
      end
      @checkin.save!
      Array.wrap(checkin_params[:emails]).map { |e| e.to_s.strip.presence }.compact.uniq.each do |email|
        @checkin.create_participant!(email: email, user: current_user)
      end
      Array.wrap(checkin_params[:questions]).each do |question|
        @checkin.create_question!(question)
      end
    end
  end

  def update
    Checkin::Checkin.transaction do

    end
  end

  def destroy
  end

  private

  def checkin_params
    params
      .require(:checkin)
      .permit(
        :title,
        :description,
        :time,
        :send_report_at,
        emails: [],
        report_emails: [],
        days: [],
        questions: [:prompt, :description, :isMandatory, :isCritical, options: [], answerType: [:name, :key]]
      )
  end

  def set_checkin
    @checkin = current_resource.checkins.where(id: params[:checkin_id]).take
    raise ApiError::NotFound.new("Invalid checkin") unless @checkin.present?
  end
end
