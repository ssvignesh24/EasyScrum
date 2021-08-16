class GuestsController < ApplicationController
  def new
    @invite_for = params[:invite_for]
    @token = params[:token]
    case @invite_for
    when 'retro' then @board = Retro::Board.get_board_by_invitation_token(@token)
    when 'poker' then @board = Poker::Board.get_board_by_invitation_token(@token)
    else
      @invalid = true
      flash[:alert] = "Invalid invite link"
    end
  end

  def send_email_otp
    @invite_for = params[:invite_for]
    @token = params[:token]
    case @invite_for
    when 'retro' then @board = Retro::Board.get_board_by_invitation_token(@token)
    when 'poker' then @board = Poker::Board.get_board_by_invitation_token(@token)
    else
      @invalid = true
      flash[:alert] = "Invalid invite link"
    end
    return unless validate_guest_params
    guest = Guest.where(email: guest_params[:email], parent_user_id: @board.created_by).first_or_initialize
    guest.name = guest_params[:name].strip
    guest.save!
    cookies.encrypted[:temp_gid] = guest.id
    GuestsMailer.send_email_otp(guest.id).deliver_now
    redirect_to create_guest_path(token: @token, invite_for: @invite_for)
  end

  def get_otp
    @invite_for = params[:invite_for]
    @token = params[:token]
    case @invite_for
    when 'retro' then @board = Retro::Board.get_board_by_invitation_token(@token)
    when 'poker' then @board = Poker::Board.get_board_by_invitation_token(@token)
    else
      @invalid = true
      flash[:alert] = "Invalid invite link"
    end
    @guest = Guest.where(id: cookies.encrypted[:temp_gid], parent_user_id: @board.created_by).where("email_otp_sent_at >= ?", 15.minutes.ago).take
    show_invitation_error("Invalid invite link") unless @guest.present?
  end

  def verify_email
    @invite_for = params[:invite_for]
    @token = params[:token]
    case @invite_for
    when 'retro' then @board = Retro::Board.get_board_by_invitation_token(@token)
    when 'poker' then @board = Poker::Board.get_board_by_invitation_token(@token)
    else
      @invalid = true
      flash[:alert] = "Invalid invite link"
    end
    show_otp_error("Invalid OTP") and return if params[:otp].blank? || params[:otp].size > 8
    guest = Guest.where(id: cookies.encrypted[:temp_gid], parent_user_id: @board.created_by).where("email_otp_sent_at >= ?", 15.minutes.ago).take
    show_invitation_error("Invalid invite link") and return unless guest.present?
    computed_otp = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, "#{params[:otp].strip}:#{guest.id}")
    show_otp_error("Invalid OTP") and return unless guest.email_otp == computed_otp
    sign_out(current_user) if current_user
    cookies.encrypted[:guest_id] = guest.id
    cookies.delete(:temp_gid)
    case @board.class.to_s
    when "Poker::Board"
      participant = Poker::Participant.where(board: @board, participant: guest, is_spectator: false).first_or_create!
      PokerBoardChannel.broadcast_to(@board,  {status: true, type: 'new_participant', participant: { id: participant.id, email: participant.participant.email, name: participant.participant.name } })
      redirect_to "/poker/board/#{@board.id}"
    when "Retro::Board"
      participant = Retro::Participant.where(board: @board, participant: guest).first_or_create!
      RetroBoardChannel.broadcast_to(@board,  {status: true, type: "new_participant", name: guest.name, id: guest.id, participant_id: participant.id })
      redirect_to retro_board_path(@board.id)
    else
      show_invitation_error("Invalid invitation link") and return
    end
  end

  def exit
    cookies.delete(:guest_id)
    redirect_to '/dashboard'
  end

  private

  def guest_params
    params.require(:guest).permit(:name, :email)
  end

  def show_invitation_error(error)
    flash[:alert] = error
    redirect_to new_guest_path(token: params[:token], invite_for: params[:invite_for])
  end

  def show_otp_error(error)
    flash[:alert] = error
    redirect_to create_guest_path(token: params[:token], invite_for: params[:invite_for])
  end

  def validate_guest_params
    if guest_params[:email].blank? && guest_params[:name].blank?
      show_invitation_error("Both name and email are empty") and return false
    elsif guest_params[:email].blank?
      show_invitation_error("Email is empty") and return false
    elsif guest_params[:name].blank?
      show_invitation_error("Name is empty") and return false
    elsif !Mail::Address.new(guest_params[:email]).domain.present?
      show_invitation_error("Invalid email address") and return false
    end
    return true
  end

  def get_board_from_token(invite_for, token)
    case invite_for
    when 'retro' then return Retro::Board.get_board_by_invitation_token(token)
    when 'poker' then return Poker::Board.get_board_by_invitation_token(token)
    else show_invitation_error("Invalid invite link") and return nil
    end
  end

  def create_signature(token, name, email, otp)
    otp = (rand * 1000000).to_i
    signature_token = Base64.encode64("#{name}:#{email}:#{Time.zone.now.to_i}:#{token}:#{otp}")
    signature = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, signature_token)
    new_token = Base64.encode64("#{name}:#{email}:#{Time.zone.now.to_i}:#{token}:#{signature}")
    return [new_token, signature]
  end

  def verify_signature(token, otp)
    name, email, timestamp, token, signature = Base64.decode64(token)&.split(":")
    signature_token = Base64.encode64("#{name}:#{email}:#{timestamp}:#{token}:#{otp}")
    computed_token = OpenSSL::HMAC.hexdigest('sha1', Rails.application.credentials.SALT, "#{token}:#{otp}")
    computed_token == signature_token
  end
  
end
