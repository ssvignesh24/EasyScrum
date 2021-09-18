class Checkin::SendReportsWorker
  include Sidekiq::Worker

  def perform(issue_id)
    issue = Checkin::Issue.where(id: issue_id).take
    raise CheckinError::IssueError.new("Invalid issue ID: #{issue_id}") unless issue.present?
    issue.update!(report_started_at: Time.zone.now, report_details: {})
    report_recipients = issue.checkin.send_report_to_emails
    Array.wrap(report_recipients).each do |email|
      begin
        CheckinMailer.send_report(issue_id, email).deliver_now
        issue.report_details[email] = Time.zone.now
        issue.save!
      rescue => e
        ErrorReporter.send(e)
        next
      end
    end
    issue.update!(report_completed_at: Time.zone.now)
    issue.checkin.update!(last_report_sent_at: Time.zone.now)
  end
end
