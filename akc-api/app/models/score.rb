class Score < ApplicationRecord
  CURRENT_VERSION = 2

  # Associations
  belongs_to :user

  # Validations
  validates :scoring_version, presence: true
  validates :mode, presence: true, inclusion: { in: ['touch', 'keyboard'] }
  validates :value, presence: true
  validates :streak, presence: true
  validates :rank, presence: true
  validates :outcome, presence: true, inclusion: { in: ['incorrect', 'timeExceeded', 'keyAutoRepeat'] }
  validates :rounds, presence: true

  def self.current
    where(scoring_version: CURRENT_VERSION)
  end

  def username
    user.username
  end
end