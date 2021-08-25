class CreateCheckinAnswers < ActiveRecord::Migration[6.1]

  def up
    create_table :checkin_answers do |t|
      t.references :checkin_response, null: false, foreign_key: { to_table: :checkin_responses, name: :checkin_answers_response_id_fkey}
      t.references :checkin_question, null: false, foreign_key: { to_table: :checkin_questions, name: :checkin_answers_question_id_fkey}
      t.text :answer_text
      t.bigint :answer_number
      t.string :answer_select
      t.text :answer_checkbox, array: true
      t.integer :answer_rating
      t.datetime :answer_datetime
      t.date :answer_date
      t.time :answer_time

      t.timestamps
    end

    safety_assured do
      execute <<-SQL
        ALTER TABLE checkin_answers
          ADD CONSTRAINT "answer_present_check" CHECK (
            num_nonnulls(
              answer_text,
              answer_number,
              answer_select, 
              answer_checkbox,
              answer_rating,
              answer_datetime,
              answer_date,
              answer_time
            ) = 1) NOT VALID
      SQL
      execute 'ALTER TABLE checkin_answers VALIDATE CONSTRAINT "answer_present_check"'
    end
  end

  def down
    safety_assured do
      execute 'ALTER TABLE checkin_answers DROP CONSTRAINT "answer_present_check"'
      drop_table :checkin_answers
    end
  end
end
