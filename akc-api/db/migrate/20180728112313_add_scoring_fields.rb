class AddScoringFields < ActiveRecord::Migration[5.2]
  def change
    add_column :scores, :streak, :integer
    add_column :scores, :rank, :string
  end
end
