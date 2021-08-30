class Checkin::Checkin < ApplicationRecord
  MEDIUM = Constants.new(:EMAIL)
  
  belongs_to :account, optional: true
  belongs_to :created_by, class_name: "::User"
  has_many :questions, class_name: "Checkin::Question", foreign_key: :checkin_checkin_id
  has_many :issues, class_name: "Checkin::Issue", foreign_key: :checkin_checkin_id
  has_many :participants, class_name: "Checkin::Participant", foreign_key: :checkin_checkin_id
  
  validates :title, :send_days, :send_at_time, :medium, presence: true

  scope :active, -> { where(active: true) }
  scope :not_paused, -> { where(is_paused: false) }

  def create_participant!(email: , name: "", user: nil)
    user = user || created_by
    guest = Guest.where(email: email).take
    guest = Guest.create!(email: email, parent_user: user, name: name) unless guest
    participants.where(participant: guest).first_or_create!
  end
  
  def create_question!(q)
    q_hash =
      q.slice(:prompt, :description)
        .merge({
          answer_type: q[:answerType][:key],
          is_blocker_question: q[:isCritical],
          is_mandatory: q[:isMandatory],
          config: Array.wrap(q[:options]).map{ |o| o.strip.presence}.compact.uniq,
          deleted: false
        }) 
    questions.create!(q_hash)
  end
end
