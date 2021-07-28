class Poker::Board < ApplicationRecord
  STATUS = Constants.new(:CREATED, :INPROGRESS, :COMPLETED)

  belongs_to :created_by, class_name: "::User"
  belongs_to :card_template, class_name: "Poker::CardTemplate", foreign_key: :poker_card_template_id, optional: true
  has_many :issues, class_name: "Poker::Issue", foreign_key: :poker_board_id, dependent: :destroy
  has_many :target_participants, class_name: "Poker::Participant", foreign_key: :poker_board_id, dependent: :destroy

  def get_invitation_token
    Base64.encode64("#{id}:#{created_by_id}:#{board_unique_string}")
  end

  def self.get_board_by_invitation_token(token)
    id_, created_by_id_, board_unique_string_ = Base64.decode64(token)&.split(":") rescue nil
    Poker::Board.where(id: id_, created_by_id: created_by_id_, board_unique_string: board_unique_string_).take
  end
end
