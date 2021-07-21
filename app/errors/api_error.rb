module ApiError
  
  class BadRequest < StandardError
    def initialize(message)
      super(message)
    end
  end

  class Forbidden < StandardError
    def initialize(message)
      super(message)
    end
  end

  class NotFound < StandardError
    def initialize(message)
      super(message)
    end
  end

  class InvalidParameters < StandardError
    attr_accessor :errors
    def initialize(message, errors={})
      super(message)
      @errors = errors
    end
  end
end