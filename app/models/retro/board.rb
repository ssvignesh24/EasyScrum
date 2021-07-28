class Retro::Board < ApplicationRecord
  STATUS = Constants.new(:CREATED, :INPROGRESS, :COMPLETED)
  
  belongs_to :created_by, class_name: "::User"
  belongs_to :template, class_name: "Retro::Template", foreign_key: :retro_template_id, optional: true
  has_many :columns, class_name: "Retro::Column", foreign_key: :retro_board_id, dependent: :destroy
  has_many :target_participants, class_name: "Retro::Participant", foreign_key: :retro_board_id, dependent: :destroy

  def get_invitation_token
    Base64.encode64("#{id}:#{created_by_id}:#{board_unique_string}")
  end

  def self.get_board_by_invitation_token(token)
    id_, created_by_id_, board_unique_string_ = Base64.decode64(token)&.split(":") rescue nil
    Retro::Board.where(id: id_, created_by_id: created_by_id_, board_unique_string: board_unique_string_).take
  end
end
