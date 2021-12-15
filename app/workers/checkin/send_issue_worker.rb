class Checkin::SendIssueWorker
  include Sidekiq::Worker

  def perform(issue_id, current_time)
    issue = Checkin::Issue.where(id: issue_id).take
    checkin = issue.checkin
    response_map = {}
    Checkin::Response.transaction do
      checkin.participants.each do |checkin_participant|
        participant = checkin_participant.participant
        next if participant.class != Guest && !participant.active?
        retries = 0
        response = nil
        begin
          loop do
            retries += 1
            token = SecureRandom.hex(64)
            computed_token = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, token)
            if issue.responses.where(token: computed_token).take.present?
              raise CheckinError::ResponseError.new("Token not unique") if retries > 3
              next
            end
            response = issue.responses.create!(participant: checkin_participant, medium: Checkin::Checkin::MEDIUM.EMAIL, token: computed_token)
            response_map[response.id] = token
            issue.increment!(:no_of_participants_sent)
            break
          end
          CheckinError::ResponseError.new("Unable to create response for participant #{participant.id} in issue #{issue_id}") if response.nil?
        rescue CheckinError::ResponseError => e
          ErrorReporter.send(e)
          next
        end
      end
      issue.update!(completed_at: Time.zone.now)
      if checkin.needs_report && checkin.send_report_after_in_hours > 0
        Checkin::SendReportsWorker.perform_in(checkin.send_report_after_in_hours.hours.from_now, issue.id) 
      end
    end
    response_map.each do |response_id, token|
      CheckinMailer.send_issue(response_id, token, current_time).deliver_later
    end
  end
end
