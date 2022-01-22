class User < ApplicationRecord
  has_secure_password

  validates :nickname, presence: true, uniqueness: true
end
