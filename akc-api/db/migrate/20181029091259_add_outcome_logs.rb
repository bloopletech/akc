class AddOutcomeLogs < ActiveRecord::Migration[5.2]
  def change
    add_column :scores, :outcome, :string
    add_column :scores, :rounds, :jsonb
  end
end
