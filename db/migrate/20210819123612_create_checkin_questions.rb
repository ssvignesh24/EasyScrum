class CreateCheckinQuestions < ActiveRecord::Migration[6.1]
  def change
    create_table :checkin_questions do |t|
      t.references :checkin_checkin, null: false, foreign_key: { to_table: :checkin_checkins, name: :checkin_questions_checkin_id_fkey, on_delete: :cascade }
      t.text :prompt, null: false
      t.string :answer_type, null: false
      t.boolean :is_blocker_question, null: false
      t.text :description
      t.boolean :is_mandatory, null: false
      t.jsonb :config
      t.boolean :deleted, null: false
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
