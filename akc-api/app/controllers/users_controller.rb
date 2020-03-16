class UsersController < ApplicationController
  def create
    @user = User.create!(token: SecureRandom.hex(16), username: "Anonymous-#{SecureRandom.alphanumeric(8)}")
    render json: @user
  end
end