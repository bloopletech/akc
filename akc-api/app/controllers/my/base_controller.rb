class My::BaseController < ApplicationController
  before_action :authenticate_user

  def user
    @user
  end

  private
  def authenticate_user
    token = if params.key?(:access_token)
      params.delete(:access_token)
    elsif request.headers.key?("Authorization")
      if request.headers["Authorization"] =~ /\Atoken (.*?)\Z/
        $1
      else
        nil
      end
    end

    if token.blank?
      render json: { errors: ["You must supply an access token."] }
      return
    end

    @user = User.find_by(token: token)

    unless @user
      render json: { errors: ["The access token you have supplied is invalid."] }
      return
    end
  end
end