class CreateCheckinParticipants < ActiveRecord::Migration[6.1]
  def change
    create_table :checkin_participants do |t|
      t.references :checkin_checkin, null: false, foreign_key: { to_table: :checkin_checkins, name: :checkin_participants_checkin_id_fkey, on_delete: :cascade }
      t.references :participant, polymorphic: true
      t.boolean :active, null: false

      t.index [:checkin_checkin_id, :participant_id], unique: true, name: :unique_checkin_participants_idx

      t.timestamps
    end
  end
end
