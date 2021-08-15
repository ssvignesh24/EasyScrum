class CreatePlans < ActiveRecord::Migration[6.1]
  def change
    create_table :plans do |t|
      t.text :name, null: false
      t.string :key, null: false
      t.text :description
      t.boolean :active, null: false

      t.index :key, unique: true

      t.timestamps
    end
  end
end
