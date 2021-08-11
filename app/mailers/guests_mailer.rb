class GuestsMailer < ApplicationMailer

  def send_email_otp(guest_id)
    @guest = Guest.where(id: guest_id).take
    return unless @guest.present?
    @guest.email_otp = nil
    10.times do
      @token = (rand * 1000000).to_i
      computed_token = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, "#{@token}:#{@guest.id}")
      next if Guest.where(email_otp: computed_token).take.present?
      @guest.email_otp = computed_token
      @guest.email_otp_sent_at = Time.zone.now
      break
    end
    return if @guest.email_otp.nil?
    @guest.save!
    mail to: @guest.email, subject: "Verify your identity in EasyScrum"
  end
end
