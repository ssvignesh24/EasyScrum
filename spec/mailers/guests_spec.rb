require "rails_helper"

RSpec.describe GuestsMailer, type: :mailer do
  describe "send_email_otp" do
    let(:mail) { GuestsMailer.send_email_otp }

    it "renders the headers" do
      expect(mail.subject).to eq("Send email otp")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

end
