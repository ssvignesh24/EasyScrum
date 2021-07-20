class UsersController < ApplicationController
  before_action :validate_user_params, only: :create
  
  def new
    @errors = {}
    @data = {}
    @user = User.first
  end

  def create
    @user = User.new(name: user_params[:name], email: user_params[:email], password: user_params[:password], admin_user: true)
    token = SecureRandom.hex(64)
    32.times do |_|
      token = SecureRandom.hex(64)
      computed_token = OpenSSL::HMAC.hexdigest('sha1', ENV['HASH_SALT'], token)
      next if User.where(verification_token: computed_token).take.present?
      @user.verification_token = computed_token
      break
    end
    @user.save!
    UsersMailer.send_email_verification(@user.id, token).deliver_later
  end

  def verify_email
    user = User.active.where(email: params[:email]).take
    show_error("Invalid link") and return unless user.present?
    computed_token = OpenSSL::HMAC.hexdigest('sha1', ENV['HASH_SALT'], params[:token])
    if user.verification_email_sent_at && user.verification_email_sent_at > 3.days.ago && computed_token == user.verification_token
      user.update!(verified_at: Time.zone.now)
      sign_in(user)
      redirect_to root_path
    else
      show_error("Either the token is not valid or the link has expired") and return
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end

  def validate_user_params
    @errors = {}
    if user_params[:name].blank?
      @errors[:name] = 'Name is blank'
    elsif user_params[:name].size <= 1
      @errors[:name] = 'Name is too short'
    end


    if user_params[:email].blank?
      @errors[:email] = 'Email is empty'
    elsif !Mail::Address.new(user_params[:email]).domain.present?
      @errors[:email] = 'Email is invalid'
    elsif User.where(email: user_params[:email]).presence
      @errors[:email] = 'Email already exists, please try logging in'
    end

    password_error = PasswordValidator.validate(user_params[:password])
    @errors[:password] = password_error if password_error.present?
    
    if @errors.present?
      @data = user_params
      render action: :new, layout: 'application'
    end
  end

  def show_error(error)
    flash[:alert] = error
    redirect_to signup_path
  end
end
