class Power::UsersController < PowerController
  def index
    @users = User.all.order(active: :desc, created_at: :desc)
  end

  def show
    @user = User.where(id: params[:id]).take
  end
end
