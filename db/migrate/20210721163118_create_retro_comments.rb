class CreateRetroComments < ActiveRecord::Migration[6.1]
  def change
    create_table :retro_comments do |t|
      t.references :retro_card, null: false, foreign_key: { to_table: :retro_cards, name: :retro_comments_retro_card_id_fkey, on_delete: :cascade }
      t.text :comment_text, null: false
      t.references :retro_participant, null: false, foreign_key: { to_table: :retro_participants, name: :retro_comments_retro_participant_id_fkey, on_delete: :cascade }

      t.timestamps
    end
  end
end
