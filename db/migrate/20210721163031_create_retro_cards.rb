class CreateRetroCards < ActiveRecord::Migration[6.1]
  def change
    create_table :retro_cards do |t|
      t.references :retro_column, null: false, foreign_key: { to_table: :retro_columns, name: :retro_cards_retro_column_id_fkey, on_delete: :cascade }
      t.text :message, null: false
      t.references :retro_participant, null: false, foreign_key: { to_table: :retro_participants, name: :retro_comments_retro_participant_id_fkey }
      t.integer :position, null: false

      t.index :position

      t.timestamps
    end
  end
end
