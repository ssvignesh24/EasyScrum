class UsersMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.users_mailer.send_email_verification.subject
  #
  def send_email_verification(user_id, token)
    @user = User.active.where(id: user_id).take
    return unless @user.present?
    @token = token
    @user.update verification_email_sent_at: Time.zone.now
    mail subject: "Email verification | EasyScrum", to: @user.email
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.users_mailer.send_invitation.subject
  #
  def send_invitation
    @greeting = "Hi"

    mail to: "to@example.org"
  end
end
