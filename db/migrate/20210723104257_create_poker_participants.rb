class CreatePokerParticipants < ActiveRecord::Migration[6.1]
  def change
    create_table :poker_participants do |t|
      t.references :poker_board, null: false, foreign_key: { to_table: :poker_boards, name: :poker_participants_poker_board_id_fkey }
      t.references :participant, null: false, polymorphic: true
      t.boolean :is_spectator, null: false

      t.index [:poker_board_id, :participant_id, :participant_type], unique: true, name: :poker_unique_participants_idx

      t.timestamps
    end
  end
end
