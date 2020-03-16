class AddTouchScores < ActiveRecord::Migration[5.2]
  def change
    add_column :scores, :mode, :string
  end
end
