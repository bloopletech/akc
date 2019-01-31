class My::ScoresController < My::BaseController
  def index
    @scores = @user.scores.current.order(created_at: :desc).includes(:user)
    render json: @scores.to_json(methods: :username, except: :rounds)
  end

  def create
    @score = @user.scores.build(score_params)
    if @score.save
      render json: @score
    else
      render json: { errors: @score.errors.full_messages }, status: 422
    end
  end

  private
  def score_params
    params.require(:score).permit(
      :scoring_version,
      :mode,
      :value,
      :streak,
      :rank,
      :outcome,
      rounds: [
        :allowedTime,
        :score,
        :streak,
        :startTime,
        :grindStart,
        :combo,
        :direction,
        :now,
        :diff,
        :delta
      ]
    )
  end
end