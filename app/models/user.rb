class User < ApplicationRecord
  # Associations
  has_many :scores

  # Validations
  validates :token, presence: true, uniqueness: true
  validates :username, uniqueness: true
end