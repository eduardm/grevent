require 'rails_helper'

RSpec.describe Event, type: :model do


  context "check validations for publishing events" do
    it "has a valid factory" do
      FactoryGirl.create(:event).should be_valid
    end

    it "is invalid withoud a name" do
      FactoryGirl.build(:event, name: nil).should_not be_valid
    end

    it "is invalid without description" do
      FactoryGirl.build(:event, description: nil).should_not be_valid
    end

    it "is invalid without start time" do
      FactoryGirl.build(:event, start_time: nil).should_not be_valid
    end

    it "is invalid without end time and without duration" do
      FactoryGirl.build(:event, end_time: nil).should_not be_valid
    end

    it "is valid with either end_time or duration" do
      FactoryGirl.build(:event, end_time: nil, duration: 20).should be_valid
    end

    it "is invalid if end_time is sooner than start time" do
      FactoryGirl.build(:event, end_time: Time.now - 10.days).should_not be_valid
    end

  end

  context "check validations for saving draft events" do
    it "has a valid factory" do
      FactoryGirl.create(:event, status: Event::EVENT_STATUS[:draft]).should be_valid
    end

    it "is invalid withoud a name" do
      FactoryGirl.build(:event, name: nil, status: Event::EVENT_STATUS[:draft]).should be_valid
    end

    it "is invalid without description" do
      FactoryGirl.build(:event, description: nil, status: Event::EVENT_STATUS[:draft]).should be_valid
    end

    it "is invalid without start time" do
      FactoryGirl.build(:event, start_time: nil, status: Event::EVENT_STATUS[:draft]).should be_valid
    end

    it "is invalid without end time and without duration" do
      FactoryGirl.build(:event, end_time: nil, status: Event::EVENT_STATUS[:draft]).should be_valid
    end

    it "is valid with either end_time or duration" do
      FactoryGirl.build(:event, end_time: nil, duration: 20, status: Event::EVENT_STATUS[:draft]).should be_valid
    end

    it "is invalid if end_time is sooner than start time" do
      FactoryGirl.build(:event, end_time: Time.now - 10.days, status: Event::EVENT_STATUS[:draft]).should_not be_valid
    end

  end

  context "scopes should work" do
    before :each do
      @active_event_1 = FactoryGirl.create(:event)
      @active_event_2 = FactoryGirl.create(:event)
      @draft_event_1 = FactoryGirl.create(:event, status: Event::EVENT_STATUS[:draft])
      @draft_event_2 = FactoryGirl.create(:event, status: Event::EVENT_STATUS[:draft])
      @expired_event_1 = FactoryGirl.create(:event, status: Event::EVENT_STATUS[:expired])
      @expired_event_2 = FactoryGirl.create(:event, status: Event::EVENT_STATUS[:expired])
      @deleted_event_1 = FactoryGirl.create(:event, status: Event::EVENT_STATUS[:deleted])
      @deleted_event_2 = FactoryGirl.create(:event, status: Event::EVENT_STATUS[:deleted])
    end


    it "should find active events" do
      Event.active.should include @active_event_1
      Event.active.should include @active_event_2
      Event.active.size.should eql 2
    end

    it "should find draft events" do
      Event.draft.should include @draft_event_1
      Event.draft.should include @draft_event_2
      Event.draft.size.should eql 2
    end

    it "should find expired events" do
      Event.expired.should include @expired_event_1
      Event.expired.should include @expired_event_2
      Event.expired.size.should eql 2
    end

    it "should find deleted events" do
      Event.deleted.should include @deleted_event_1
      Event.deleted.should include @deleted_event_2
      Event.deleted.size.should eql 2
    end
  end



end
