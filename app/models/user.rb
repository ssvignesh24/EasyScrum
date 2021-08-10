class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable,  and :omniauthable
  devise :database_authenticatable, :registerable, :lockable, :timeoutable, :trackable,
         :recoverable, :rememberable, :validatable
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

end
