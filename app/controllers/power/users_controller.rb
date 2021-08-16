class Power::UsersController < PowerController
  def index
    @users = User.all.order(:active)
  end

  def show
    @user = User.where(id: params[:id]).take
  end
end
