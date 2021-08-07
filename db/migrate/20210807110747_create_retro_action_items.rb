class CreateRetroActionItems < ActiveRecord::Migration[6.1]
  def change
    create_table :retro_action_items do |t|
      t.references :retro_board, null: false, foreign_key: { to_table: :retro_boards, name: :retro_action_items_retro_board_id_fkey }
      t.text :action_message, null: false
      t.string :status, null: false
      t.bigint :created_by_id, null: false, foreign_key: { to_table: :users, name: :retro_action_items_created_by_id_fkey }
      t.references :assigned_to, polymorphic: true

      t.index :status

      t.timestamps
    end
  end
end
