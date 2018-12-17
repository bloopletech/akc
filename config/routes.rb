Rails.application.routes.draw do
  root to: 'root#index'

  resources :users, only: [:create]

  resources :scores, only: [:index]

  namespace :my do
    resources :scores, only: [:index, :create]
    resource :profile, only: [:show, :update] do
      post :update
    end
  end

  resolve('Profile') { [:profile] }
end
