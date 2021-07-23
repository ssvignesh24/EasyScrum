Rails.application.routes.draw do
  devise_for :users
  root to: 'main#redirect'

  get 'signup' => "users#new"
  post 'signup' => "users#create"
  get 'verify_email' => 'users#verify_email'
  get 'retro/board/invite/:token' => "retro/board#accept_invitation", as: :retro_board_invitation
  post 'retro/board/invite/:token' => "retro/board#add_participant"
  get 'poker/board/invite/:token' => "poker/boards#accept_invitation", as: :poker_board_invitation
  post 'poker/board/invite/:token' => "poker/boards#add_participant"

  constraints lambda { |req| req.format == :json } do
    namespace :poker do
      resources :boards, only: [:index, :show, :create, :update, :destroy], param: :board_id do
        member do
          post 'archive'
          resources :issues, only: [:create, :update, :destroy] do
            member do
              put 'vote'
            end
          end
        end
      end
    end
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
