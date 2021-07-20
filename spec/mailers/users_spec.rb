require "rails_helper"

RSpec.describe UsersMailer, type: :mailer do
  describe "send_email_verification" do
    let(:mail) { UsersMailer.send_email_verification }

    it "renders the headers" do
      expect(mail.subject).to eq("Send email verification")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

  describe "send_invitation" do
    let(:mail) { UsersMailer.send_invitation }

    it "renders the headers" do
      expect(mail.subject).to eq("Send invitation")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

end
