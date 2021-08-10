class Power::UsersController < PowerController
  def index
    @users = User.all.order(:active)
  end

  def show
    @user = User.where(id: params[:id]).take
    unless @user.present?
      flash[:notice] = "Invalid user"
      redirect_to power_users_path 
    end
  end
end
