class CreateRetroTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :retro_templates do |t|
      t.text :name, null: false
      t.text :description, null: false
      t.jsonb :columns, null: false
      t.boolean :active, null: false

      t.timestamps
    end
  end
end
