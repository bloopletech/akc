class My::ScoresController < My::BaseController
  def index
    @scores = @user.scores.order(created_at: :desc)
    render json: @scores
  end

  def create
    @score = @user.scores.build(score_params)
    if @score.save
      render json: @score
    else
      render json: { errors: @score.errors }
    end
  end

  private
  def score_params
    params.require(:score).permit(:value)
  end
end