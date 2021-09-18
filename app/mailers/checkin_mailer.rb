class CheckinMailer < ApplicationMailer
  helper ApplicationHelper

  def send_issue(response_id, token, current_time)
    response = Checkin::Response.where(id: response_id).take
    return unless response
    @participant = response.participant.participant
    return if @participant.class != Guest && !@participant.active?
    issue = response.issue
    @checkin = issue.checkin
    return if @checkin.is_paused? || !@checkin.active?
    response.sent_at = Time.zone.now
    @date = current_time.to_date.to_formatted_s(:long)
    @expiry_time = (issue.issue_time + 24.hours).to_formatted_s(:long)
    @token = token
    mail subject: "#{@checkin.title} - #{@date}", to: @participant.email
  end

  def send_report(issue_id, email)
    @issue = Checkin::Issue.where(id: issue_id).take
    @checkin = @issue.checkin
    @questions = @issue.questions
    @responses = @issue.responses.order("responded_at ASC NULLS LAST").includes(:answers, participant: :participant)
    @date = @issue.issue_time.to_date.to_formatted_s(:long)
    @blocker_count = @issue.blocker_count
    mail(subject: "Checkin report: #{@checkin.title} - #{@date}", to: email)
  end
end
