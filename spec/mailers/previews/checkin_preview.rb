# Preview all emails at http://localhost:3000/rails/mailers/checkin
class CheckinPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/checkin/send_issue
  def send_issue
    CheckinMailer.send_issue
  end

end
