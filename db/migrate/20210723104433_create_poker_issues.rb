class CreatePokerIssues < ActiveRecord::Migration[6.1]
  def change
    create_table :poker_issues do |t|
      t.references :poker_board, null: false, foreign_key: { to_table: :poker_boards, name: :poker_issues_poker_board_id_fkey }
      t.text :summary, null: false
      t.text :description
      t.text :link
      t.boolean :is_ghost, null: false
      t.string :status, null: false
      t.string :final_story_point
      t.string :avg_story_point
      t.string :total_votes

      t.index :status

      t.timestamps
    end
  end
end
