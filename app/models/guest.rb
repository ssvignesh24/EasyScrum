class Guest < ApplicationRecord
  belongs_to :parent_user, class_name: "User"
  has_many :retro_board_participants, class_name: "Retro::Participant", as: :participant
  has_many :retro_boards, through: :retro_board_participants,  source: :board 
  has_many :poker_board_participants, class_name: "Poker::Participant", as: :participant
  has_many :poker_boards, through: :poker_board_participants,  source: :board
  has_many :feedbacks, as: :feedback_by
  has_many :checkin_participants, class_name: "Checkin::Participant", as: :participant
  has_many :checkins, through: :checkin_participants,  source: :checkin

  delegate :can_access?, to: :parent_user

  def name_or_email
    name.blank? ? email : name
  end

  def avatar_url
    # return unless avatar.attached?
    # ENV['HOST'].chop + Rails.application.routes.url_helpers.rails_representation_url(avatar.variant(resize_to_limit: [180, 180]).processed, host: ENV['HOST'], only_path: true)
    return nil
  end
end
