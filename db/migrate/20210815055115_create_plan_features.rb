class CreatePlanFeatures < ActiveRecord::Migration[6.1]
  def change
    create_table :plan_features do |t|
      t.references :plan, null: false, foreign_key: { to_table: :plans, name: :plan_features_plan_id_fkey }
      t.references :feature, null: false, foreign_key: { to_table: :features, name: :plan_features_feature_id_fkey }
      t.jsonb :config

      t.index [:plan_id, :feature_id], unique: true

      t.timestamps
    end
  end
end
