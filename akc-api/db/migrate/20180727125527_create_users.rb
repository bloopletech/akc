class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :token
      t.timestamps
    end
    
    add_column :scores, :user_id, :integer
  end
end
