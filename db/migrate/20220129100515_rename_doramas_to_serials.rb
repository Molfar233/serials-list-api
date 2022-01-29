class RenameDoramasToSerials < ActiveRecord::Migration[7.0]
  def change
    rename_table :doramas, :serials
  end
end
