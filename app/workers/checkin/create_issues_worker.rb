class Checkin::CreateIssuesWorker
  include Sidekiq::Worker

  def perform
    current_time = Time.zone.now
    Checkin::Checkin.active.not_paused.where("last_sent_at <= ? OR last_sent_at IS NULL", 1.day.ago).each do |checkin|
      user_timezone = checkin.created_by.user_timezone
      checkin_time_today = Time.find_zone(user_timezone).parse(checkin.send_at_time)
      current_time_in_tz = current_time.in_time_zone(user_timezone)
      next unless checkin.send_days.select { |d| current_time_in_tz.public_send("#{d.downcase}?") }.present?
      if current_time_in_tz >= checkin_time_today
        participants_count = checkin.participants.select { |p| p.participant.class == Guest || p.participant.active? }.size
        issue = checkin.issues.create!(issue_time: current_time, started_at: current_time, no_of_participants: participants_count, no_of_participants_sent: 0, no_of_participants_responded: 0)
        Checkin::SendIssueWorker.perform_async(issue.id, current_time)
        checkin.update!(last_sent_at: current_time)
      end
    end
  end
end
