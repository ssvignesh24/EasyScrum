class CreateRetroParticipants < ActiveRecord::Migration[6.1]
  def change
    create_table :retro_participants do |t|
      t.references :retro_board, null: false, foreign_key: { to_table: :retro_boards, name: :retro_participants_retro_board_id_fkey }
      t.references :participant, null: false, polymorphic: true

      t.timestamps
    end
  end
end
