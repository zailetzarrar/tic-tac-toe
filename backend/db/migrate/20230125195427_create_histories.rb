class CreateHistories < ActiveRecord::Migration[7.0]
  def change
    create_table :histories do |t|
      t.string :player
      t.integer :won

      t.timestamps
    end
  end
end
