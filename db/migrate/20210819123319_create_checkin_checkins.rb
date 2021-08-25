class CreateCheckinCheckins < ActiveRecord::Migration[6.1]
  def change
    create_table :checkin_checkins do |t|
      t.references :account, foreign_key: { to_table: :accounts, name: :checkin_checkins_account_id_fkey, on_delete: :cascade  }
      t.references :created_by, null: false, foreign_key: { to_table: :users, name: :checkin_checkins_created_by_id_fkey  }
      t.string :title, null: false
      t.text :description
      t.text :send_days, array: true, null: false
      t.time :send_at_time, null: false
      t.boolean :send_at_user_timezone, null: false
      t.text :medium, array: true, null: false
      t.datetime :last_sent_at
      t.integer :remind_after
      t.boolean :is_paused, null: false
      t.boolean :needs_summary, null: false
      t.integer :send_report_after_in_hours
      t.datetime :last_report_sent_at
      t.boolean :active, null: false

      t.timestamps

      t.index :last_sent_at
      t.index :send_days, using: :gin
    end
  end
end
