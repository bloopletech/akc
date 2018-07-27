class User < ApplicationRecord
  # Associations
  has_many :scores

  # Validations
  validates :token, presence: true, uniqueness: true
end