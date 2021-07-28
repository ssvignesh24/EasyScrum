class Poker::Issue < ApplicationRecord
  STATUS = Constants.new(:ADDED, :SELECTED, :VOTING, :SKIPPED, :VOTED, :FINISHED)
  belongs_to :board, class_name: "Poker::Board", foreign_key: :poker_board_id
  has_many :votes, class_name: "Poker::Vote", foreign_key: :poker_issue_id, dependent: :destroy

  def update_status_time
    case status
    when STATUS.VOTING
      self.update!(voting_started_at: Time.zone.now, voting_completed_at: nil, points_assigned_at: nil)
    when STATUS.VOTED
      self.update!(voting_completed_at: Time.zone.now, points_assigned_at: nil)
    when STATUS.FINISHED
      self.update!(points_assigned_at: Time.zone.now)
    end
  end
end
