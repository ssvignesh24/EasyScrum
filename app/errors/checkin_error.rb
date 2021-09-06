module CheckinError
  
  class IssueError < StandardError
    def initialize(message)
      super(message)
    end
  end

  class ResponseError < StandardError
    def initialize(message)
      super(message)
    end
  end

end