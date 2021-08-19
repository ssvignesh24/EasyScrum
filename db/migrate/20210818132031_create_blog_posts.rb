class CreateBlogPosts < ActiveRecord::Migration[6.1]
  def change
    create_table :blog_posts do |t|
      t.string :title
      t.references :created_by, null: false, foreign_key: { to_table: :users, name: :blog_posts_created_by_id_fkey }
      t.string :status
      t.string :slug, null: false
      t.text :tags, array: true, null: false

      t.timestamps

      t.index :slug, unique: true
      t.index :tags, using: :gin
    end

  end
end
