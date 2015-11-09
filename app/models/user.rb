class User < ActiveRecord::Base


  has_many :events, :foreign_key => :owner_id

  has_many :participants
  has_many :participates, :class_name => Event, :through => :participants


end
