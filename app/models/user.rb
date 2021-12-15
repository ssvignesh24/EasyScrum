require 'open-uri'

class User < ApplicationRecord
  DEFAULT_TIMEZONE = "Asia/Kolkata".freeze
  DEFAULT_LOCALE = "en".freeze
  # Include default devise modules. Others available are:
  # :confirmable
  devise :database_authenticatable, :registerable, :lockable, :timeoutable, :trackable,
         :recoverable, :rememberable, :validatable, :omniauthable
  belongs_to :account, optional: true
  has_many :guests, foreign_key: :parent_user_id
  has_many :created_retro_boards, class_name: "Retro::Board", foreign_key: :created_by_id
  has_many :created_poker_boards, class_name: "Poker::Board", foreign_key: :created_by_id
  has_many :retro_board_participants, class_name: "Retro::Participant", as: :participant
  has_many :retro_boards, through: :retro_board_participants,  source: :board 
  has_many :poker_board_participants, class_name: "Poker::Participant", as: :participant
  has_many :poker_boards, through: :poker_board_participants,  source: :board
  has_many :feedbacks, as: :feedback_by
  has_many :checkin_participants, class_name: "Checkin::Participant", as: :participant
  has_many :participated_checkins, through: :checkin_participants,  source: :checkin
  has_many :created_checkins, class_name: "Checkin::Checkin", foreign_key: :created_by_id
  
  has_one_attached :avatar do |attachable|
    attachable.variant :thumb, resize_to_limit: [180, 180]
  end
  
  scope :active, -> { where(active: true) }
  scope :inactive, -> { where(active: false) }

  def active_for_authentication?
    (verification_token.present? && verified_at.present?) || (invitation_token.present? && invitation_accepted_at.present?)
  end

  def name_or_email
    name.blank? ? email : name
  end
  
  def avatar_url
    return unless avatar.attached?
    ENV['HOST'].chop + Rails.application.routes.url_helpers.rails_representation_url(avatar.variant(resize_to_limit: [180, 180]).processed, host: ENV['HOST'], only_path: true)
  end

  def checkins
    Checkin::Checkin.where(id: participated_checkins.map(&:id) + created_checkins.map(&:id))
  end

  def self.from_omniauth(access_token, create_if_not_found=false)
    data = access_token.info
    user = User.where(email: data['email']).first

    if user.nil? && create_if_not_found
      current_time = Time.zone.now
      user = User.create!(name: data['name'], email: data['email'], password: Devise.friendly_token[0,20],
          verification_token: SecureRandom.hex(32), verification_email_sent_at: current_time, verified_at: current_time,
          admin_user: true, power_user: false, active: true )
      avatar_name = data['image'].split("/").last
      user.avatar.attach(io: open(data['image']), filename: "#{user.id}-#{SecureRandom.hex(5)}-#{avatar_name}")
    end
    [data['email'].present?, user]
  end

  def plan
    if account.nil?
      Plan.basic 
    else
      raise "Not implemented"
    end
  end

  def can_access?(key)
    return false unless key.present?
    plan.can_access?(key).present?
  end

  def feature_config(key)
    plan.can_access?(key).try(:config)
  end
end
