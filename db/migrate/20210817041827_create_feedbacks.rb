class CreateFeedbacks < ActiveRecord::Migration[6.1]
  def change
    create_table :feedbacks do |t|
      t.references :feedback_by, null: false, polymorphic: true
      t.integer :rating, null: false
      t.text :feedback_comment

      t.timestamps
    end
  end
end
