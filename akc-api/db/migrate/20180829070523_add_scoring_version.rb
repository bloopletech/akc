class AddScoringVersion < ActiveRecord::Migration[5.2]
  def change
    add_column :scores, :scoring_version, :integer
  end
end
