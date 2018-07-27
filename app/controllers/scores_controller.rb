class ScoresController < ApplicationController
  def index
    @scores = Score.all.order(created_at: :desc)
    render json: @scores
  end
end