class CreatePokerCardTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :poker_card_templates do |t|
      t.string :name, null: false
      t.text :cards, null: false

      t.timestamps
    end
  end
end
