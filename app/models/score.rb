class Score < ApplicationRecord
  # Associations
  belongs_to :user

  # Validations
  validates :value, presence: true
end