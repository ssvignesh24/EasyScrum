class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :name
      t.references :account, foreign_key: { to_table: :accounts, name: :users_account_id_fkey, on_delete: :cascade}
      
      t.text :invitation_token
      t.datetime :invited_at
      t.integer :invited_by_id, foreign_key: { to_table: :users, name: :users_invited_by_id_fkey }
      t.datetime :invitation_accepted_at

      t.text :verification_token
      t.datetime :verification_email_sent_at
      t.datetime :verified_at

      t.boolean :admin_user, default: false, null: false
      t.boolean :power_user, default: false, null: false
      t.boolean :active, default: true, null: false

      t.timestamps

      t.index :invited_at
      t.index :invitation_accepted_at
      t.index :active
      t.index :invitation_token, unique: true
    end

    
  end
end
