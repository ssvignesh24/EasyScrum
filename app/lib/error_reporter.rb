class ErrorReporter
  def self.send(exception, context=nil)
    if Rails.env.development? || Rails.env.testing?
      p "*" * 50
      p "Exception: \n"
      p exception&.message
      p exception&.backtrace
      p "*" * 50
    else
      Sentry.capture_exception(exception)
    end
    
  end
end