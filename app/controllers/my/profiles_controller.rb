class My::ProfilesController < My::BaseController
  def show
    render json: @user
  end

  def update
    if @user.update(profile_params)
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: 422
    end
  end

  private
  def profile_params
    params.require(:profile).permit(
      :username
    )
  end
end