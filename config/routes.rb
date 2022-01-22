Rails.application.routes.draw do
  post :login, to: 'authentication#login'

  resources :doramas, only: [:create] do
    post :viewed, on: :collection
  end
end
