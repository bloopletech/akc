class ScoresController < ApplicationController
  def index
    @scores = Score.current.order(value: :desc).limit(100).includes(:user)
    render json: @scores.to_json(methods: :username, except: :rounds)
  end

  def show
    @score = Score.find(params[:id])
    render json: @score.to_json(methods: :username)
  end
end