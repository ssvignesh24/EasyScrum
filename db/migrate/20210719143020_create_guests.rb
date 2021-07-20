class CreateGuests < ActiveRecord::Migration[6.1]
  def change
    create_table :guests do |t|
      t.bigint :parent_user_id, null: false, foreign_key: { to_table: :users, name: :guests_parent_user_id_fkey }
      t.string :name, null: false
      t.string :email, null: false

      t.timestamps

      t.index :parent_user_id
      t.index :email
    end

  end
end
