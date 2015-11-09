require 'rails_helper'


#API tests, requests are done against URLs
RSpec.describe "Events", type: :request do

  let(:create_json) do
    {
        :event => {
            name: "My event",
            description: "Nice event description",
            start_time: Time.now,
            end_time: Time.now + 10.days
        },
        venue_name: "Nice location",
        venue_address: "1st Nice Street, 10000 Nice City"
    }.to_json
  end

  let(:valid_json) do
    {
        name: "My event",
        description: "Nice event description",
        start_time: Time.now,
        end_time: Time.now + 10.days
    }.to_json
  end

  let(:invalid_json) do
    {
        name: nil,
        description: "Nice event description",
        start_time: Time.now,
        end_time: Time.now + 10.days,
        venue_name: "Nice location",
        venue_address: "1st Nice Street, 10000 Nice City"
    }.to_json
  end




  describe "GET #events.json" do
    it "assigns all events as @events" do
      event = FactoryGirl.create(:event)
      get events_path, format: :json
      expect(assigns(:events)).to eq([event])
    end
  end

  describe "GET #event/x.json" do
    it "assigns the requested event as @event" do
      event = FactoryGirl.create(:event)
      get event_path(event), :format => :json
      expect(assigns(:event)).to eq(event)
    end
  end


  describe "POST #events.json" do
    context "with valid params" do
      it "creates a new Event" do
        expect {
          post events_path, create_json, { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' }
        }.to change(Event, :count).by(1)
      end
    end

  end

  describe "PUT #events.json" do
    context "with valid params" do
      let(:new_json) do
        {
            name: "My NEW event name",
            description: "Nice event description",
            start_time: Time.now,
            end_time: Time.now + 10.days,
            venue_name: "Nice location",
            venue_address: "1st Nice Street, 10000 Nice City"
        }.to_json
      end

      it "updates the requested event" do
        event = FactoryGirl.create(:event)
        updated_before = event.updated_at
        sleep 1
        put event_path(event), new_json, { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' }
        event.reload
        updated_after = event.updated_at
        expect(updated_before).to be < updated_after
      end
    end

    context "with invalid params" do
      it "assigns the event as @event" do
        event = FactoryGirl.create(:event)
        put event_path(event), invalid_json, { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' }
        expect(assigns(:event)).to eq(event)
      end
    end
  end

  describe "DELETE #event/x.json" do
    it "destroys the requested event" do
      event = FactoryGirl.create(:event)
      deleted = Event.deleted.count
      expect {
        delete event_path(event.to_param)
      }.to change(Event, :count).by(0) #nothing is deleted, just status is changed
      expect {
        (deleted + 1).to eq(Event.deleted.count)
      }
    end

  end
end


#normal HTML requests tests, requests are done against actions in controllers
RSpec.describe EventsController, type: :controller do


  let(:create_params) do
    {
        :event => {
          name: "My event",
          description: "Nice event description",
          start_time: Time.now,
          end_time: Time.now + 10.days
        },
        venue_name: "Nice location",
        venue_address: "1st Nice Street, 10000 Nice City"
    }
  end

  let(:valid_attributes) do
    {
        name: "My event",
        description: "Nice event description",
        start_time: Time.now,
        end_time: Time.now + 10.days
    }
  end

  let(:invalid_attributes) do
    {
        name: nil,
        description: "Nice event description",
        start_time: Time.now,
        end_time: Time.now + 10.days,
        venue_name: "Nice location",
        venue_address: "1st Nice Street, 10000 Nice City"
    }
  end




  describe "GET #index" do
    it "assigns all events as @events" do
      event = FactoryGirl.create(:event)
      get :index, {}, {}
      expect(assigns(:events)).to eq([event])
    end
  end

  describe "GET #show" do
    it "assigns the requested event as @event" do
      event = FactoryGirl.create(:event)
      get :show, {:id => event.to_param}
      expect(assigns(:event)).to eq(event)
    end
  end

  describe "GET #new" do
    it "assigns a new event as @event" do
      get :new, {}, {}
      expect(assigns(:event)).to be_a_new(Event)
    end
  end

  describe "GET #edit" do
    it "assigns the requested event as @event" do
      event = FactoryGirl.create(:event)
      get :edit, {:id => event.to_param}, {}
      expect(assigns(:event)).to eq(event)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new Event" do
        expect {
          post :create, create_params, {}
        }.to change(Event, :count).by(1)
      end

      it "assigns a newly created event as @event" do
        post :create, create_params, {}
        expect(assigns(:event)).to be_a(Event)
        expect(assigns(:event)).to be_persisted
      end

      it "redirects to the created event" do
        post :create, create_params, {}
        expect(response).to redirect_to(Event.last)
      end
    end

    context "with invalid params" do
      it "assigns a newly created but unsaved event as @event" do
        post :create, {:event => invalid_attributes}, {}
        expect(assigns(:event)).to be_a_new(Event)
      end

      it "re-renders the 'new' template" do
        post :create, {:event => invalid_attributes}, {}
        expect(response).to render_template("new")
      end
    end
  end

  describe "PUT #update" do
    context "with valid params" do
      let(:new_attributes) do
        {
            name: "My NEW event name",
            description: "Nice event description",
            start_time: Time.now,
            end_time: Time.now + 10.days,
            venue_name: "Nice location",
            venue_address: "1st Nice Street, 10000 Nice City"
        }
      end

      it "updates the requested event" do
        event = Event.create! valid_attributes
        updated_before = event.updated_at
        sleep 1
        put :update, {:id => event.to_param, :event => new_attributes}, {}
        event.reload
        updated_after = event.updated_at
        expect(updated_before).to be < updated_after
        expect(event.name).to eq(new_attributes[:name])
      end

      it "assigns the requested event as @event" do
        event = Event.create! valid_attributes
        put :update, {:id => event.to_param, :event => valid_attributes}, {}
        expect(assigns(:event)).to eq(event)
      end

      it "redirects to the event" do
        event = Event.create! valid_attributes
        put :update, {:id => event.to_param, :event => valid_attributes}, {}
        expect(response).to redirect_to(event)
      end
    end

    context "with invalid params" do
      it "assigns the event as @event" do
        event = Event.create! valid_attributes
        put :update, {:id => event.to_param, :event => invalid_attributes}, {}
        expect(assigns(:event)).to eq(event)
      end

      it "re-renders the 'edit' template" do
        event = Event.create! valid_attributes
        put :update, {:id => event.to_param, :event => invalid_attributes}, {}
        expect(response).to render_template("edit")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested event" do
      event = Event.create! valid_attributes
      expect {
        delete :destroy, {:id => event.to_param}, {}
      }.to change(Event, :count).by(0)
    end

    it "redirects to the events list" do
      event = Event.create! valid_attributes
      delete :destroy, {:id => event.to_param}, {}
      expect(response).to redirect_to(events_url)
    end
  end

end
