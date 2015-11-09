class Event < ActiveRecord::Base


  belongs_to :owner, :class_name => User
  belongs_to :location

  has_many :attendees, :class_name => User, :through => :participants

  before_validation :set_duration_and_end_time

  validate :wrong_intervals

  with_options unless: :is_draft? do |event|
    event.validates :name, presence: true
    event.validates :description, presence: true
    event.validates :start_time, presence: true
    event.validates :end_time, presence: true
    event.validates :duration, presence: true
  end

  scope :active, -> { where(status: EVENT_STATUS[:active]) }
  scope :draft, -> { where(status: EVENT_STATUS[:draft]) }
  scope :expired, -> { where(status: EVENT_STATUS[:expired]) }
  scope :deleted, -> { where(status: EVENT_STATUS[:deleted]) }



  EVENT_STATUS = {
      draft: 0,
      active: 1,
      expired: 2,
      deleted: 3
  }


  def is_created(venue)
    return self.save if venue.save
    self.valid?
    self.validate_venue(venue)
    false
  end

  def validate_venue(venue)
    venue.errors.each do |k,v|
      self.errors.add(k,v)
    end
  end

  private

  def is_draft?
    EVENT_STATUS[:draft] == self.status
  end

  def wrong_intervals
    if self.start_time && self.end_time && self.start_time > self.end_time
      self.errors.add(:end_time, I18n.translate(:date_overlap_validation))
    end
  end

  def set_duration_and_end_time
    self.end_time ? self.duration = self.end_time - self.start_time : self.end_time = self.start_time + self.duration * 3600 * 24 if self.start_time && (self.end_time || self.duration)
  end






end
