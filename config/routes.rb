require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
  root to: 'home#index'

  get 'signup' => "users#new"
  post 'signup' => "users#create"
  get 'verify_email' => 'users#verify_email'
  
  get "/power" => "power#index"

  scope :invite do
    get ":invite_for/:token" => "guests#new"
    post ":invite_for/:token" => "guests#send_email_otp", as: :new_guest
    get ":invite_for/verify_email/:token" => "guests#get_otp"
    post ":invite_for/verify_email/:token" => "guests#verify_email", as: :create_guest
    get ':invite_for/continue/:token/' => "guests#continue_as_existing_guest", as: :continue_as_existing_guest
  end
  delete "guests/exit" => "guests#exit"

  constraints lambda { |req| req.format == :json } do
    # resources :users, only: [:update, :destroy]
    put "profile" => "users#update"
    delete "profile" => "users#destroy"

    resources :feedbacks, only: :create

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

    resources :checkins, only: [:index, :create, :show, :update, :destroy], controller: 'checkin/checkins', param: :checkin_id

    namespace :power do
      resources :users
      resources :features, param: :feature_id do
        member do
          post 'toggle'
        end
      end
    end

    scope :power do
      resources :feedbacks, only: :index
    end
  end

  constraints lambda { |req| req.format == :html && !req.path.starts_with?("/rails/active_storage") && !req.path.starts_with?("/power")} do
    get '*path' => 'main#index'
  end

  authenticate :user, lambda { |u| u.power_user? } do
    mount Sidekiq::Web => '/power/jobs'
    constraints lambda { |req| req.format == :html && req.path.starts_with?("/power") } do
      get '*path' => 'power#index'
    end
  end
  
end
