class Retro::Board < ApplicationRecord
  STATUS = Constants.new(:CREATED, :INPROGRESS, :COMPLETED)
  
  belongs_to :created_by, class_name: "::User"
  belongs_to :template, class_name: "Retro::Template", foreign_key: :retro_template_id, optional: true
  has_many :columns, class_name: "Retro::Column", foreign_key: :retro_board_id, dependent: :destroy
  has_many :target_participants, class_name: "Retro::Participant", foreign_key: :retro_board_id, dependent: :destroy
  has_many :action_items, class_name: "Retro::ActionItem", foreign_key: :retro_board_id, dependent: :destroy

  after_create :create_columns_from_template, if: -> { template.present? }

  def get_invitation_token
    Base64.encode64("r:#{id}:#{created_by_id}:#{board_unique_string}")
  end

  def self.get_board_by_invitation_token(token)
    invite_for, id_, created_by_id_, board_unique_string_ = Base64.decode64(token)&.split(":") rescue nil
    invite_for == "r" && Retro::Board.where(id: id_, created_by_id: created_by_id_, board_unique_string: board_unique_string_).take
  end

  def previous_retro
    created_by.created_retro_boards.where("created_at < ?", created_at).order(created_at: :desc).take
  end

  def participant_id_of(resource)
    return unless resource
    target_participants.where(participant: resource).take&.id
  end

  private

  def create_columns_from_template
    Retro::Board.transaction do
      template.columns.each_with_index do |col, index|
        self.columns.create!(name: col['name'], color_code: col['color_code'], sort_by: 'default', position: index + 1)
      end
    end
  end
end
