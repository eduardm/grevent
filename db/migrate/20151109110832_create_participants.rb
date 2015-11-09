class CreateParticipants < ActiveRecord::Migration
  def change
    create_table :participants do |t|
      t.integer :user_id
      t.integer :event_id
      t.datetime :accepted_on
      t.timestamps null: false
    end
  end
end
