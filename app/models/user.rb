require 'open-uri'

class User < ApplicationRecord
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
  
  has_one_attached :avatar
  
  scope :active, -> { where(active: true) }
  scope :inactive, -> { where(active: false) }

  def active_for_authentication?
    (verification_token.present? && verified_at.present?) || (invitation_token.present? && invitation_accepted_at.present?)
  end

  def avatar_url
    return unless avatar.attached?
    ENV['HOST'].chop + Rails.application.routes.url_helpers.rails_blob_path(avatar, host: ENV['HOST'], only_path: true)
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

end
