require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
  root to: 'home#index'

  get 'signup' => "users#new"
  post 'signup' => "users#create"
  get 'verify_email' => 'users#verify_email'
  
  get "/power" => "power#index"
  namespace :power do
    resources :users do

    end
  end

  scope :invite do
    get ":invite_for/:token" => "guests#new"
    post ":invite_for/:token" => "guests#send_email_otp", as: :new_guest
    get ":invite_for/verify_email/:token" => "guests#get_otp"
    post ":invite_for/verify_email/:token" => "guests#verify_email", as: :create_guest
  end

  constraints lambda { |req| req.format == :json } do
    # resources :users, only: [:update, :destroy]
    put "profile" => "users#update"
    delete "profile" => "users#destroy"

    namespace :poker do
      resources :boards, only: [:index, :show, :create, :update, :destroy], param: :board_id do
        member do
          post 'archive'
          put 'rename'
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
          put 'rename' => "board#rename"
          delete 'participant' => "board#remove_participant"
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
                  post 'vote' => "cards#toggle_vote"
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
  
  constraints lambda { |req| req.format == :html && !req.path.include?("/rails/active_storage") } do
    get '*path' => 'main#index'
  end

  
  
end
