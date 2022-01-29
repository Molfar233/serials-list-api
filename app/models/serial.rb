class Serial < ApplicationRecord
  belongs_to :user

  enum status: [:viewed, :bookmarked, :watching]

  validates :link, presence: true
  validates :name, presence: true
  validates :status, inclusion: { in: Serial.statuses.keys }
end
