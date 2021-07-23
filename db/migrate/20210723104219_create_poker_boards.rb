class CreatePokerBoards < ActiveRecord::Migration[6.1]
  def change
    create_table :poker_boards do |t|
      t.text :name, null: false
      t.bigint :created_by_id, null: false, foreign_key: { to_table: :users, name: :retro_boards_user_id_fkey }
      t.references :poker_card_template, foreign_key: { to_table: :poker_card_templates, name: :poker_boards_poker_card_template_id_fkey }
      t.string :status, null: false
      t.text :board_unique_string, null: false
      t.boolean :archived, null: false
      t.boolean :active, null: false

      t.index :board_unique_string, unique: true
      t.index :archived
      t.index :active

      t.timestamps
    end
  end
end
