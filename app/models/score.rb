class Score < ApplicationRecord
  # Associations
  belongs_to :user

  # Validations
  validates :mode, presence: true, inclusion: { in: ['touch', 'keyboard'] }
  validates :value, presence: true
  validates :streak, presence: true
  validates :rank, presence: true
end