class Guest < ApplicationRecord
  belongs_to :parent_user, class_name: "User"
end
