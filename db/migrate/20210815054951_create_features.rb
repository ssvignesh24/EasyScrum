class CreateFeatures < ActiveRecord::Migration[6.1]
  def change
    create_table :features do |t|
      t.text :name, null: false
      t.string :key, null: false
      t.text :description
      t.boolean :globally_enabled, null: false
      t.boolean :default_state, null: false
      t.boolean :active, null: false

      t.index :key, unique: true

      t.timestamps
    end
  end
end
