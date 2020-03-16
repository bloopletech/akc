class AddUsername < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :username, :text
  end
end
