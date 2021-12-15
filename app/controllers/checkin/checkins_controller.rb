class Checkin::CheckinsController < ApiController
  before_action :set_checkin, only: [:show, :edit, :update, :destroy, :toggle_pause]
  before_action :authenticate_user!, only: [:create, :edit, :update, :destroy, :toggle_pause]
  before_action :can_manage_checkin!, only: [:edit, :update, :destroy, :toggle_pause]

  def index
    @checkins = current_resource.class == User ? current_user.created_checkins.active : current_resource.checkins.active
  end

  def show
  end

  def create
    Checkin::Checkin.transaction do
      @checkin = Checkin::Checkin.new(title: checkin_params[:title].strip, description: checkin_params[:description].strip,).tap do |checkin|
        checkin.created_by = current_user
        checkin.account = current_user.account
        checkin.send_days = get_send_days
        checkin.send_at_user_timezone = false
        checkin.medium = [Checkin::Checkin::MEDIUM.EMAIL]
        checkin.is_paused = false
        checkin.active = true
        checkin.send_at_time = checkin_params[:time].strip
        checkin.needs_report = checkin_params[:send_report_at].present? && checkin_params[:report_emails].size > 0
        checkin.send_report_after_in_hours = checkin_params[:send_report_at]
        checkin.send_report_to_emails = validate_emails_array(checkin_params[:report_emails])
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

  def edit
  end

  def update
    Checkin::Checkin.transaction do
      @checkin.update!(
        title: checkin_params[:title].strip,
        description: checkin_params[:description].strip,
        send_days: get_send_days,
        send_at_time: checkin_params[:time].strip,
        needs_report: checkin_params[:send_report_at].present? && checkin_params[:report_emails].size > 0,
        send_report_after_in_hours: checkin_params[:send_report_at],
        send_report_to_emails: validate_emails_array(checkin_params[:report_emails])
      )
      @checkin.participants.update_all(active: false)
      Array.wrap(checkin_params[:emails]).map { |e| e.to_s.strip.presence }.compact.uniq.each do |email|
        @checkin.create_participant!(email: email, user: current_user)
      end
      @checkin.questions.where.not(id: checkin_params[:questions].map{ |q| q[:id] }).update_all(deleted: true, deleted_at: Time.zone.now)
      Array.wrap(checkin_params[:questions]).each do |question|
        next if question[:id].present?
        @checkin.create_question!(question)
      end
    end
  end

  def destroy
    @checkin.destroy!
  end

  def toggle_pause
    @checkin.update!(is_paused: !@checkin.is_paused)
  end

  def respond
    token = params[:token].strip
    email = params[:email].strip
    render_response_error("Invalid token") and return unless token.present? && email.present?
    @response = Checkin::Response.from_token(token)
    @resource = User.where(email: email).take || Guest.where(email: email).take
    unless @resource.present? && @response.present? && @response&.participant&.participant == @resource
      render_response_error("Invalid token")
      return 
    end
    if(@resource.class == Guest && !@resource.name.present?)
      signature = Base64.encode64({token: token, origin: 'checkin'}.to_json)
      redirect_to complete_path(signature: signature)
      return
    end
    @issue = @response.issue
    @checkin = @issue.checkin
    @questions = @issue.questions
    render layout: 'checkin_response'
  end

  private
  
  def render_response_error(error)
    @error = error
  end

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
        questions: [:prompt, :description, :isMandatory, :isCritical, :id, options: [], answerType: [:name, :key]]
      )
  end

  def get_send_days
    given_days = checkin_params[:days].map(&:downcase)
    sorted_days = []
    sorted_days << "monday" if given_days.include?("monday")
    sorted_days << "tuesday" if given_days.include?("tuesday")
    sorted_days << "wednesday" if given_days.include?("wednesday")
    sorted_days << "thursday" if given_days.include?("thursday")
    sorted_days << "friday" if given_days.include?("friday")
    sorted_days << "saturday" if given_days.include?("saturday")
    sorted_days << "sunday" if given_days.include?("sunday")
    sorted_days
  end
end
