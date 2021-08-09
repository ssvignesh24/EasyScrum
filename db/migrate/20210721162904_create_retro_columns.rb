class CreateRetroColumns < ActiveRecord::Migration[6.1]
  def change
    create_table :retro_columns do |t|
      t.references :retro_board, null: false, foreign_key: { to_table: :retro_boards, name: :retro_columns_retro_board_id_fkey, on_delete: :cascade }
      t.string :name, null: false
      t.string :color_code, null: false
      t.string :sort_by, null: false
      t.integer :position, null: false

      t.index :position

      t.timestamps
    end
  end
end
