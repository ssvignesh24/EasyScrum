class CreateRetroBoards < ActiveRecord::Migration[6.1]
  def change
    create_table :retro_boards do |t|
      t.text :name, null: false
      t.bigint :created_by_id, null: false, foreign_key: { to_table: :users, name: :retro_boards_user_id_fkey }
      t.text :context
      t.string :status, null: false
      t.references :retro_template, foreign_key: { to_table: :retro_templates, name: :retro_boards_retro_template_id_fkey }
      t.text :board_unique_string, null: false
      t.boolean :archived, null: false

      t.index :archived
      t.index :status
      t.index :board_unique_string, unique: true

      t.timestamps
    end
  end
end
