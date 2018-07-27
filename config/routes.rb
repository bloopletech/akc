Rails.application.routes.draw do
  resources :users, only: [:create]

  resources :scores, only: [:index]

  namespace :my do
    resources :scores, only: [:index, :create]
  end
end
