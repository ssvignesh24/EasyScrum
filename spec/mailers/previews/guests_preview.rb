# Preview all emails at http://localhost:3000/rails/mailers/guests
class GuestsPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/guests/send_email_otp
  def send_email_otp
    GuestsMailer.send_email_otp
  end

end
