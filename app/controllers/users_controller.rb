class UsersController < ApplicationController
  def create
    @user = User.create!(token: SecureRandom.hex(16))
    render json: @user
  end
end