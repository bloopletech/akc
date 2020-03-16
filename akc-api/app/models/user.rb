class User < ApplicationRecord
  # Associations
  has_many :scores

  # Validations
  validates :token, presence: true, uniqueness: true
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 30 }
end