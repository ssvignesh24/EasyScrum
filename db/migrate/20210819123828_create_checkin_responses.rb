class CreateCheckinResponses < ActiveRecord::Migration[6.1]
  def change
    create_table :checkin_responses do |t|
      t.references :checkin_issue, null: false, foreign_key: { to_table: :checkin_issues, name: :checkin_responses_issue_id_fkey, on_delete: :cascade }
      t.references :checkin_participant, null: false, foreign_key: { to_table: :checkin_participants, name: :checkin_responses_participant_id_fkey }
      t.string :medium, null: false
      t.text :token, null: false
      t.datetime :sent_at
      t.datetime :responded_at

      t.index :token, unique: true

      t.timestamps
    end
  end
end
