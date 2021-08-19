class CreateCheckinIssues < ActiveRecord::Migration[6.1]
  def change
    create_table :checkin_issues do |t|
      t.references :checkin_checkin, null: false, foreign_key: { to_table: :checkin_checkins, name: :checkin_issues_checkin_id_fkey }
      t.date :issue_date, null: false
      t.datetime :started_at, null: false
      t.datetime :completed_at
      t.integer :no_of_participants, null: false
      t.integer :no_of_participants_sent, null: false
      t.integer :no_of_participants_responded, null: false

      t.index :issue_date

      t.timestamps
    end
  end
end
