class AddColumnConfigToRetroBoards < ActiveRecord::Migration[6.1]
  def change
    add_column :retro_boards, :config, :jsonb, default: {}
  end
end
