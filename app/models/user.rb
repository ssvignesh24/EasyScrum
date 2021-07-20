class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable,  and :omniauthable
  devise :database_authenticatable, :registerable, :lockable, :timeoutable, :trackable,
         :recoverable, :rememberable, :validatable
  belongs_to :account, optional: true
  has_many :guests, foreign_key: :parent_user_id
  
  scope :active, -> { where(active: true) }

  def active_for_authentication?
    (verification_token.present? && verified_at.present?) || (invitation_token.present? && invitation_accepted_at.present?)
  end

end
