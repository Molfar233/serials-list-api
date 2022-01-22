class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :nickname, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :token

      t.timestamps
    end
  end
end
