Rails.application.routes.draw do
  
  devise_for :users
  root to: 'main#redirect'

  get 'signup' => "users#new"
  post 'signup' => "users#create"
  get 'verify_email' => 'users#verify_email'

  constraints lambda { |req| req.format == :json } do
  end

  # authenticate :user, lambda { |u| u.power_user? } do
  #   mount Sidekiq::Web => '/power/jobs'
  # end
  
  constraints lambda { |req| req.format == :html && !req.path.include?("/rails/active_storage/blobs") } do
    get '*path' => 'main#index'
  end
  
end
