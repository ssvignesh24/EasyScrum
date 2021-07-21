class Retro::Board < ApplicationRecord
  STATUS = Constants.new(:CREATED, :INPROGRESS, :COMPLETED)
  
  belongs_to :created_by, class_name: "::User"
  belongs_to :template, class_name: "Retro::Template", foreign_key: :retro_template_id, optional: true
  has_many :columns, class_name: "Retro::Column", foreign_key: :retro_board_id
  has_many :target_participants, class_name: "Retro::Participant", foreign_key: :retro_board_id
end
