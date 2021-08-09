class CreateRetroParticipants < ActiveRecord::Migration[6.1]
  def change
    create_table :retro_participants do |t|
      t.references :retro_board, null: false, foreign_key: { to_table: :retro_boards, name: :retro_participants_retro_board_id_fkey, on_delete: :cascade }
      t.references :participant, null: false, polymorphic: true

      t.index [:retro_board_id, :participant_id, :participant_type], unique: true, name: :retro_unique_participants_idx

      t.timestamps
    end
  end
end
