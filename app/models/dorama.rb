class Dorama < ApplicationRecord
  belongs_to :user

  enum status: [:viewed, :bookmarked, :watching]

  validates :link, presence: true
  validates :name, presence: true
  validates :status, inclusion: { in: Dorama.statuses.keys }
end
