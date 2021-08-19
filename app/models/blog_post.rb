class BlogPost < ApplicationRecord
  STATUS = Constants.new(:DRAFT, :PUBLISHED, :INACTIVE)

  belongs_to :created_by, class_name: "User"
  has_rich_text :content
  has_one_attached :cover

  
end
