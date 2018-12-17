class ScoresController < ApplicationController
  def index
    @scores = Score.all.order(value: :desc).limit(100).includes(:user)
    render json: @scores.to_json(methods: :username, except: :rounds)
  end
end