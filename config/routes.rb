Rails.application.routes.draw do
  post :login, to: 'authentication#login'

  resources :doramas, only: [:index, :create, :destroy]

end
