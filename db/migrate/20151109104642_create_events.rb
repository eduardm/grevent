class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :name
      t.integer :owner_id
      t.text :description
      t.datetime :start_time
      t.datetime :end_time
      t.integer :duration
      t.integer :status, :limit => 1
      t.integer :location_id
      t.timestamps null: false
    end
  end
end
