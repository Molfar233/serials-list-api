class AddNameToDorama < ActiveRecord::Migration[7.0]
  def change
    add_column :doramas, :name, :string, null: false
  end
end
