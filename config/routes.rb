Rails.application.routes.draw do
  namespace :retro do
    get 'cards/create'
    get 'cards/update'
    get 'cards/destroy'
    get 'cards/vote'
    get 'cards/unvote'
    get 'cards/add_comment'
    get 'cards/remove_comment'
  end
  
  devise_for :users
  root to: 'main#redirect'

  get 'signup' => "users#new"
  post 'signup' => "users#create"
  get 'verify_email' => 'users#verify_email'

  constraints lambda { |req| req.format == :json } do
    namespace :retro do
      resources :board, except: [:new, :edit], param: :board_id do
        member do
          resources :columns, only: [:create, :update, :destroy], param: :column_id do
            member do
              resources :cards, only: [:create, :update, :destroy], param: :card_id do
                member do
                  post 'comment' => "cards#add_comment"
                  delete 'comment' => "cards#remove_comment"
                end
              end
            end
          end
        end
      end
    end
  end

  # authenticate :user, lambda { |u| u.power_user? } do
  #   mount Sidekiq::Web => '/power/jobs'
  # end
  
  constraints lambda { |req| req.format == :html && !req.path.include?("/rails/active_storage/blobs") } do
    get '*path' => 'main#index'
  end
  
end
