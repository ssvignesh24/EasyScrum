class Retro::ActionItem < ApplicationRecord
  STATUS = Constants.new(:PENDING, :COMPLETED)

  belongs_to :board, class_name: "Retro::Board", foreign_key: :retro_board_id
  belongs_to :created_by, class_name: "::User"
  belongs_to :assigned_to, polymorphic: true, optional: true

end
