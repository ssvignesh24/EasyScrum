class AddUserTimezoneAndLocaleToUsersAndAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :user_timezone, :string, default: User::DEFAULT_TIMEZONE
    add_column :users, :user_locale, :string, default: User::DEFAULT_LOCALE
  end
end
