class CreatePokerVotes < ActiveRecord::Migration[6.1]
  def change
    create_table :poker_votes do |t|
      t.references :board_issue, null: false, foreign_key: { to_table: :poker_issues, name: :poker_votes_poker_issue_id_fkey }
      t.references :board_participant, null: false, foreign_key: { to_table: :poker_participants, name: :poker_votes_poker_participant_id_fkey }
      t.string :vote, null: false

      t.timestamps
    end
  end
end
