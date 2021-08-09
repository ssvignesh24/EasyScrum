class CreatePokerIssues < ActiveRecord::Migration[6.1]
  def change
    create_table :poker_issues do |t|
      t.references :poker_board, null: false, foreign_key: { to_table: :poker_boards, name: :poker_issues_poker_board_id_fkey, on_delete: :cascade }
      t.text :summary, null: false
      t.text :description
      t.text :link
      t.boolean :is_ghost, null: false
      t.boolean :is_selected, null: false, default: false
      t.string :status, null: false
      t.string :final_story_point
      t.string :total_votes
      t.datetime :selected_at
      t.datetime :voting_started_at
      t.datetime :voting_completed_at
      t.datetime :points_assigned_at

      t.index :status

      t.timestamps
    end
  end
end
