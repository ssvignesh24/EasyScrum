class CreateAccounts < ActiveRecord::Migration[6.1]
  def change
    create_table :accounts do |t|
      t.string :name, null: false
      t.string :account_locale, null: false
      t.string :account_timezone, null: false
      t.boolean :verified, null: false
      t.datetime :verification_email_sent_at, null: false
      t.datetime :verified_at
      t.text :verification_token, null: false
      t.boolean :power_account, null: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end
  end
end
