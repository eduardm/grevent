class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :venue_name
      t.string :venue_address
      t.decimal :lat
      t.decimal :lng
      t.float :distance
      t.timestamps null: false
    end
  end
end
