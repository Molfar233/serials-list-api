class CreateDoramas < ActiveRecord::Migration[7.0]
  def change
    create_table :doramas do |t|
      t.string :link, null: false
      t.integer :status, null: false
      t.references :user, index: true

      t.timestamps
    end
  end
end
