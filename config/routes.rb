Rails.application.routes.draw do
  post :login, to: 'authentication#login'

  resources :serials, only: [:index, :create, :destroy] do
    get :status, on: :collection
  end

end
