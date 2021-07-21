class ErrorReporter
  def self.send(exception, context=nil)
    p "*" * 50
    p "Exception: \n"
    p exception&.message
    p exception&.backtrace
    p "*" * 50
  end
end