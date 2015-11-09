class EventsController < ApplicationController
  before_action :set_event, only: [:show, :edit, :update, :destroy]

  # GET /events
  # GET /events.json
  def index
    @events = Event.active
    respond_to do |format|
      format.html { render :index }
      format.json { render :json => @events.to_json(:include => [:location => {:only => [:id, :venue_name, :venue_address]}]) }
    end
  end

  # GET /events/1
  # GET /events/1.json
  def show
    respond_to do |format|
      format.html { redirect_to :action => :index} #not implemented
      format.json { render :json => @event.to_json(:include => [:location => {:only => [:id, :venue_name, :venue_address]}]) }
    end
  end

  # GET /events/new
  def new
    @event = Event.new
    @venue = Location.new
  end

  # GET /events/1/edit
  def edit
  end

  # POST /events
  # POST /events.json
  def create
    @venue = Location.new(venue_name: params[:venue_name], venue_address: params[:venue_address])
    @event = Event.new(event_params)
    @event.owner = current_user

    respond_to do |format|
      if @event.is_created(@venue)
        format.html { redirect_to events_url, notice: I18n.translate(:event_created) }
        format.json { render :json => @event.to_json(:include => [:location => {:only => [:id, :venue_name, :venue_address]}]), status: :created }
      else
        format.html { render :new }
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /events/1
  # PATCH/PUT /events/1.json
  def update
    respond_to do |format|
      if @event.update(event_params)
        format.html { redirect_to events_url, notice: I18n.translate(:event_updated) }
        format.json { render :json => @event.to_json(:include => [:location => {:only => [:id, :venue_name, :venue_address]}]), status: :updated }
      else
        format.html { render :edit }
        format.json { render json: @event.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /events/1
  # DELETE /events/1.json
  def destroy
    @event.update_attribute(:status, Event::EVENT_STATUS[:deleted])
    respond_to do |format|
      format.html { redirect_to events_url, notice: I18n.translate(:event_deleted) }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event
      @event = Event.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def event_params
      params.require(:event).permit(:name, :description, :start_time, :end_time, :duration, :status)
    end


end
