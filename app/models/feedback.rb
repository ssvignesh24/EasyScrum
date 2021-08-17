class Feedback < ApplicationRecord
  belongs_to :feedback_by, polymorphic: true
end
