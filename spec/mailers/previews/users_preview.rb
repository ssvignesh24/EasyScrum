# Preview all emails at http://localhost:3000/rails/mailers/users
class UsersPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/users/send_email_verification
  def send_email_verification
    UsersMailer.send_email_verification
  end

  # Preview this email at http://localhost:3000/rails/mailers/users/send_invitation
  def send_invitation
    UsersMailer.send_invitation
  end

end
