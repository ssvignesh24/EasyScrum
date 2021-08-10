class UsersController < ApplicationController
  before_action :validate_user_params, only: :create
  before_action :authenticate_user!, except: [:new, :create, :verify_email]
  
  def new
    redirect_to "/dashboard" if current_user.present?
    @errors = {}
    @data = {}
    @user = User.first
  end

  def create
    @user = User.new(name: user_params[:name], email: user_params[:email], password: user_params[:password], admin_user: true)
    token = SecureRandom.hex(64)
    32.times do |_|
      token = SecureRandom.hex(64)
      computed_token = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, token)
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
    computed_token = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, params[:token])
    if user.verification_email_sent_at && user.verification_email_sent_at > 3.days.ago && computed_token == user.verification_token
      user.update!(verified_at: Time.zone.now)
      sign_in(user)
      redirect_to "/dashboard"
    else
      show_error("Either the token is not valid or the link has expired") and return
    end
  end

  def update
    as_api do
      name = params[:user].try(:[], :name)
      email = params[:user].try(:[], :email)
      current_password = params[:user].try(:[], :current_password)
      new_password = params[:user].try(:[], :new_password)
      needs_password_updated = false
      errors = {}
      if name.blank?
        errors[:name] = "Name is empty"
      elsif name.size <= 1
        errors[:name] = "Name is too short"
      end
      if email.blank?
        errors[:email] = "Email is empty"
      elsif !(Mail::Address.new(email).domain.present? rescue nil)
        errors[:email] = "Invalid email"
      elsif User.where(email: email).where.not(id: current_user.id).take.present? || Guest.where(email: email).take.present?
        errors[:email] = "Email already in use"
      end  
      
      if current_password.present?
        if current_user.valid_password?(current_password)
          if new_password.blank?
            errors[:new_password] = "New password is blank"
          elsif PasswordValidator.validate(new_password).present?
            errors[:new_password] = PasswordValidator.validate(new_password)
          elsif current_user.valid_password?(new_password)
            errors[:new_password] = "New password is same as the current password"
          else
            needs_password_updated = true
          end
        else
          errors[:current_password] = "Not a valid pasword"
        end
      end
      raise ApiError::InvalidParameters.new("Invalid paramters", errors) if errors.present?
      User.transaction do
        current_user.update!(name: name, email: email)
        if needs_password_updated
          current_user.update!(password: new_password)
        end
        if params[:user].try(:[], :display_picture).present?
          current_user.avatar = params[:user][:display_picture]
          current_user.save!
        end
      end
    end
  end

  def destroy
    user = current_user
    sign_out(current_user)
    user.destroy!
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
