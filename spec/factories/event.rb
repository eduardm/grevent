require 'faker'

FactoryGirl.define do

  factory :event do |f|
    f.name { Faker::Name.name }
    f.owner_id { 1 }
    f.description {Faker::Lorem.paragraph(2, false, 4)}
    f.start_time { Time.now + 1.hours}
    f.end_time {Time.now + 30.days}
    f.status { Event::EVENT_STATUS[:active] }
  end


end