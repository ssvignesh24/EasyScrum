module ApplicationCable
  class Connection < ActionCable::Connection::Base
    rescue_from StandardError, with: :report_error
    identified_by :current_resource

    def connect
      self.current_resource = find_verified_user
    end

    protected

    def find_verified_user
      user = env['warden'].user
      user = Guest.where(id: cookies.encrypted[:guest_id]).take if !user.present? && cookies.encrypted[:guest_id].present?
      return user if user.present?
      reject_unauthorized_connection
    end
    
    private
    
    def report_error(e)
      ErrorReporter.send(e)
    end

  end
end
