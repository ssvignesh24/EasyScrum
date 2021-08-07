require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  devise_for :users
  root to: 'home#index'

  get 'signup' => "users#new"
  post 'signup' => "users#create"
  get 'verify_email' => 'users#verify_email'
  get 'retro/board/invite/:token' => "retro/board#accept_invitation", as: :retro_board_invitation
  post 'retro/board/invite/:token' => "retro/board#add_participant"
  get 'poker/board/invite/:token' => "poker/boards#accept_invitation", as: :poker_board_invitation
  post 'poker/board/invite/:token' => "poker/boards#add_participant"

  constraints lambda { |req| req.format == :json } do
    # resources :users, only: [:update, :destroy]
    put "profile" => "users#update"

    namespace :poker do
      resources :boards, only: [:index, :show, :create, :update, :destroy], param: :board_id do
        member do
          post 'archive'
          delete 'participant' => "boards#remove_participant"
          resources :issues, only: [:create, :destroy], param: :issue_id do
            member do
              put 'vote'
              put 'update_status'
              put 'clear_votes'
              post 'assign'
            end
          end
        end
      end
    end
    namespace :retro do
      resources :board, except: [:new, :edit], param: :board_id do
        member do
          resources :action_items, only: [:create, :destroy], param: :item_id do
            member do
              put 'toggle'
            end
          end
          resources :columns, only: [:create, :update, :destroy], param: :column_id do
            member do
              resources :cards, only: [:create, :update, :destroy], param: :card_id do
                member do
                  post 'comment' => "cards#add_comment"
                  delete 'comment' => "cards#remove_comment"
                  put 'rearrange'
                end
              end
            end
          end
        end
      end
    end
  end

  authenticate :user, lambda { |u| u.power_user? } do
    mount Sidekiq::Web => '/power/jobs'
  end
  
  constraints lambda { |req| req.format == :html && !req.path.include?("/rails/active_storage/blobs") } do
    get '*path' => 'main#index'
  end
  
end
