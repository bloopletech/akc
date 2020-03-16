class AddUsernamesForExisting < ActiveRecord::Migration[5.2]
  def change
    User.where(username: nil).each do |user|
      user.update!(username: "Anonymous-#{SecureRandom.alphanumeric(8)}")
    end
  end
end
