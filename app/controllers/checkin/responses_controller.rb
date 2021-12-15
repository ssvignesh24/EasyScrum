class Checkin::ResponsesController < ApiController
  def set_answers
    @checkin = Checkin::Checkin.active.where(id: params[:checkin_id]).take
    raise ApiError::NotFound.new("Invalid checkin") unless @checkin.present?
    @response = Checkin::Response.from_token(params[:token])
    raise ApiError::NotFound.new("Invalid response") unless @response.present?
    raise ApiError::BadRequest.new("You have responded to this checkin already") if @response.responded_at.present?
    @issue = @response.issue
    raise ApiError::BadRequest.new("You are not allowed to respond to this checkin now") unless @response.can_respond_now?
    raise ApiError::NotFound.new("Invalid checkin") unless @issue.checkin_checkin_id == @checkin.id
    @participant = @response.participant.participant
    answers = params[:answers].presence || {}
    Checkin::Answer.transaction do
      @issue.questions.each do |question|
        answer = answers[question.id.to_s]
        next if !question.is_mandatory? && !answer.present?
        raise ApiError::BadRequest.new("Not all mandatory questions are answered") if question.is_mandatory? && !answer.present?
        answer_record = @response.answers.build(question: question)
        answer_record.set_answer(answer)
        answer_record.save!
      end
      @response.update!(responded_at: Time.zone.now)
      @issue.increment!(:no_of_participants_responded)
    end
  end
end
