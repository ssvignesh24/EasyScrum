class Poker::Issue < ApplicationRecord
  STATUS = Constants.new(:ADDED, :SELECTED, :VOTING, :SKIPPED, :VOTED, :FINISHED)
  belongs_to :board, class_name: "Poker::Board", foreign_key: :poker_board_id
  has_many :votes, class_name: "Poker::Vote", foreign_key: :poker_issue_id, dependent: :destroy
end
